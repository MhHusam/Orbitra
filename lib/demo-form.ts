import type { z } from "zod";
import { step1Schema, step2Schema, step3Schema } from "@/lib/validation/lead-schema";
import { SIZES_NEEDING_BUDGET } from "@/lib/validation/options";

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  contactMethod: string;
  phoneCountry: string;
  phone: string;
  companyName: string;
  website: string;
  companySize: string;
  country: string;
  industry: string;
  industryOther: string;
  interests: string[];
  monthlyLeads: string;
  budget: string;
  demoDate: string;
  message: string;
  privacyConsent: boolean;
  marketingOptIn: boolean;
};

export type FieldName = keyof FormValues;
export type Errors = Partial<Record<FieldName, string>>;

export const EMPTY: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  contactMethod: "",
  phoneCountry: "AE",
  phone: "",
  companyName: "",
  website: "",
  companySize: "",
  country: "",
  industry: "",
  industryOther: "",
  interests: [],
  monthlyLeads: "",
  budget: "",
  demoDate: "",
  message: "",
  privacyConsent: false,
  marketingOptIn: false,
};

export const STEPS = [
  { title: "About you", fields: ["firstName", "lastName", "email", "jobTitle", "contactMethod", "phoneCountry", "phone"] },
  { title: "Your company", fields: ["companyName", "website", "companySize", "country", "industry", "industryOther"] },
  { title: "Your demo", fields: ["interests", "monthlyLeads", "budget", "demoDate", "message", "privacyConsent", "marketingOptIn"] },
] as const satisfies readonly { title: string; fields: readonly FieldName[] }[];

const SCHEMAS = [step1Schema, step2Schema, step3Schema] as const;

export function stepOf(field: string) {
  const index = STEPS.findIndex((s) => (s.fields as readonly string[]).includes(field));
  return index === -1 ? 0 : index;
}

export function isVisible(field: FieldName, v: FormValues) {
  if (field === "phone" || field === "phoneCountry") return v.contactMethod === "phone" || v.contactMethod === "whatsapp";
  if (field === "industryOther") return v.industry === "other";
  if (field === "budget") return (SIZES_NEEDING_BUDGET as readonly string[]).includes(v.companySize);
  return true;
}

export function toInput(v: FormValues) {
  const blank = (s: string) => (s.trim() === "" ? undefined : s);
  return {
    ...v,
    jobTitle: blank(v.jobTitle),
    phoneCountry: isVisible("phoneCountry", v) ? v.phoneCountry : undefined,
    phone: isVisible("phone", v) ? blank(v.phone) : undefined,
    industryOther: isVisible("industryOther", v) ? blank(v.industryOther) : undefined,
    budget: isVisible("budget", v) ? blank(v.budget) : undefined,
    message: blank(v.message),
  };
}

export function errorsFrom(error: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]) as FieldName;
    out[key] ??= issue.code === "invalid_type" ? "This field is required" : issue.message;
  }
  return out;
}

export function validateStep(step: number, v: FormValues): Errors {
  const result = SCHEMAS[step].safeParse(toInput(v));
  if (result.success) return {};
  const errors = errorsFrom(result.error);
  const own = STEPS[step].fields as readonly string[];
  return Object.fromEntries(Object.entries(errors).filter(([k]) => own.includes(k))) as Errors;
}

export function firstError(step: number, errors: Errors): FieldName | undefined {
  return STEPS[step].fields.find((f) => errors[f]);
}
