import { cn } from "@/lib/utils";

type StatusTone = "calm" | "watch" | "alert" | "critical";

type StatusChipProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  calm: "text-[#0d6178] bg-[#0088ab1a] border-[#0088ab55]",
  watch: "text-[#7b4d2e] bg-[#d4956a2b] border-[#d4956a66]",
  alert: "text-[#8a3f16] bg-[#c4612a24] border-[#c4612a66]",
  critical: "text-[#8f1f1f] bg-[#c728281c] border-[#c7282860]",
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
        "[font-family:var(--font-label)] uppercase tracking-[0.08em]",
        toneClasses[tone],
        className
      )}
    >
      {label}
    </span>
  );
}