import { z } from "zod";
import { isSupportedCountry, type CountryCode } from "libphonenumber-js/max";
import { isWorkEmail } from "./blocked-domains";
import { toE164 } from "./phone";
import { isAllowedDemoDate } from "./dates";
import {
  BUDGETS, COMPANY_SIZES, CONTACT_METHODS, INDUSTRIES, INTERESTS, MONTHLY_LEADS,
  SIZES_NEEDING_BUDGET, valuesOf,
} from "./options";

const NAME = /^[\p{L}\p{M}](?:[\p{L}\p{M}' ’-]*[\p{L}\p{M}])?$/u;
const name = (field: string) =>
  z.string().trim()
    .min(1, `Enter your ${field.toLowerCase()}`)
    .min(2, `${field} needs at least 2 letters`)
    .max(40, `${field} can be up to 40 letters`)
    .regex(NAME, `${field} can only use letters, spaces, hyphens and apostrophes`);

const countryCode = z.string().trim().toUpperCase()
  .refine((code) => isSupportedCountry(code), "Choose a country");

const website = z.string().trim().min(1, "Enter your company website")
  .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
  .refine((value) => {
    try {
      const { hostname } = new URL(value);
      return /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(hostname);
    } catch {
      return false;
    }
  }, "Enter a valid website, like kitepay.com");

export const step1Base = z.object({
  firstName: name("First name"),
  lastName: name("Last name"),
  email: z.email("Enter a valid email, like name@company.com")
    .trim().toLowerCase()
    .refine(isWorkEmail, "Use your work email, like name@company.com"),
  contactMethod: z.enum(valuesOf(CONTACT_METHODS), "Choose how we should contact you"),
  phoneCountry: z.string().trim().toUpperCase().optional(),
  phone: z.string().trim().optional(),
  jobTitle: z.string().trim().max(60, "Job title can be up to 60 characters").optional(),
});

export const step2Base = z.object({
  companyName: z.string().trim()
    .min(2, "Company name needs at least 2 characters")
    .max(80, "Company name can be up to 80 characters"),
  website,
  companySize: z.enum(valuesOf(COMPANY_SIZES), "Choose your company size"),
  country: countryCode,
  industry: z.enum(valuesOf(INDUSTRIES), "Choose your industry"),
  industryOther: z.string().trim().optional(),
});

export const step3Base = z.object({
  interests: z.array(z.enum(valuesOf(INTERESTS))).min(1, "Pick at least one"),
  monthlyLeads: z.enum(valuesOf(MONTHLY_LEADS), "Choose your monthly leads"),
  budget: z.enum(valuesOf(BUDGETS)).optional(),
  demoDate: z.string().refine(
    (date) => isAllowedDemoDate(date),
    "Pick a weekday from the next working day to 30 days ahead",
  ),
  message: z.string().trim()
    .refine((m) => m === "" || (m.length >= 20 && m.length <= 500), "Write 20–500 characters, or leave it empty")
    .optional(),
  privacyConsent: z.literal(true, "Please accept the privacy policy"),
  marketingOptIn: z.boolean().default(false),
});

type Ctx = z.RefinementCtx;

function phoneRule(data: z.infer<typeof step1Base>, ctx: Ctx) {
  if (data.contactMethod === "email") return;
  const country = data.phoneCountry ?? "";
  if (!isSupportedCountry(country)) {
    ctx.addIssue({ code: "custom", path: ["phoneCountry"], message: "Choose a country code" });
    return;
  }
  if (!data.phone) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter a phone number for calls or WhatsApp" });
  } else if (!toE164(data.phone, country as CountryCode)) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter a valid number for the selected country" });
  }
}

function industryRule(data: z.infer<typeof step2Base>, ctx: Ctx) {
  if (data.industry !== "other") return;
  const value = data.industryOther ?? "";
  if (value.length < 2 || value.length > 60) {
    ctx.addIssue({ code: "custom", path: ["industryOther"], message: "Tell us your industry (2–60 characters)" });
  }
}

function budgetRule(data: { companySize: string; budget?: string }, ctx: Ctx) {
  const needsBudget = (SIZES_NEEDING_BUDGET as readonly string[]).includes(data.companySize);
  if (needsBudget && !data.budget) {
    ctx.addIssue({ code: "custom", path: ["budget"], message: "Choose a budget range" });
  }
}

export const step1Schema = step1Base.superRefine(phoneRule);
export const step2Schema = step2Base.superRefine(industryRule);
export const step3Schema = step3Base
  .extend({ companySize: step2Base.shape.companySize })
  .superRefine(budgetRule);

export const leadSchema = step1Base
  .extend(step2Base.shape)
  .extend(step3Base.shape)
  .superRefine((data, ctx) => {
    phoneRule(data, ctx);
    industryRule(data, ctx);
    budgetRule(data, ctx);
  })
  .transform((data) => ({
    ...data,
    phone: data.contactMethod === "email"
      ? undefined
      : toE164(data.phone!, data.phoneCountry as CountryCode)!,
    phoneCountry: data.contactMethod === "email" ? undefined : data.phoneCountry,
    industryOther: data.industry === "other" ? data.industryOther : undefined,
    budget: (SIZES_NEEDING_BUDGET as readonly string[]).includes(data.companySize) ? data.budget : undefined,
    message: data.message || undefined,
  }));

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
