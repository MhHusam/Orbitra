import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { step1Schema, step2Schema, step3Schema, leadSchema } from "@/lib/validation/lead-schema";

beforeAll(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-10T08:00:00Z")); });
afterAll(() => vi.useRealTimers());

const step1 = {
  firstName: "Sara", lastName: "Khan", email: "Sara@Kitepay.com",
  contactMethod: "email", jobTitle: "Head of Sales",
};
const step2 = {
  companyName: "Kitepay", website: "kitepay.com", companySize: "11-50",
  country: "AE", industry: "saas",
};
const step3 = {
  interests: ["routing"], monthlyLeads: "100-500", demoDate: "2026-11-12",
  message: "", privacyConsent: true,
};
const issues = (r: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  r.success ? [] : r.error!.issues.map((i) => i.path.join("."));

describe("step 1", () => {
  it("passes a valid step", () => expect(step1Schema.safeParse(step1).success).toBe(true));
  it("blocks free email", () => expect(issues(step1Schema.safeParse({ ...step1, email: "sara@gmail.com" }))).toContain("email"));
  it("accepts names in any language", () => expect(step1Schema.safeParse({ ...step1, firstName: "حسام", lastName: "O'Neil-Smith" }).success).toBe(true));
  it("rejects digits in names", () => expect(issues(step1Schema.safeParse({ ...step1, firstName: "S4ra" }))).toContain("firstName"));
  it("needs a phone for WhatsApp", () => expect(issues(step1Schema.safeParse({ ...step1, contactMethod: "whatsapp", phoneCountry: "AE" }))).toContain("phone"));
  it("checks the phone against the country", () => expect(issues(step1Schema.safeParse({ ...step1, contactMethod: "phone", phoneCountry: "AE", phone: "+966501234567" }))).toContain("phone"));
  it("ignores phone for email contact", () => expect(step1Schema.safeParse({ ...step1, phone: "abc" }).success).toBe(true));
});

describe("step 2", () => {
  it("passes a valid step", () => expect(step2Schema.safeParse(step2).success).toBe(true));
  it("adds https:// to the website", () => expect(step2Schema.parse(step2).website).toBe("https://kitepay.com"));
  it("rejects a bad website", () => expect(issues(step2Schema.safeParse({ ...step2, website: "kitepay" }))).toContain("website"));
  it("needs the Other field when Other is picked", () => expect(issues(step2Schema.safeParse({ ...step2, industry: "other" }))).toContain("industryOther"));
});

describe("step 3", () => {
  const s3 = { ...step3, companySize: "11-50" };
  it("passes a valid step", () => expect(step3Schema.safeParse(s3).success).toBe(true));
  it("needs at least one interest", () => expect(issues(step3Schema.safeParse({ ...s3, interests: [] }))).toContain("interests"));
  it("needs a budget for 51+ people", () => expect(issues(step3Schema.safeParse({ ...s3, companySize: "51-200" }))).toContain("budget"));
  it("rejects a 10-character message", () => expect(issues(step3Schema.safeParse({ ...s3, message: "too short." }))).toContain("message"));
  it("needs privacy consent", () => expect(issues(step3Schema.safeParse({ ...s3, privacyConsent: false }))).toContain("privacyConsent"));
  it("rejects a weekend demo date", () => expect(issues(step3Schema.safeParse({ ...s3, demoDate: "2026-11-14" }))).toContain("demoDate"));
});

describe("full lead (server)", () => {
  it("cleans the output", () => {
    const lead = leadSchema.parse({
      ...step1, ...step2, ...step3,
      contactMethod: "whatsapp", phoneCountry: "ae", phone: "050 123 4567",
      companySize: "51-200", budget: "1k-5k",
    });
    expect(lead.email).toBe("sara@kitepay.com");
    expect(lead.phone).toBe("+971501234567");
    expect(lead.website).toBe("https://kitepay.com");
    expect(lead.message).toBeUndefined();
    expect(lead.marketingOptIn).toBe(false);
  });
  it("drops hidden fields", () => {
    const lead = leadSchema.parse({ ...step1, ...step2, ...step3, phone: "123", budget: "1k-5k", industryOther: "x" });
    expect(lead.phone).toBeUndefined();
    expect(lead.budget).toBeUndefined();
    expect(lead.industryOther).toBeUndefined();
  });
});
