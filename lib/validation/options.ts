export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export const COMPANY_SIZES = [
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "201-1000", label: "201–1,000" },
  { value: "1000+", label: "1,000+" },
] as const;

export const SIZES_NEEDING_BUDGET = ["51-200", "201-1000", "1000+"] as const;

export const INDUSTRIES = [
  { value: "saas", label: "Software / SaaS" },
  { value: "fintech", label: "Financial services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "ecommerce", label: "E-commerce / Retail" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
] as const;

export const INTERESTS = [
  { value: "routing", label: "Instant routing" },
  { value: "scoring", label: "Lead scoring" },
  { value: "enrichment", label: "Data enrichment" },
  { value: "round-robin", label: "Round-robin and territories" },
  { value: "crm-sync", label: "CRM sync" },
  { value: "sla-alerts", label: "SLA alerts" },
] as const;

export const MONTHLY_LEADS = [
  { value: "under-100", label: "Under 100" },
  { value: "100-500", label: "100–500" },
  { value: "500-2000", label: "500–2,000" },
  { value: "2000+", label: "2,000+" },
] as const;

export const BUDGETS = [
  { value: "under-1k", label: "Under $1,000 / month" },
  { value: "1k-5k", label: "$1,000–5,000 / month" },
  { value: "5k-20k", label: "$5,000–20,000 / month" },
  { value: "20k+", label: "$20,000+ / month" },
] as const;

export function valuesOf<T extends readonly { value: string }[]>(list: T) {
  return list.map((item) => item.value) as unknown as [T[number]["value"], ...T[number]["value"][]];
}

export const HONEYPOT = "companyUrl";
