interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export default function MetricCard({
  label,
  value,
  unit = "",
}: MetricCardProps) {
  return (
    <div className="space-y-2 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]/88">
        {label}
      </div>
      <div className="flex items-baseline justify-center gap-1 text-[var(--text)]">
        <span className="font-mono text-3xl font-bold leading-none tabular-nums tracking-[-0.04em]">
          {value}
        </span>
        {unit && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]/80">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
