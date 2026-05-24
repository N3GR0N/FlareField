import { ReactNode } from "react";

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
    <div className="text-center space-y-2">
      <div className="text-label font-label text-xs uppercase topnav-text" style={{ opacity: 0.8 }}>
        {label}
      </div>
      <div className="flex items-baseline justify-center gap-1">
        <span className="font-mono text-3xl leading-none tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="font-label text-xs uppercase topnav-text" style={{ opacity: 0.7 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}