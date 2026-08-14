"use client";

import { ExternalLink, MonitorSmartphone, RadioTower, School, Wheat, Wifi, Zap, type LucideIcon } from "lucide-react";
import AlertChip from "@/components/ui/AlertChip";
import BubbleCard from "@/components/ui/BubbleCard";
import {
  CONDITION_LABELS,
  isDemoData,
  severityFromKp,
  useSolarData,
  type SeverityLevel,
} from "@/hooks/useSolarData";

const techIcons: Record<string, LucideIcon> = {
  "drones": Wheat,
  "wifi": Wifi,
  "escuelas": School,
  "radio": RadioTower,
};

const TECH_LIST = [
  "Drones de fumigación",
  "WiFi satelital",
  "Internet en escuelas rurales",
  "Comunicaciones de radio",
];

const CHIP_VARIANT: Record<SeverityLevel, "stable" | "elevated" | "active" | "critical"> = {
  stable: "stable",
  elevated: "elevated",
  active: "active",
  critical: "critical",
};

export default function ZonePanel({ userLocation }: { userLocation: { lat: number; lng: number; name: string } | null }) {
  const { data, loading, error, refetch } = useSolarData();
  const locationName = userLocation?.name ?? "tu zona";

  const demo = isDemoData(data);
  const severity = severityFromKp(data?.kpIndex?.kp);
  const condition = CONDITION_LABELS[severity];

  if (loading && !data) {
    return (
      <div className="space-y-5">
        <BubbleCard delay={0}>
          <div className="animate-pulse space-y-5">
            <div className="h-4 w-28 rounded-full bg-[var(--bg-surface-2)]" />
            <div className="h-20 w-20 rounded-full bg-[var(--bg-surface-2)]" />
          </div>
        </BubbleCard>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-5">
        <BubbleCard delay={0}>
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-label-medium" style={{ color: "var(--text-secondary)" }}>
              No se pudo conectar con los servicios de monitoreo
            </p>
            <button
              onClick={refetch}
              className="flex h-10 items-center justify-center rounded-full px-5 transition-transform active:scale-[0.97]"
              style={{
                background: "var(--accent-fill)",
                color: "var(--text-on-accent)",
                fontFamily: "var(--font-mono-stat), sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              Reintentar
            </button>
          </div>
        </BubbleCard>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <BubbleCard delay={0}>
        <div className="flex items-center gap-3">
          <Zap size={20} style={{ color: "var(--accent-fill)" }} />
          <div>
            <h2 className="text-title-medium" style={{ color: "var(--text-primary)" }}>
              FlareField
            </h2>
            <p className="text-label-small" style={{ color: "var(--text-muted)" }}>
              {locationName}{demo ? " · Datos de demostración" : ""}
            </p>
          </div>
        </div>
      </BubbleCard>

      {/* KP Index */}
      <BubbleCard delay={1}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <p className="mb-2 text-label-small" style={{ color: "var(--text-secondary)" }}>
              Kp Index
            </p>
            <div className="text-display-medium" style={{ color: "var(--text-primary)" }}>
              {data?.kpIndex?.kp ?? "—"}
            </div>
          </div>
          <AlertChip variant={CHIP_VARIANT[severity]}>
            {condition}
          </AlertChip>
        </div>

        <div className="md-divider my-4" />

        <div className="flex items-center justify-between">
          <p className="text-label-small" style={{ color: "var(--text-secondary)" }}>
            PRÓXIMAS HORAS
          </p>
          <span className="text-title-medium" style={{ color: "var(--text-primary)" }}>
            +3h
          </span>
        </div>
      </BubbleCard>

      {/* Tecnologías afectadas */}
      <BubbleCard delay={2}>
        <div className="mb-4">
          <span className="text-label-medium" style={{ color: "var(--text-secondary)" }}>
            {severity === "stable" ? "Tecnologías Monitoreadas" : "Tecnologías Afectadas"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TECH_LIST.map((tech, i) => {
            const iconKey = Object.keys(techIcons).find(k => tech.toLowerCase().includes(k));
            const Icon = iconKey ? techIcons[iconKey] : MonitorSmartphone;
            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-2xl border px-3 py-2.5 tech-hover"
                style={{
                  borderColor: "var(--border-subtle)",
                  background: "var(--bg-surface-2)",
                }}
              >
                <Icon
                  size={14}
                  className="shrink-0"
                  style={{ color: "var(--accent-fill)" }}
                />
                <span className="text-body-small truncate" style={{ color: "var(--text-secondary)" }}>
                  {tech}
                </span>
              </div>
            );
          })}
        </div>

        <div className="md-divider my-3" />

        <button
          className="relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full transition-[background,transform] duration-200 active:scale-[0.97] alert-btn"
          style={{
            background: "transparent",
            color: "var(--accent-text)",
            fontFamily: "var(--font-mono-stat), sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          Ver Alerta Completa
          <ExternalLink size={16} />
        </button>
      </BubbleCard>
    </div>
  );
}