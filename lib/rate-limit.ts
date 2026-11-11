import { sql } from "drizzle-orm";
import type { getDb } from "@/lib/db";
import { rateLimits } from "@/db/schema";

export const RATE_LIMIT = 10;
export const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function hitRateLimit(db: ReturnType<typeof getDb>, ip: string, now = Date.now()) {
  const windowStart = new Date(Math.floor(now / RATE_WINDOW_MS) * RATE_WINDOW_MS).toISOString();
  const [row] = await db
    .insert(rateLimits)
    .values({ ip, windowStart, count: 1 })
    .onConflictDoUpdate({
      target: [rateLimits.ip, rateLimits.windowStart],
      set: { count: sql`${rateLimits.count} + 1` },
    })
    .returning({ count: rateLimits.count });

  const retryAfter = Math.ceil((Date.parse(windowStart) + RATE_WINDOW_MS - now) / 1000);
  return { limited: row.count > RATE_LIMIT, retryAfter };
}

export function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "local"
  );
}
