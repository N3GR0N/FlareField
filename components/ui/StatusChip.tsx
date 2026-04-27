import { cn } from "@/lib/utils";

type StatusTone = "calm" | "watch" | "alert" | "critical";

type StatusChipProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  calm: "text-[var(--tertiary)] bg-[color-mix(in_srgb,var(--tertiary)_10%,white)] border border-[color-mix(in_srgb,var(--tertiary)_35%,white)]",
  watch: "text-[var(--secondary)] bg-[color-mix(in_srgb,var(--secondary)_10%,white)] border border-[color-mix(in_srgb,var(--secondary)_35%,white)]",
  alert: "text-[var(--primary-container)] bg-[color-mix(in_srgb,var(--primary-container)_10%,white)] border border-[color-mix(in_srgb,var(--primary-container)_35%,white)]",
  critical: "text-[var(--error)] bg-[color-mix(in_srgb,var(--error)_10%,white)] border border-[color-mix(in_srgb,var(--error)_35%,white)]",
};

export default function StatusChip({
  label,
  tone = "watch",
  className,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-chip)] border px-2.5 py-1 text-xs",
        "[font-family:var(--font-label)] uppercase tracking-[0.08em] font-medium",
        "transition-colors duration-200",
        toneClasses[tone],
        className
      )}
    >
      {label}
    </span>
  );
}