import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "inverted" | "outlined" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary-container)] text-[var(--on-primary)] border border-[var(--primary-container)] hover:bg-[var(--primary)]",
  secondary:
    "bg-[var(--surface-container-low)] text-[var(--color-text)] border border-[var(--border-card)] hover:border-[var(--primary)]",
  inverted:
    "bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] border border-[var(--inverse-surface)] hover:opacity-90",
  outlined:
    "bg-transparent text-[var(--color-text)] border border-[var(--outline)] hover:text-[var(--primary)] hover:border-[var(--primary)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] border border-[var(--outline-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] transition-colors duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[font-family:var(--font-label)] tracking-[0.03em] uppercase",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}