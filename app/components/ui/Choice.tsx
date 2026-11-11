import type { ComponentProps } from "react";
import { Icon } from "./Icon";

type ChoiceProps = Omit<ComponentProps<"input">, "type"> & {
  type: "radio" | "checkbox";
  look?: "card" | "plain";
  label: string;
};

export function Choice({ type, look = "card", label, className = "", ...input }: ChoiceProps) {
  const card =
    "rounded-lg border border-border bg-white py-3 pl-3.5 pr-4 " +
    "has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:shadow-[inset_0_0_0_0.5px_var(--color-primary)] " +
    "has-[:focus-visible]:shadow-[var(--shadow-focus)] hover:border-primary/60";
  return (
    <label className={`group relative inline-flex cursor-pointer items-center gap-2.5 text-body text-ink ${look === "card" ? card : ""} ${className}`}>
      <input type={type} {...input} className="peer absolute inset-0 m-0 cursor-pointer opacity-0" />
      {type === "radio" ? (
        <span
          aria-hidden="true"
          className="size-5 shrink-0 rounded-full border-[1.5px] border-[#c3c7d3] bg-white transition-[border-width,border-color] peer-checked:border-[6px] peer-checked:border-primary"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-[#c3c7d3] bg-white text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white"
        >
          <Icon name="check" size={14} />
        </span>
      )}
      <span>{label}</span>
    </label>
  );
}

export function ChoiceGroup({
  legend,
  error,
  errorId,
  children,
}: {
  legend: string;
  error?: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2.5" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2.5 text-label font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">{children}</div>
      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-small text-error">
          <Icon name="alert" size={16} className="mt-[3px]" />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}
