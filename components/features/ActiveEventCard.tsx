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
        const eventTypes = ["Tormenta Solar", "Tormenta Geomagnética"];
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

  const getSeverityClass = () => {
    switch (event.severity) {
      case "green": return "border-alert-green/20 bg-alert-green/5 text-alert-green";
      case "yellow": return "border-alert-yellow/20 bg-alert-yellow/5 text-alert-yellow";
      case "orange": return "border-alert-orange/20 bg-alert-orange/5 text-alert-orange";
      case "red": return "border-alert-red/20 bg-alert-red/5 text-alert-red";
      default: return "border-alert-green/20 bg-alert-green/5 text-alert-green";
    }
  };

  return (
    <div className="panel-custom p-4 space-y-3 topnav-text panel-content">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs topnav-text">
          <RadarIcon className="h-4 w-4 text-black/60" />
          <span>:: EVENTO ACTIVO</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs topnav-text">{event.type}</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: '#071124' }}>
              Clase {event.class}
            </span>
          </div>
          <div className="text-xs topnav-text">
            {new Date(event.timestamp).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>

      <div className="border-t border-border/20 pt-3">
        <div className="flex items-center space-x-2 text-xs topnav-text">
          <ClipboardIcon className="h-4 w-4 text-black/60" />
          <span>Fuente:</span>
          <span className="font-mono text-xs topnav-text">{event.source}</span>
        </div>
        <div className="mt-2">
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