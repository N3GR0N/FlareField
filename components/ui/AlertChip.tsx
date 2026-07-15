import { ReactNode } from "react";

interface AlertChipProps {
  variant: "stable" | "elevated" | "active" | "critical";
  children: ReactNode;
}

const variantStyles = {
  stable: {
    borderColor: "var(--chip-stable-border)",
    backgroundColor: "var(--chip-stable-bg)",
    color: "var(--chip-stable-text)",
  },
  elevated: {
    borderColor: "var(--chip-warning-border)",
    backgroundColor: "var(--chip-warning-bg)",
    color: "var(--chip-warning-text)",
  },
  active: {
    borderColor: "var(--chip-warning-border)",
    backgroundColor: "var(--chip-warning-bg)",
    color: "var(--chip-warning-text)",
  },
  critical: {
    borderColor: "var(--chip-critical-border)",
    backgroundColor: "var(--chip-critical-bg)",
    color: "var(--chip-critical-text)",
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
