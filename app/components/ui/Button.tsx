import type { ComponentProps } from "react";


type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  loading?: boolean;
};

const styles = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "border border-border bg-white text-ink hover:bg-surface",
} as const;

export function Button({ variant = "primary", loading = false, disabled, children, className = "", ...button }: ButtonProps) {
  return (
    <button
      {...button}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={
        `inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-[16px] font-semibold leading-6 ` +
        `transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ` +
        `disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`
      }
    >
      {loading && (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  );
}
