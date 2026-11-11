"use client";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { basePath, prefersReducedMotion, SITE_URL } from "@/lib/motion";
import {
  EMPTY, STEPS, firstError, isVisible, stepOf, toInput, validateStep,
  type Errors, type FieldName, type FormValues,
} from "@/lib/demo-form";
import { HONEYPOT } from "@/lib/validation/options";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/Icon";
import { SuccessCheck } from "./SuccessCheck";
import { StepAboutYou } from "./steps/StepAboutYou";
import { StepCompany } from "./steps/StepCompany";
import { StepDemo } from "./steps/StepDemo";
import type { StepProps, TextFieldName } from "./steps/types";

const STEP_COMPONENTS = [StepAboutYou, StepCompany, StepDemo];

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "failed" }
  | { kind: "notice"; message: string }
  | { kind: "success" };

const THANK_YOU_URL = `${SITE_URL}/thank-you`;

const focusTarget = (field: FieldName) =>
  document.getElementById(field) ?? document.getElementById(`${field}-0`);

export function DemoForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const card = useRef<HTMLDivElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const direction = useRef<1 | -1>(1);
  const sending = useRef(false);
  const idempotencyKey = useRef<string>("");
  const honeypot = useRef<HTMLInputElement>(null);
  const pendingFocus = useRef<FieldName | null>(null);

  const { contextSafe } = useGSAP({ scope: card });

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".js-step",
        { x: 40 * direction.current, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity" },
      );
    },
    { scope: card, dependencies: [step], revertOnUpdate: false },
  );

  const shake = contextSafe(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(".js-step", { x: 0 }, { keyframes: { x: [-10, 10, -7, 7, -3, 0] }, duration: 0.45, ease: "none" });
  });

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const field = pendingFocus.current;
    pendingFocus.current = null;
    if (field) focusTarget(field)?.focus();
    else if (status.kind !== "success") stepHeading.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (status.kind !== "success") return;
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    const timer = setTimeout(() => window.location.assign(THANK_YOU_URL), 2600);
    return () => clearTimeout(timer);
  }, [status.kind]);

  function recheck(field: FieldName, next: FormValues, show: boolean) {
    const message = validateStep(stepOf(field), next)[field];
    setErrors((prev) => {
      if (!show && !prev[field]) return prev;
      const copy = { ...prev };
      if (message) copy[field] = message;
      else delete copy[field];
      return copy;
    });
  }

  function set<K extends FieldName>(field: K, value: FormValues[K]) {
    const next = { ...values, [field]: value };
    const cleared = { ...errors };
    for (const f of ["phone", "phoneCountry", "industryOther", "budget"] as const) {
      if (!isVisible(f, next)) delete cleared[f];
    }
    setValues(next);
    setErrors(cleared);
    recheck(field, next, false);
    if (status.kind === "notice") setStatus({ kind: "idle" });
  }

  const blur = (field: FieldName) => () => recheck(field, values, true);

  const groupBlur = (field: FieldName) => (e: FocusEvent<HTMLFieldSetElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) recheck(field, values, true);
  };

  const text = (field: TextFieldName) => ({
    id: field,
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (e: { target: { value: string } }) => set(field, e.target.value),
    onBlur: blur(field),
  });

  const stepProps: StepProps = { values, errors, text, set, blur, groupBlur };
  const CurrentStep = STEP_COMPONENTS[step];

  function next() {
    const stepErrors = validateStep(step, values);
    const first = firstError(step, stepErrors);
    if (first) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      shake();
      focusTarget(first)?.focus();
      return false;
    }
    direction.current = 1;
    setStep((s) => s + 1);
    return true;
  }

  function back() {
    direction.current = -1;
    setStatus({ kind: "idle" });
    setStep((s) => s - 1);
  }

  async function submit() {
    if (sending.current) return;
    const stepErrors = validateStep(2, values);
    if (firstError(2, stepErrors)) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      shake();
      focusTarget(firstError(2, stepErrors)!)?.focus();
      return;
    }

    sending.current = true;
    setStatus({ kind: "sending" });
    idempotencyKey.current ||= crypto.randomUUID();

    try {
      const res = await fetch(`${basePath()}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current },
        body: JSON.stringify({ ...toInput(values), [HONEYPOT]: honeypot.current?.value ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; fields?: Errors };

      if (res.ok) {
        setStatus({ kind: "success" });
        return;
      }
      if (res.status === 422 || res.status === 409) {
        const fields = data.fields ?? {};
        const first = (Object.keys(fields) as FieldName[]).sort((a, b) => stepOf(a) - stepOf(b))[0];
        setErrors((prev) => ({ ...prev, ...fields }));
        setStatus({ kind: "notice", message: data.message ?? "Some fields need fixing." });
        if (first) {
          const target = stepOf(first);
          if (target === step) {
            shake();
            focusTarget(first)?.focus();
          } else {
            pendingFocus.current = first;
            direction.current = -1;
            setStep(target);
          }
        }
        return;
      }
      if (res.status === 429) {
        setStatus({ kind: "notice", message: data.message ?? "Too many tries. Please wait a few minutes." });
        return;
      }
      setStatus({ kind: "failed" });
    } catch {
      setStatus({ kind: "failed" });
    } finally {
      sending.current = false;
    }
  }

  if (status.kind === "success") {
    return (
      <div ref={card} className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-[var(--shadow-card)] md:p-10" role="status">
        <SuccessCheck />
        <h2 className="font-display text-h3 font-bold">You&apos;re booked, {values.firstName}!</h2>
        <p className="max-w-sm text-body text-muted">
          We&apos;ll email <b className="text-ink">{values.email}</b> to confirm your demo on{" "}
          <b className="text-ink">{formatDate(values.demoDate)}</b>.
        </p>
        <a href={THANK_YOU_URL} className="text-small font-semibold text-primary underline-offset-4 hover:underline">
          Continue
        </a>
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;
  const busy = status.kind === "sending";

  return (
    <div ref={card} className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
      <Progress step={step} />

      <form
        noValidate
        aria-labelledby="step-title"
        onSubmit={(e) => {
          e.preventDefault();
          if (isLast) void submit();
          else next();
        }}
      >
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={HONEYPOT}>Company URL</label>
          <input ref={honeypot} id={HONEYPOT} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="js-step flex flex-col gap-5">
          <h2 id="step-title" ref={stepHeading} tabIndex={-1} className="font-display text-h4 font-bold outline-none">
            {STEPS[step].title}
          </h2>

          <CurrentStep {...stepProps} />
        </div>

        {status.kind === "notice" && (
          <p role="alert" className="mt-6 flex items-start gap-2 rounded-lg bg-error-soft px-4 py-3 text-small text-error">
            <Icon name="alert" size={16} className="mt-[3px]" />
            <span>{status.message}</span>
          </p>
        )}

        {status.kind === "failed" && (
          <div role="alert" className="mt-6 flex flex-col gap-3 rounded-lg border border-error/30 bg-error-soft px-4 py-3 sm:flex-row sm:items-center">
            <Icon name="wifi-off" size={20} className="shrink-0 text-error" />
            <p className="flex-1 text-small text-ink">
              <b>We couldn&apos;t send your request.</b> Check your connection. Your answers are still here.
            </p>
            <Button type="button" variant="secondary" onClick={() => void submit()} disabled={busy} className="!px-4 !py-2">
              <Icon name="refresh" size={16} /> Retry
            </Button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={back} disabled={busy}>
              <Icon name="arrow-left" size={18} /> Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" loading={busy}>
            {isLast ? (busy ? "Booking…" : "Book my demo") : "Next"}
            {!isLast && <Icon name="arrow-right" size={18} />}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <p className="text-eyebrow font-semibold tracking-[0.08em] text-muted uppercase" aria-live="polite">
        Step {step + 1} of {STEPS.length}
      </p>
      <ol className="mt-3 grid grid-cols-3 gap-2" aria-hidden="true">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-2">
            <span className={`h-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
            <span className={`hidden text-small sm:block ${i === step ? "font-semibold text-ink" : "text-muted"}`}>{s.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}
