import { ReactNode } from "react";

interface AlertChipProps {
  variant: "stable" | "elevated" | "active" | "critical";
  children: ReactNode;
}

const variantStyles = {
  stable: {
    borderColor: "var(--md-sys-color-outline)",
    backgroundColor: "rgba(142, 144, 153, 0.12)",
    color: "var(--md-sys-color-on-surface-variant)",
  },
  elevated: {
    borderColor: "var(--md-sys-color-tertiary)",
    backgroundColor: "rgba(122, 168, 163, 0.12)",
    color: "var(--md-sys-color-tertiary)",
  },
  active: {
    borderColor: "var(--md-sys-color-secondary)",
    backgroundColor: "rgba(155, 184, 217, 0.16)",
    color: "var(--md-sys-color-secondary)",
  },
  critical: {
    borderColor: "var(--md-sys-color-error)",
    backgroundColor: "rgba(255, 180, 171, 0.16)",
    color: "var(--md-sys-color-error)",
  },
};

export default function AlertChip({
  variant,
  children,
}: AlertChipProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 whitespace-nowrap"
      style={{
        ...styles,
        fontFamily: "var(--font-mono-stat), sans-serif",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
      }}
    >
      {children}
    </span>
  );
}
