"use client";

import { ForecastDay } from "@/types/solar";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import { useI18n } from "@/src/i18n/useI18n";

type ForecastStripProps = {
  days: ForecastDay[];
};

export default function ForecastStrip({ days }: ForecastStripProps) {
  const { t } = useI18n();

  return (
    <Card className="p-6 md:p-8 relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
            {t("forecast.title")}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] opacity-70">
            {t("forecast.subtitle")}
          </p>
        </div>

        {/* Cards con scroll */}
        <div className="overflow-x-auto -mx-6 md:-mx-8">
          <div className="flex gap-4 px-6 md:px-8 min-w-min pb-2">
            {days.map((day) => (
              <div
                key={day.date.toISOString()}
                className="flex-shrink-0 w-32 md:w-40 group/card"
              >
                <div className="glass-soft flex flex-col h-full p-4 rounded-lg border-l-4 border-l-[var(--outline)] transition-colors duration-300 hover:border-[var(--primary)]">
                  {/* Fecha */}
                  <div className="space-y-1 mb-4">
                    <div className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--color-primary)] [font-family:var(--font-label)]">
                      {day.date.toLocaleDateString("es-ES", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {day.date.toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Rango Kp */}
                  <div className="mb-4 pb-4 border-b border-[var(--color-border)]/20">
                    <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.05em] mb-2 [font-family:var(--font-label)]">
                      {t("forecast.kp_range")}
                    </div>
                    <div className="text-xl md:text-2xl font-light text-[var(--color-primary)] [font-family:var(--font-display)]">
                      {day.kpMin}–{day.kpMax}
                    </div>
                  </div>

                  {/* Probabilidad con barra visual */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.05em] [font-family:var(--font-label)]">
                        {t("forecast.probability")}
                      </div>
                      <div className="text-xs font-medium text-[var(--color-primary)]">
                        {day.probability}%
                      </div>
                    </div>
                    <div className="glass-soft h-1.5 w-full rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary-container)] transition-all duration-500"
                        style={{ width: `${day.probability}%` }}
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  {day.warning && (
                    <div className="mt-auto pt-4 border-t border-[var(--color-border)]/20">
                      <StatusChip
                        label={day.warning}
                        tone={day.warning}
                        className="text-xs w-full justify-center"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="text-xs text-[var(--color-text-muted)] opacity-60 text-center">
          {t("forecast.scroll")} →
        </div>
      </div>
    </Card>
  );
}