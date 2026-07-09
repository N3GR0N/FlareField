"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AlertChip from "@/components/ui/AlertChip";
import { RadarIcon, ClipboardIcon } from "@/components/ui/Icons";

export default function ActiveEventCard() {
  const [event, setEvent] = useState<{
    type: string;
    class: string;
    timestamp: string;
    source: string;
    severity: "green" | "yellow" | "orange" | "red";
    intensity: number[];
  }>({
    type: "Tormenta Solar",
    class: "X1.2",
    timestamp: new Date().toISOString(),
    source: "NASA DONKI API",
    severity: "red",
    intensity: [65, 72, 68, 85, 92, 78, 88] // Mock intensity data for sparkline
  });

  // Fetch active event from NASA DONKI API (mock for now)
  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        // Mock data - in real app, this would come from NASA DONKI API
        const flareClasses = ["C1.2", "M3.5", "X1.2", "X2.0", "X5.3"];
        const stormClasses = ["G1", "G2", "G3", "G4", "G5"];
        const isFlare = Math.random() > 0.5;

        const eventClass = isFlare
          ? flareClasses[Math.floor(Math.random() * flareClasses.length)]
          : stormClasses[Math.floor(Math.random() * stormClasses.length)];

        const mockEvent = {
          type: isFlare ? "Tormenta Solar" : "Tormenta Geomagnética",
          class: eventClass,
          timestamp: new Date().toISOString(),
          source: "NASA DONKI API",
          severity: (isFlare
            ? (eventClass.startsWith("X") ? "red" : eventClass.startsWith("M") ? "orange" : "yellow")
            : (eventClass.startsWith("G4") || eventClass.startsWith("G5") ? "red" :
               eventClass.startsWith("G3") ? "orange" : "yellow")) as "green" | "yellow" | "orange" | "red",
          intensity: [65, 72, 68, 85, 92, 78, 88],
        };

        setEvent(mockEvent);
      } catch (error) {
        console.error("Error fetching active event:", error);
      }
    };

    fetchActiveEvent();
    const interval = setInterval(fetchActiveEvent, 10 * 60 * 1000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-4 p-0"
    >
      {/* Header - burbuja separada */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.05 }}
        className="rounded-2xl border border-white/8 bg-[#14161A]/90 px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center gap-2.5">
          <RadarIcon className="h-4 w-4 text-[var(--primary)]/75" />
          <span className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--text-muted)]/70">
            Evento Activo
          </span>
        </div>
      </motion.div>

      {/* Tipo de evento + Clase - foco visual principal */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="rounded-2xl border border-white/8 bg-[#14161A]/90 px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      >
        <div className="mb-4">
          <span className="block break-words text-2xl font-extrabold leading-tight text-[var(--text)]">
            {event.type}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.15 }}
            className="rounded-full"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--background)'
            }}
          >
            <span className="block px-4 py-2 font-mono-stat text-sm font-bold uppercase tracking-[0.18em]">
              {event.class}
            </span>
          </motion.div>
          <AlertChip variant={event.severity === "green" ? "stable" : event.severity === "yellow" ? "elevated" : event.severity === "orange" ? "active" : "critical"}>
            {event.severity === "green" ? "SEÑAL ESTABLE" :
             event.severity === "yellow" ? "KP ELEVADO" :
             event.severity === "orange" ? "TORMENTA ACTIVA" : "TORMENTA CRÍTICA"}
          </AlertChip>
        </div>
      </motion.div>

      {/* Metadata pequeña discreta: Fecha + Fuente */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="rounded-2xl border border-white/8 bg-[#14161A]/90 px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]/60">
          <div className="flex items-center gap-2">
            <ClipboardIcon className="h-3.5 w-3.5" />
            <span>{event.source}</span>
          </div>
          <span>
            {new Date(event.timestamp).toLocaleString('es-AR', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
