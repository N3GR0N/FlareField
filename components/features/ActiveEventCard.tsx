"use client";

import { useEffect, useState } from "react";
import AlertChip from "@/components/ui/AlertChip";
import { RadarIcon, ClipboardIcon } from "@/components/ui/Icons";

export default function ActiveEventCard() {
  const [event, setEvent] = useState({
    type: "Tormenta Solar",
    class: "X1.2",
    timestamp: new Date().toISOString(),
    source: "NASA DONKI API",
    severity: "red" as const, // green | yellow | orange | red
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
          severity: isFlare
            ? (eventClass.startsWith("X") ? "red" : eventClass.startsWith("M") ? "orange" : "yellow")
            : (eventClass.startsWith("G4") || eventClass.startsWith("G5") ? "red" :
               eventClass.startsWith("G3") ? "orange" : "yellow"),
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
    <div className="panel-custom space-y-5 rounded-[24px] p-6 panel-content">
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-[0.7rem] uppercase tracking-[0.28em] text-[var(--text-muted)]/85">
          <RadarIcon className="h-4 w-4 text-[var(--primary)]/75" />
          <span>:: Evento Activo</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-base font-semibold text-[var(--text)]">{event.type}</span>
            <span className="rounded-full border border-[rgba(201,162,39,0.22)] bg-[rgba(201,162,39,0.08)] px-3 py-1 font-mono text-xs font-semibold tracking-[0.14em] text-[var(--primary)]/92">
              Clase {event.class}
            </span>
          </div>
          <div className="text-xs text-[var(--text-muted)]/75">
            {new Date(event.timestamp).toLocaleString('es-AR', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]/80">
          <ClipboardIcon className="h-4 w-4 text-[var(--primary)]/75" />
          <span className="font-semibold">Fuente:</span>
          <span className="font-mono text-xs text-[var(--text)]/85">{event.source}</span>
        </div>
        <div className="mt-4">
          <AlertChip variant={event.severity === "green" ? "stable" : event.severity === "yellow" ? "elevated" : event.severity === "orange" ? "active" : "critical"}>
            {event.severity === "green" ? "SEÑAL ESTABLE" :
             event.severity === "yellow" ? "KP ELEVADO" :
             event.severity === "orange" ? "TORMENTA ACTIVA" : "TORMENTA CRÍTICA"}
          </AlertChip>
        </div>
      </div>
    </div>
  );
}
