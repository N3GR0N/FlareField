import { ReactNode } from "react";

interface AlertChipProps {
  variant: "stable" | "elevated" | "active" | "critical";
  children: ReactNode;
}

const colorMap = {
  stable: { color: "rgba(83, 112, 109, 0.5)", bg: "rgba(83, 112, 109, 0.08)" },
  elevated: { color: "rgba(83, 112, 109, 0.75)", bg: "rgba(83, 112, 109, 0.1)" },
  active: { color: "#214c4e", bg: "rgba(33, 76, 78, 0.12)" },
  critical: { color: "#214c4e", bg: "rgba(33, 76, 78, 0.2)" },
};

export default function AlertChip({
  variant,
  children,
}: AlertChipProps) {
  const colors = colorMap[variant];

  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-chip)] border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] whitespace-nowrap"
      style={{
        borderColor: colors.color,
        backgroundColor: colors.bg,
        color: colors.color,
      }}
    >
      {children}
    </span>
  );
}
