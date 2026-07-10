"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AlertChip from "@/components/ui/AlertChip";
import { DroneIcon, SatelliteIcon, SchoolIcon, RadioIcon } from "@/components/ui/Icons";

type SolarCondition = "SEÑAL ESTABLE" | "KP ELEVADO" | "TORMENTA ACTIVA";
type EventSeverity = "green" | "yellow" | "orange" | "red";

const KP_CIRCUMFERENCE = 2 * Math.PI * 50;

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          layout
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-black/25 backdrop-blur-lg border border-white/10 rounded-[var(--radius-glass)] shadow-lg shadow-black/20 relative card-hover"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <motion.span
                  className="live-dot"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-glass-title">Monitoreo en Vivo</span>
              </div>
              <span className="text-glass-label">{locationName}</span>
            </div>

            <div className="flex items-center gap-8">
              <div className="kp-gauge">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <defs>
                    <linearGradient id="kpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#214c4e" />
                      <stop offset="100%" stopColor="#284863" />
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
                      className="text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)]"
                    >
                      {solarData.kpIndex}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[0.5rem] uppercase tracking-[0.25em] text-[var(--text-muted)] mt-0.5">Kp</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-glass-label mb-1">Estado</div>
                  <AlertChip variant={severityLevel}>
                    {solarData.condition}
                  </AlertChip>
                </div>
                <div>
                  <div className="text-glass-label mb-1">Actualizado</div>
                  <div className="text-sm text-[var(--text-secondary)]">{updatedTime}</div>
                </div>
                <div>
                  <div className="text-glass-label mb-1">Próximas horas</div>
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      className="live-dot"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="text-sm text-[var(--text-secondary)]">+3h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!showOnlyKp && (
        <div className="bg-black/25 backdrop-blur-lg border border-white/10 rounded-[var(--radius-glass)] shadow-lg shadow-black/20 relative card-hover animate-glass-in"
          style={{ animationDelay: '100ms' }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="live-dot" />
                <span className="text-glass-title">Eventos Activos</span>
              </div>
              <span className="text-glass-label">{eventTime}</span>
            </div>

            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{event.type}</div>
                <div className="text-glass-label mt-0.5 truncate">{event.source}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-glass-value text-lg">{event.class}</span>
                <AlertChip variant={chipVariant}>
                  {chipLabel}
                </AlertChip>
              </div>
            </div>

            <div className="h-px bg-[var(--glass-border)] mb-5" />

            <div className="mb-4">
              <span className="text-glass-title">Tecnologías Afectadas</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {solarData.affectedTech.map((tech, i) => {
                const Icon = tech.toLowerCase().includes('wifi') ? SatelliteIcon
                  : tech.toLowerCase().includes('escuelas') ? SchoolIcon
                  : tech.toLowerCase().includes('radio') ? RadioIcon
                  : DroneIcon;
                return (
                  <div key={i} className="flex items-center gap-2 rounded-[var(--radius-glass-sm)] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 tech-hover">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
                    <span className="text-xs text-[var(--text-secondary)] truncate">{tech}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[var(--glass-border)]" />

          <button
            onClick={() => { setRippleActive(true); setTimeout(() => setRippleActive(false), 400); }}
            className="relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-b-[var(--radius-glass)] bg-transparent text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)] transition-[transform,background] duration-[160ms] ease-out-expo hover:bg-[rgba(33,76,78,0.12)] active:scale-[0.97]"
          >
            {rippleActive && (
              <motion.span
                className="absolute inset-0 bg-[var(--color-accent)]/10"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ borderRadius: "50%", left: "50%", top: "50%", width: 40, height: 40, transform: "translate(-50%, -50%)" }}
              />
            )}
            Ver Alerta Completa
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21H3V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
