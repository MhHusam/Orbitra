import { isVisible } from "@/lib/demo-form";
import { BUDGETS, INTERESTS, MONTHLY_LEADS } from "@/lib/validation/options";
import { firstDemoDate, lastDemoDate } from "@/lib/validation/dates";
import { TextField, SelectField, TextAreaField } from "@/app/components/ui/Field";
import { Choice, ChoiceGroup } from "@/app/components/ui/Choice";
import { Icon } from "@/app/components/ui/Icon";
import type { StepProps } from "./types";

export function StepDemo({ values, errors, text, set, blur, groupBlur }: StepProps) {
  return (
    <>
      <ChoiceGroup legend="What are you interested in?" error={errors.interests} errorId="interests-error" onBlur={groupBlur("interests")}>
        {INTERESTS.map((item, i) => (
          <Choice
            key={item.value}
            id={`interests-${i}`}
            type="checkbox"
            name="interests"
            value={item.value}
            label={item.label}
            checked={values.interests.includes(item.value)}
            onChange={(e) =>
              set(
                "interests",
                e.target.checked ? [...values.interests, item.value] : values.interests.filter((v) => v !== item.value),
              )
            }
          />
        ))}
      </ChoiceGroup>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField {...text("monthlyLeads")} label="Leads per month" options={MONTHLY_LEADS} required />
        {isVisible("budget", values) && <SelectField {...text("budget")} label="Monthly budget" options={BUDGETS} required />}
      </div>
      <TextField
        {...text("demoDate")}
        label="Demo date"
        type="date"
        min={firstDemoDate()}
        max={lastDemoDate()}
        hint={<p className="text-small text-muted">Weekdays only, up to 30 days ahead.</p>}
        required
      />
      <TextAreaField {...text("message")} label="Anything we should know? (optional)" maxLength={500} rows={4} />
      <div className="flex flex-col gap-3">
        <Choice
          id="privacyConsent"
          type="checkbox"
          look="plain"
          name="privacyConsent"
          label="I agree to the privacy policy"
          checked={values.privacyConsent}
          aria-invalid={errors.privacyConsent ? true : undefined}
          aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined}
          onChange={(e) => set("privacyConsent", e.target.checked)}
          onBlur={blur("privacyConsent")}
        />
        {errors.privacyConsent && (
          <p id="privacyConsent-error" role="alert" className="-mt-1 flex items-start gap-1.5 text-small text-error">
            <Icon name="alert" size={16} className="mt-[3px]" />
            <span>{errors.privacyConsent}</span>
          </p>
        )}
        <Choice
          id="marketingOptIn"
          type="checkbox"
          look="plain"
          name="marketingOptIn"
          label="Send me product news (optional)"
          checked={values.marketingOptIn}
          onChange={(e) => set("marketingOptIn", e.target.checked)}
        />
      </div>
    </>
  );
}
