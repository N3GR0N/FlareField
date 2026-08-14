"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, MonitorSmartphone, RadioTower, School, Wheat, Wifi, type LucideIcon } from "lucide-react";
import AlertChip from "@/components/ui/AlertChip";
import BubbleCard from "@/components/ui/BubbleCard";
import {
  CONDITION_LABELS,
  isDemoData,
  selectActiveEvent,
  severityFromKp,
  useSolarData,
  type SeverityLevel,
} from "@/hooks/useSolarData";

const KP_CIRCUMFERENCE = 2 * Math.PI * 50;

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

export default function MonitoringPanel({ userLocation, showOnlyKp = false, showOnlyEvent = false }: { userLocation: { lat: number; lng: number; name: string } | null; showOnlyKp?: boolean; showOnlyEvent?: boolean }) {
  const { data, loading, error, refetch } = useSolarData();
  const [rippleActive, setRippleActive] = useState(false);

  const locationName = userLocation?.name ?? "tu zona";
  const demo = isDemoData(data);
  const severity = severityFromKp(data?.kpIndex?.kp);
  const condition = CONDITION_LABELS[severity];
  const event = selectActiveEvent(data);
  const eventSeverity = event?.severity ?? "stable";
  const chipVariant = CHIP_VARIANT[eventSeverity];
  const chipLabel = CONDITION_LABELS[eventSeverity];

  const kpValue = data?.kpIndex?.kp ?? null;
  const kpRatio = Math.min((kpValue || 0) / 9, 1);
  const dashOffset = KP_CIRCUMFERENCE * (1 - kpRatio);
  const updatedTime = data
    ? new Date(data.lastUpdated).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : "—";
  const eventTime = event
    ? new Date(event.timestamp).toLocaleString('es-AR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  const techHeader = severity === "stable" ? "Tecnologías Monitoreadas" : "Tecnologías Afectadas";

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-3 w-[330px] pointer-events-auto">
        <BubbleCard delay={0}>
          <div className="animate-pulse space-y-5">
            <div className="h-4 w-36 rounded-full bg-[var(--bg-surface-2)]" />
            <div className="flex items-center gap-8">
              <div className="h-24 w-24 rounded-full bg-[var(--bg-surface-2)]" />
              <div className="space-y-3">
                <div className="h-4 w-28 rounded-full bg-[var(--bg-surface-2)]" />
                <div className="h-4 w-20 rounded-full bg-[var(--bg-surface-2)]" />
                <div className="h-4 w-16 rounded-full bg-[var(--bg-surface-2)]" />
              </div>
            </div>
          </div>
        </BubbleCard>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col gap-3 w-[330px] pointer-events-auto">
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
    <div className="flex flex-col gap-3 w-[330px] pointer-events-auto">
      {!showOnlyEvent && (
        <BubbleCard delay={0}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              {demo ? (
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "var(--zone-c-yellow)", boxShadow: "0 0 8px rgba(var(--zone-c-yellow), 0.5)" }}
                />
              ) : (
                <motion.span
                  className="live-dot"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <span className="text-label-medium" style={{ color: "var(--text-secondary)" }}>
                {demo ? "Datos de Demostración" : "Monitoreo en Vivo"}
              </span>
            </div>
            <span className="text-label-small" style={{ color: "var(--text-muted)" }}>
              {locationName}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="kp-gauge">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                  <linearGradient id="kpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-fill)" />
                    <stop offset="100%" stopColor="var(--accent-text)" />
                  </linearGradient>
                </defs>
                <circle fill="none" className="kp-gauge-track" cx="60" cy="60" r="50" />
                <circle
                  fill="none"
                  className="kp-gauge-fill"
                  cx="60" cy="60" r="50"
                  stroke="url(#kpGradient)"
                  strokeDasharray={KP_CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="kp-gauge-value">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={kpValue ?? "none"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-title-large"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {kpValue ?? "—"}
                  </motion.span>
                </AnimatePresence>
                <span className="text-label-small" style={{ color: "var(--text-muted)" }}>Kp</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="text-label-small mb-1" style={{ color: "var(--text-secondary)" }}>Estado</div>
                <AlertChip variant={CHIP_VARIANT[severity]}>
                  {condition}
                </AlertChip>
              </div>
              <div>
                <div className="text-label-small mb-1" style={{ color: "var(--text-secondary)" }}>Actualizado</div>
                <div className="text-body-medium" style={{ color: "var(--text-secondary)" }}>{updatedTime}</div>
              </div>
              <div>
                <div className="text-label-small mb-1" style={{ color: "var(--text-secondary)" }}>Próximas horas</div>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="live-dot"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="text-body-medium" style={{ color: "var(--text-secondary)" }}>+3h</span>
                </div>
              </div>
            </div>
          </div>
        </BubbleCard>
      )}

      {!showOnlyKp && (
        <BubbleCard delay={1}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="live-dot" />
              <span className="text-label-medium" style={{ color: "var(--text-secondary)" }}>
                Eventos Activos
              </span>
            </div>
            {eventTime && (
              <span className="text-label-small" style={{ color: "var(--text-muted)" }}>
                {eventTime}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <div className="text-body-large font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {event?.type ?? "Sin eventos activos"}
              </div>
              <div className="text-label-small mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
                {event?.source ?? "NASA DONKI API"}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {event && (
                <span className="text-title-medium" style={{ color: "var(--text-primary)" }}>
                  {event.class}
                </span>
              )}
              <AlertChip variant={chipVariant}>
                {chipLabel}
              </AlertChip>
            </div>
          </div>

          <div className="md-divider my-5" />

          <div className="mb-3">
            <span className="text-label-medium" style={{ color: "var(--text-secondary)" }}>
              {techHeader}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TECH_LIST.map((tech, i) => {
              const iconKey = Object.keys(techIcons).find(k => tech.toLowerCase().includes(k));
              const Icon = iconKey ? techIcons[iconKey] : MonitorSmartphone;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-2xl border px-2.5 py-2 tech-hover"
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
                  <span className="text-body-small" style={{ color: "var(--text-secondary)" }}>
                    {tech}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="md-divider mt-5 mb-6" />

          <button
            onClick={() => { setRippleActive(true); setTimeout(() => setRippleActive(false), 400); }}
            className="relative flex h-9 w-full items-center justify-center gap-2 overflow-hidden rounded-full transition-[background,transform] duration-200 active:scale-[0.97] alert-btn"
            style={{
              background: "transparent",
              color: "var(--accent-text)",
              fontFamily: "var(--font-mono-stat), sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            {rippleActive && (
              <motion.span
                className="absolute inset-0"
                style={{ background: "var(--accent-bg)" }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            Ver Alerta Completa
            <ExternalLink size={16} />
          </button>
        </BubbleCard>
      )}
    </div>
  );
}