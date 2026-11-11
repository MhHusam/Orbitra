import type { ChangeEvent, FocusEvent } from "react";
import type { Errors, FieldName, FormValues } from "@/lib/demo-form";

export type TextFieldName = Exclude<FieldName, "interests" | "privacyConsent" | "marketingOptIn">;

export type StepProps = {
  values: FormValues;
  errors: Errors;
  text: (field: TextFieldName) => {
    id: string;
    name: string;
    value: string;
    error?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  };
  set: <K extends FieldName>(field: K, value: FormValues[K]) => void;
  blur: (field: FieldName) => () => void;
  groupBlur: (field: FieldName) => (e: FocusEvent<HTMLFieldSetElement>) => void;
};
