"use client";

import { SolarReport } from "@/types/solar";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import { useI18n } from "@/src/i18n/useI18n";

type ReportCardProps = {
  report: SolarReport;
};

function getTone(kpLevel: number): "calm" | "watch" | "alert" | "critical" {
  if (kpLevel <= 2) return "calm";
  if (kpLevel <= 4) return "watch";
  if (kpLevel <= 6) return "alert";
  return "critical";
}

export default function ReportCard({ report }: ReportCardProps) {
  const { t } = useI18n();
  const maxKp = Math.max(...report.forecast.map((f) => f.kpMax));

  return (
    <Card
      className="p-6 md:p-8 cursor-pointer group relative overflow-hidden transition-all duration-300"
    >
      <div className="space-y-5 relative z-10">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[var(--primary)] rounded-full" />
              <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
                {report.period === "daily" ? t("report.daily") : t("report.weekly")}
              </span>
            </div>
            <div className="text-sm md:text-base text-[var(--color-text)] font-light [font-family:var(--font-display)]">
              {report.date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="flex-shrink-0">
            <StatusChip
              label={`Kp ${report.kpIndex.current}`}
              tone={getTone(report.kpIndex.current)}
            />
          </div>
        </div>

        {/* Resumen con tipografía mejorada */}
        <p className="text-sm text-[var(--color-text)] leading-relaxed line-clamp-3">
          {report.summary}
        </p>

        {/* Stats en grid mejorado */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Flares */}
          <div className="glass-soft rounded-lg p-3 border-l-4 border-l-[var(--primary)] transition-colors duration-300">
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.06em] font-medium [font-family:var(--font-label)]">
              {t("report.flares")}
            </div>
            <div className="text-2xl md:text-3xl font-light text-[var(--color-primary)] mt-2 [font-family:var(--font-display)]">
              {report.flares.length}
            </div>
            {report.flares.length > 0 && (
              <div className="text-xs text-[var(--color-text-muted)] mt-1">
                Max: {report.flares.reduce((max, f) => {
                  const classes = { A: 1, B: 2, C: 3, M: 4, X: 5 };
                  return Math.max(max, classes[f.class]);
                }, 0) === 5 ? "X" : report.flares.reduce((max, f) => {
                  const classes = { A: 1, B: 2, C: 3, M: 4, X: 5 };
                  return Math.max(max, classes[f.class]);
                }, 0) === 4 ? "M" : report.flares.reduce((max, f) => {
                  const classes = { A: 1, B: 2, C: 3, M: 4, X: 5 };
                  return Math.max(max, classes[f.class]);
                }, 0) === 3 ? "C" : report.flares.reduce((max, f) => {
                  const classes = { A: 1, B: 2, C: 3, M: 4, X: 5 };
                  return Math.max(max, classes[f.class]);
                }, 0) === 2 ? "B" : "A"}
              </div>
            )}
          </div>

          {/* Peak Kp */}
          <div className="glass-soft rounded-lg p-3 border-l-4 border-l-[var(--secondary)] transition-colors duration-300">
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.06em] font-medium [font-family:var(--font-label)]">
              {t("report.peak_kp")}
            </div>
            <div className="text-2xl md:text-3xl font-light text-[var(--color-primary)] mt-2 [font-family:var(--font-display)]">
              {maxKp}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1 opacity-70">
              {t("report.expected")}
            </div>
          </div>

          {/* Días de pronóstico */}
          <div className="glass-soft rounded-lg p-3 border-l-4 border-l-[var(--tertiary)] transition-colors duration-300">
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.06em] font-medium [font-family:var(--font-label)]">
              {t("report.forecast")}
            </div>
            <div className="text-2xl md:text-3xl font-light text-[var(--color-primary)] mt-2 [font-family:var(--font-display)]">
              {report.forecast.length}d
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1 opacity-70">
              {t("report.ahead")}
            </div>
          </div>
        </div>

        {/* Footer con indicador de interactividad */}
        <div className="pt-3 border-t border-[var(--color-border)]/30 flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-muted)] opacity-60">
            {report.date.toLocaleDateString("es-ES")}
          </p>
          <div className="w-5 h-5 rounded-full bg-[var(--surface-container)] flex items-center justify-center border border-[var(--color-border)]">
            <svg
              className="w-3 h-3 text-[var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
}