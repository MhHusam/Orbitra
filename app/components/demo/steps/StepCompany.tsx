import { isVisible } from "@/lib/demo-form";
import { COMPANY_SIZES, INDUSTRIES } from "@/lib/validation/options";
import { COUNTRIES } from "@/lib/countries";
import { TextField, SelectField } from "@/app/components/ui/Field";
import type { StepProps } from "./types";

export function StepCompany({ values, text }: StepProps) {
  return (
    <>
      <TextField {...text("companyName")} label="Company name" autoComplete="organization" required />
      <TextField {...text("website")} label="Company website" inputMode="url" autoComplete="url" placeholder="kitepay.com" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField {...text("companySize")} label="Company size" options={COMPANY_SIZES} required />
        <SelectField {...text("country")} label="Country" options={COUNTRIES} autoComplete="country" required />
      </div>
      <SelectField {...text("industry")} label="Industry" options={INDUSTRIES} required />
      {isVisible("industryOther", values) && <TextField {...text("industryOther")} label="Your industry" required />}
    </>
  );
}
