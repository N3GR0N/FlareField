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
    "bg-[var(--color-primary)] text-[#fff6f1] border border-[var(--color-primary)] hover:brightness-95",
  secondary:
    "bg-[var(--color-secondary)] text-[#2b211d] border border-[var(--color-secondary)] hover:brightness-98",
  inverted:
    "bg-[var(--color-text)] text-[var(--color-surface-low)] border border-[var(--color-text)] hover:opacity-95",
  outlined:
    "bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-low)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] border border-transparent hover:bg-[var(--color-surface-low)]",
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
        "inline-flex items-center justify-center rounded-[var(--radius-btn)] transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[font-family:var(--font-label)] tracking-[0.01em]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}