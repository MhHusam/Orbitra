import { isVisible } from "@/lib/demo-form";
import { CONTACT_METHODS } from "@/lib/validation/options";
import { PHONE_COUNTRIES } from "@/lib/countries";
import { TextField, SelectField } from "@/app/components/ui/Field";
import { Choice, ChoiceGroup } from "@/app/components/ui/Choice";
import type { StepProps } from "./types";

export function StepAboutYou({ values, errors, text, set, groupBlur }: StepProps) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField {...text("firstName")} label="First name" autoComplete="given-name" required />
        <TextField {...text("lastName")} label="Last name" autoComplete="family-name" required />
      </div>
      <TextField {...text("email")} label="Work email" type="email" inputMode="email" autoComplete="email" placeholder="name@company.com" required />
      <TextField {...text("jobTitle")} label="Job title (optional)" autoComplete="organization-title" />
      <ChoiceGroup legend="How should we contact you?" error={errors.contactMethod} errorId="contactMethod-error" onBlur={groupBlur("contactMethod")}>
        {CONTACT_METHODS.map((m, i) => (
          <Choice
            key={m.value}
            id={`contactMethod-${i}`}
            type="radio"
            name="contactMethod"
            value={m.value}
            label={m.label}
            checked={values.contactMethod === m.value}
            onChange={() => set("contactMethod", m.value)}
          />
        ))}
      </ChoiceGroup>
      {isVisible("phone", values) && (
        <div className="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <SelectField {...text("phoneCountry")} label="Country code" options={PHONE_COUNTRIES} placeholder="Choose…" autoComplete="tel-country-code" />
          <TextField {...text("phone")} label="Phone number" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="50 123 4567" required />
        </div>
      )}
    </>
  );
}
