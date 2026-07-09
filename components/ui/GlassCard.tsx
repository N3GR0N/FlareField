"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  className?: string;
  children: ReactNode;
  dark?: boolean;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

// 1. Exportación por defecto principal
export default function GlassCard({
  className = "",
  children,
  dark = false,
}: GlassCardProps) {
  return (
    <div
      className={`glass-morphism ${dark ? "glass-morphism-dark" : ""} rounded-[24px] border border-white/10 bg-[rgba(11,13,15,0.68)] backdrop-blur-[24px] backdrop-saturate-[150%] shadow-[0_24px_60px_rgba(0,0,0,0.34)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.008] ${className}`}
    >
      {children}
    </div>
  );
}

// 2. Exportación nombrada corregida (sin el default)
export function MetricCard({
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