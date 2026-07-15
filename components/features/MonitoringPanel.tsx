"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AlertChip from "@/components/ui/AlertChip";
import BubbleCard from "@/components/ui/BubbleCard";

type SolarCondition = "SEÑAL ESTABLE" | "KP ELEVADO" | "TORMENTA ACTIVA";
type EventSeverity = "green" | "yellow" | "orange" | "red";

const KP_CIRCUMFERENCE = 2 * Math.PI * 50;

const techIcons: Record<string, string> = {
  "drones": "agriculture",
  "wifi": "wifi",
  "escuelas": "school",
  "radio": "cell_tower",
};

export default function MonitoringPanel({ userLocation, showOnlyKp = false, showOnlyEvent = false }: { userLocation: { lat: number; lng: number; name: string } | null; showOnlyKp?: boolean; showOnlyEvent?: boolean }) {
  const [solarData, setSolarData] = useState<{
    condition: SolarCondition;
    kpIndex: number;
    lastUpdated: string;
    affectedTech: string[];
  }>({
    condition: "SEÑAL ESTABLE",
    kpIndex: 0,
    lastUpdated: new Date().toISOString(),
    affectedTech: ["Drones de fumigación", "WiFi satelital", "Internet en escuelas rurales", "Comunicaciones de radio"],
  });

  const [event, setEvent] = useState<{
    type: string;
    class: string;
    timestamp: string;
    source: string;
    severity: EventSeverity;
  }>({
    type: "Tormenta Solar",
    class: "X1.2",
    timestamp: new Date().toISOString(),
    source: "NASA DONKI API",
    severity: "red",
  });

  const locationName = userLocation?.name ?? "tu zona";

  useEffect(() => {
    const fetchSolarData = async () => {
      try {
        const mockCondition: SolarCondition = Math.random() > 0.7
          ? (Math.random() > 0.5 ? "TORMENTA ACTIVA" : "KP ELEVADO")
          : "SEÑAL ESTABLE";
        const mockKp = mockCondition === "SEÑAL ESTABLE" ? Math.floor(Math.random() * 3) :
                      mockCondition === "KP ELEVADO" ? 4 + Math.floor(Math.random() * 2) :
                      6 + Math.floor(Math.random() * 3);

        setSolarData({
          condition: mockCondition,
          kpIndex: mockKp,
          lastUpdated: new Date().toISOString(),
          affectedTech: [
            "Drones de fumigación",
            "WiFi satelital",
            "Internet en escuelas rurales",
            "Comunicaciones de radio"
          ]
        });
      } catch (error) {
        console.error("Error fetching solar data:", error);
      }
    };

    fetchSolarData();
    const interval = setInterval(fetchSolarData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        const flareClasses = ["C1.2", "M3.5", "X1.2", "X2.0", "X5.3"];
        const stormClasses = ["G1", "G2", "G3", "G4", "G5"];
        const isFlare = Math.random() > 0.5;

        const eventClass = isFlare
          ? flareClasses[Math.floor(Math.random() * flareClasses.length)]
          : stormClasses[Math.floor(Math.random() * stormClasses.length)];

        setEvent({
          type: isFlare ? "Tormenta Solar" : "Tormenta Geomagnética",
          class: eventClass,
          timestamp: new Date().toISOString(),
          source: "NASA DONKI API",
          severity: (isFlare
            ? (eventClass.startsWith("X") ? "red" : eventClass.startsWith("M") ? "orange" : "yellow")
            : (eventClass.startsWith("G4") || eventClass.startsWith("G5") ? "red" :
               eventClass.startsWith("G3") ? "orange" : "yellow")) as EventSeverity,
        });
      } catch (error) {
        console.error("Error fetching active event:", error);
      }
    };

    fetchActiveEvent();
    const interval = setInterval(fetchActiveEvent, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const chipVariant = event.severity === "green" ? "stable" :
    event.severity === "yellow" ? "elevated" :
    event.severity === "orange" ? "active" : "critical";

  const chipLabel = event.severity === "green" ? "SEÑAL ESTABLE" :
    event.severity === "yellow" ? "KP ELEVADO" :
    event.severity === "orange" ? "TORMENTA ACTIVA" : "TORMENTA CRÍTICA";

  const severityLevel = solarData.condition === "TORMENTA ACTIVA" ? "critical" :
    solarData.condition === "KP ELEVADO" ? "elevated" : "stable";

  const [rippleActive, setRippleActive] = useState(false);

  const kpRatio = Math.min((solarData.kpIndex || 0) / 9, 1);
  const dashOffset = KP_CIRCUMFERENCE * (1 - kpRatio);
  const updatedTime = new Date(solarData.lastUpdated).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  const eventTime = new Date(event.timestamp).toLocaleString('es-AR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col gap-5 w-[380px] pointer-events-auto">
      {!showOnlyEvent && (
        <BubbleCard delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <motion.span
                className="live-dot"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-label-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                Monitoreo en Vivo
              </span>
            </div>
            <span className="text-label-small" style={{ color: "var(--md-sys-color-outline)" }}>
              {locationName}
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="kp-gauge">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                  <linearGradient id="kpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--md-sys-color-primary)" />
                    <stop offset="100%" stopColor="var(--md-sys-color-tertiary)" />
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
                    key={solarData.kpIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-title-large"
                    style={{ color: "var(--md-sys-color-on-surface)" }}
                  >
                    {solarData.kpIndex}
                  </motion.span>
                </AnimatePresence>
                <span className="text-label-small" style={{ color: "var(--md-sys-color-outline)" }}>Kp</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="text-label-small mb-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Estado</div>
                <AlertChip variant={severityLevel}>
                  {solarData.condition}
                </AlertChip>
              </div>
              <div>
                <div className="text-label-small mb-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Actualizado</div>
                <div className="text-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>{updatedTime}</div>
              </div>
              <div>
                <div className="text-label-small mb-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Próximas horas</div>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="live-dot"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="text-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>+3h</span>
                </div>
              </div>
            </div>
          </div>
        </BubbleCard>
      )}

      {!showOnlyKp && (
        <BubbleCard delay={1}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <span className="live-dot" />
              <span className="text-label-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                Eventos Activos
              </span>
            </div>
            <span className="text-label-small" style={{ color: "var(--md-sys-color-outline)" }}>
              {eventTime}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="min-w-0">
              <div className="text-body-large font-semibold truncate" style={{ color: "var(--md-sys-color-on-surface)" }}>
                {event.type}
              </div>
              <div className="text-label-small mt-0.5 truncate" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                {event.source}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-title-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                {event.class}
              </span>
              <AlertChip variant={chipVariant}>
                {chipLabel}
              </AlertChip>
            </div>
          </div>

          <div className="md-divider my-6" />

          <div className="mb-4">
            <span className="text-label-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
              Tecnologías Afectadas
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {solarData.affectedTech.map((tech, i) => {
              const iconKey = Object.keys(techIcons).find(k => tech.toLowerCase().includes(k));
              const icon = iconKey ? techIcons[iconKey] : "devices";
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-2xl border px-3 py-2.5 tech-hover"
                  style={{
                    borderColor: "var(--md-sys-color-outline-variant)",
                    background: "var(--md-sys-color-surface-container)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[14px] shrink-0"
                    style={{ color: "var(--md-sys-color-primary)" }}
                  >
                    {icon}
                  </span>
                  <span className="text-body-small" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                    {tech}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="md-divider mt-6 mb-8" />

          <button
            onClick={() => { setRippleActive(true); setTimeout(() => setRippleActive(false), 400); }}
            className="relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full transition-[background,transform] duration-200 active:scale-[0.97] alert-btn"
            style={{
              background: "transparent",
              color: "var(--md-sys-color-primary)",
              fontFamily: "var(--font-mono-stat), sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            {rippleActive && (
              <motion.span
                className="absolute inset-0"
                style={{ background: "var(--md-sys-color-primary-container)" }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            Ver Alerta Completa
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </BubbleCard>
      )}
    </div>
  );
}
