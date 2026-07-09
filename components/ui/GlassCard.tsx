"use client";

import { ReactNode } from "react";

export type GlassCardVariant = "default" | "hero" | "neutral" | "dark";

interface GlassCardProps {
  className?: string;
  children: ReactNode;
  variant?: GlassCardVariant;
  padding?: "sm" | "md" | "lg";
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: "default" | "hero" | "dark";
}

// GlassCard principal con nuevas variantes
export default function GlassCard({
  className = "",
  children,
  variant = "default",
  padding = "lg",
}: GlassCardProps) {
  const paddingClasses = {
    sm: "p-5",
    md: "p-6",
    lg: "p-8",
  };

  const variantClasses = {
    default: "glass-card-default",
    hero: "glass-card-hero",
    neutral: "glass-card-neutral",
    dark: "glass-card-dark",
  };

  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

// MetricCard rediseñado con tipografía mejorada
export function MetricCard({
  label,
  value,
  unit = "",
  variant = "default",
}: MetricCardProps) {
  const variantClasses = {
    default: "metric-card-default",
    hero: "metric-card-hero",
    dark: "metric-card-dark",
  };

  return (
    <div className={`${variantClasses[variant]} space-y-3 text-left`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--text-muted)]/75">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5 text-[var(--text)]">
        <span className="font-sans text-4xl font-bold leading-none tabular-nums tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]/70">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}