"use client";

import { KpData } from "@/types/solar";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import { useI18n } from "@/src/i18n/useI18n";

type KpIndexProps = {
  data: KpData;
};

function getTone(kpLevel: number): "calm" | "watch" | "alert" | "critical" {
  if (kpLevel <= 2) return "calm";
  if (kpLevel <= 4) return "watch";
  if (kpLevel <= 6) return "alert";
  return "critical";
}

export default function KpIndex({ data }: KpIndexProps) {
  const { t } = useI18n();
  const percentage = (data.current / 9) * 100;
  const timestamp = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(data.timestamp);

  return (
    <Card className="p-6 md:p-8 relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
              {t("kp.label")}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] opacity-70">
              {t("kp.current_activity")}
            </p>
          </div>
          <StatusChip label={`Kp ${data.current}`} tone={getTone(data.current)} />
        </div>

        {/* Barra visual 0-9 */}
        <div className="space-y-3">
          <div className="glass-soft h-4 w-full rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary-container)] transition-all duration-700 ease-out"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
            <span className="font-medium">0 (Quiet)</span>
            <span className="text-[var(--color-primary)] font-bold">{data.current}/9</span>
            <span className="font-medium">9 (Severe)</span>
          </div>
        </div>

        {/* Pronósticos en grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="glass-soft group rounded-lg p-4 border-l-4 border-l-[var(--primary-container)] transition-colors duration-300 hover:border-[var(--primary)]">
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.06em] font-medium [font-family:var(--font-label)]">
              {t("kp.next_3h")}
            </div>
            <div className="text-2xl font-light text-[var(--color-primary)] mt-2 [font-family:var(--font-display)]">
              Kp {data.forecast3h}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-2">
              {getTone(data.forecast3h) === "calm"
                ? t("status.calm")
                : getTone(data.forecast3h) === "watch"
                  ? t("status.watch")
                  : getTone(data.forecast3h) === "alert"
                    ? t("status.alert")
                    : t("status.critical")}
            </div>
          </div>

          <div className="glass-soft group rounded-lg p-4 border-l-4 border-l-[var(--tertiary)] transition-colors duration-300 hover:border-[var(--primary)]">
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.06em] font-medium [font-family:var(--font-label)]">
              {t("kp.next_12h")}
            </div>
            <div className="text-2xl font-light text-[var(--color-primary)] mt-2 [font-family:var(--font-display)]">
              Kp {data.forecast12h}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-2">
              {getTone(data.forecast12h) === "calm"
                ? t("status.calm")
                : getTone(data.forecast12h) === "watch"
                  ? t("status.watch")
                  : getTone(data.forecast12h) === "alert"
                    ? t("status.alert")
                    : t("status.critical")}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="pt-2 border-t border-[var(--color-border)]/30">
          <p className="text-xs text-[var(--color-text-muted)] opacity-60">
            {t("kp.updated")}: {timestamp} UTC
          </p>
        </div>
      </div>
    </Card>
  );
}