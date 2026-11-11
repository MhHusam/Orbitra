import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";

const base =
  "w-full rounded-lg border bg-white px-3.5 py-3 text-body text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-surface";

const styles = {
  default:
    "border-border focus:border-primary focus:shadow-[inset_0_0_0_0.5px_var(--color-primary),var(--shadow-focus)]",
  error:
    "border-error shadow-[inset_0_0_0_0.5px_var(--color-error)] focus:shadow-[inset_0_0_0_0.5px_var(--color-error),0_0_0_4px_rgb(205_43_49/0.18)]",
};

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
};

function FieldWrapper({
  id,
  label,
  error,
  hint,
  className = "",
  children,
}: FieldProps & { children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-label font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-small text-error">
          <Icon name="alert" size={16} className="mt-[3px]" />
          <span>{error}</span>
        </p>
      ) : hint}
    </div>
  );
}

const ariaProps = (id: string, error?: string) => ({
  id,
  "aria-invalid": !!error,
  "aria-describedby": error ? `${id}-error` : undefined,
});

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & FieldProps;

export function TextField({
  id,
  label,
  error,
  hint,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <FieldWrapper {...{ id, label, error, hint, className }}>
      <input
        {...props}
        {...ariaProps(id, error)}
        className={`${base} ${error ? styles.error : styles.default}`}
      />
    </FieldWrapper>
  );
}

type Option = { value: string; label: string };

type SelectFieldProps = Omit<ComponentProps<"select">, "id"> &
  FieldProps & {
    options: readonly Option[];
    placeholder?: string;
  };

export function SelectField({
  id,
  label,
  error,
  className = "",
  options,
  placeholder = "Select…",
  ...props
}: SelectFieldProps) {
  return (
    <FieldWrapper {...{ id, label, error, className }}>
      <div className="relative">
        <select
          {...props}
          {...ariaProps(id, error)}
          className={`${base} ${error ? styles.error : styles.default} appearance-none pr-11`}
        >
          <option value="">{placeholder}</option>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink"
        />
      </div>
    </FieldWrapper>
  );
}