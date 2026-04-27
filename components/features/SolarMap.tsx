"use client";

import { SolarFlare, FlareClass } from "@/types/solar";
import Card from "@/components/ui/Card";
import { useI18n } from "@/src/i18n/useI18n";

type SolarMapProps = {
  flares: SolarFlare[];
};

function getFlareColor(flareClass: FlareClass): string {
  const colors: Record<FlareClass, string> = {
    A: "var(--tertiary)",
    B: "var(--secondary)",
    C: "var(--primary-container)",
    M: "var(--primary)",
    X: "var(--error)",
  };
  return colors[flareClass];
}

function getFlareSize(flareClass: FlareClass): number {
  const sizes: Record<FlareClass, number> = {
    A: 4,
    B: 6,
    C: 8,
    M: 12,
    X: 16,
  };
  return sizes[flareClass];
}

export default function SolarMap({ flares }: SolarMapProps) {
  const { t } = useI18n();

  return (
    <Card className="p-6 md:p-8 relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
            {t("solar_disk.title")}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] opacity-70">
            {t("solar_disk.subtitle")} • {flares.length} {t("solar_disk.detected")}
          </p>
        </div>

        {/* SVG disco solar */}
        <div className="flex justify-center py-6">
          <div className="relative w-full max-w-xs aspect-square">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
            >
              {/* Solar disk */}
              <defs>
                <radialGradient id="solarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--secondary-container)" />
                  <stop offset="70%" stopColor="var(--primary-container)" />
                  <stop offset="100%" stopColor="var(--primary)" />
                </radialGradient>
              </defs>

              {/* Disco solar */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="url(#solarGradient)"
                stroke="var(--primary)"
                strokeWidth="2"
              />

              {/* Rejilla de referencia (sutil) */}
              <line
                x1="100"
                y1="10"
                x2="100"
                y2="190"
                stroke="var(--primary)"
                strokeWidth="0.5"
                opacity="0.15"
              />
              <line
                x1="10"
                y1="100"
                x2="190"
                y2="100"
                stroke="var(--primary)"
                strokeWidth="0.5"
                opacity="0.15"
              />

              {/* Flares con glow */}
              <defs>
                {flares.map((flare) => (
                  <filter key={`glow-${flare.id}`} id={`glow-${flare.id}`}>
                    <feGaussianBlur
                      stdDeviation={getFlareSize(flare.class) / 1.5}
                      result="coloredBlur"
                    />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>

              {flares.map((flare) => (
                <g key={flare.id}>
                  {/* Aura del flare */}
                  <circle
                    cx={100 + (flare.location.x * 90) / 90}
                    cy={100 + (flare.location.y * 90) / 90}
                    r={getFlareSize(flare.class) + 2}
                    fill={getFlareColor(flare.class)}
                    opacity="0.2"
                  />
                  {/* Punto principal */}
                  <circle
                    cx={100 + (flare.location.x * 90) / 90}
                    cy={100 + (flare.location.y * 90) / 90}
                    r={getFlareSize(flare.class) / 2}
                    fill={getFlareColor(flare.class)}
                    opacity="0.9"
                    filter={`url(#glow-${flare.id})`}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Legenda */}
        <div className="grid grid-cols-5 gap-3 text-center text-xs pt-4 border-t border-[var(--color-border)]/30">
          {(["A", "B", "C", "M", "X"] as FlareClass[]).map((cls) => (
            <div key={cls} className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full mb-2 ring-2 ring-[var(--color-border-light)] transition-all hover:scale-125"
                style={{
                  backgroundColor: getFlareColor(cls),
                  opacity: 0.8,
                }}
              />
              <span className="text-[var(--color-text-muted)] font-medium">
                {cls}
              </span>
              <span className="text-[var(--color-text-muted)] opacity-60">
                {cls === "A" ? t("status.calm") : cls === "B" ? t("status.watch") : cls === "C" ? t("status.watch") : cls === "M" ? t("status.alert") : t("status.critical")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}