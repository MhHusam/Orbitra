import { and, eq, gte } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/lib/db";
import { leads } from "@/db/schema";
import { leadSchema, type Lead } from "@/lib/validation/lead-schema";
import { clientIp, hitRateLimit } from "@/lib/rate-limit";
import { HONEYPOT } from "@/lib/validation/options";
import { errorsFrom } from "@/lib/demo-form";

const DAY_MS = 24 * 60 * 60 * 1000;
const KEY = /^[A-Za-z0-9-]{8,64}$/;

type ApiError = { error: string; message: string; fields?: Record<string, string> };
const fail = (status: number, body: ApiError, headers?: HeadersInit) =>
  Response.json(body, { status, headers });

export async function POST(request: Request) {
  const db = getDb();

  const { limited, retryAfter } = await hitRateLimit(db, clientIp(request));
  if (limited) {
    return fail(
      429,
      { error: "rate_limited", message: `Too many tries. Please wait ${Math.ceil(retryAfter / 60)} minutes and try again.` },
      { "Retry-After": String(retryAfter) },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, { error: "bad_json", message: "Send the form as a JSON object." });
  }

  if (typeof body[HONEYPOT] === "string" && body[HONEYPOT] !== "") {
    return Response.json({ ok: true, id: crypto.randomUUID() }, { status: 201 });
  }

  const idempotencyKey = request.headers.get("Idempotency-Key") ?? "";
  if (!KEY.test(idempotencyKey)) {
    return fail(400, { error: "missing_key", message: "Missing or invalid Idempotency-Key header." });
  }
  const existing = await db.select({ id: leads.id }).from(leads).where(eq(leads.idempotencyKey, idempotencyKey)).get();
  if (existing) return Response.json({ ok: true, id: existing.id, replay: true }, { status: 200 });

  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return fail(422, {
      error: "invalid_fields",
      message: "Some fields need fixing.",
      fields: errorsFrom(result.error),
    });
  }
  const lead = result.data;

  const since = new Date(Date.now() - DAY_MS).toISOString();
  const recent = await db
    .select({ id: leads.id })
    .from(leads)
    .where(and(eq(leads.email, lead.email), gte(leads.createdAt, since)))
    .get();
  if (recent) {
    return fail(409, {
      error: "duplicate",
      message: "You already booked a demo with this email in the last 24 hours. We'll be in touch soon.",
      fields: { email: "This email already booked a demo in the last 24 hours" },
    });
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  try {
    await db.insert(leads).values({
      id,
      idempotencyKey,
      email: lead.email,
      firstName: lead.firstName,
      lastName: lead.lastName,
      contactMethod: lead.contactMethod,
      phone: lead.phone ?? null,
      companyName: lead.companyName,
      companySize: lead.companySize,
      country: lead.country,
      demoDate: lead.demoDate,
      data: lead,
      createdAt,
    });
  } catch (error) {
    const winner = await db.select({ id: leads.id }).from(leads).where(eq(leads.idempotencyKey, idempotencyKey)).get();
    if (winner) return Response.json({ ok: true, id: winner.id, replay: true }, { status: 200 });
    console.error("lead insert failed", error);
    return fail(500, { error: "server_error", message: "We couldn't save your request. Please try again." });
  }

  const webhookStatus = await sendWebhook({ id, createdAt, ...lead });
  if (webhookStatus !== null) {
    await db.update(leads).set({ webhookStatus }).where(eq(leads.id, id));
  }

  return Response.json({ ok: true, id }, { status: 201 });
}

async function sendWebhook(payload: Lead & { id: string; createdAt: string }) {
  const url = webhookUrl();
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "lead.created", lead: payload }),
      signal: AbortSignal.timeout(5000),
    });
    return res.status;
  } catch (error) {
    console.error("webhook failed", error);
    return 0;
  }
}

function webhookUrl() {
  try {
    const env = getCloudflareContext().env as unknown as { WEBHOOK_URL?: string };
    return env.WEBHOOK_URL ?? process.env.WEBHOOK_URL;
  } catch {
    return process.env.WEBHOOK_URL;
  }
}
