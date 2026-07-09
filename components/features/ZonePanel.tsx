"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import AlertChip from "@/components/ui/AlertChip";
import { DroneIcon, SatelliteIcon, SchoolIcon, RadioIcon, ClipboardIcon, BoltIcon } from "@/components/ui/Icons";

type SolarCondition = "SEÑAL ESTABLE" | "KP ELEVADO" | "TORMENTA ACTIVA";

export default function ZonePanel({ userLocation }: { userLocation: { lat: number; lng: number; name: string } | null }) {
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
  const locationName = userLocation?.name ?? "tu zona";

  // Fetch solar data (mock for now, will connect to API later)
  useEffect(() => {
    const fetchSolarData = async () => {
      try {
        // Mock data - in real app, this would come from NASA DONKI and NOAA
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
    const interval = setInterval(fetchSolarData, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel-custom space-y-6 rounded-[24px] p-7 panel-content">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <BoltIcon className="h-5 w-5 text-[var(--primary)]/90" />
          <h2 className="font-display text-2xl tracking-[-0.03em] text-[var(--text)]">FlareField</h2>
        </div>
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--text-muted)]/85">
          Estado del espacio en {locationName}
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-t border-white/10 pt-4">
          <h3 className="mb-3 topnav-small-text">
            :: Condición solar
          </h3>
          <div className="flex items-center space-x-3">
            <AlertChip variant={solarData.condition.toLowerCase() as "stable" | "elevated" | "active" | "critical"}>
              {solarData.condition}
            </AlertChip>
            <div className="text-xs text-[var(--text-muted)]/75">
              Actualizado {new Date(solarData.lastUpdated).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="mb-3 topnav-small-text">
            :: Impacto estimado
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <MetricCard label="Kp Index" value={solarData.kpIndex.toString()} unit="" />
            <MetricCard label="PRÓXIMAS HORAS" value="+3h" unit="" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]/85">
              <ClipboardIcon className="h-4 w-4 text-[var(--primary)]/75" />
              <span className="font-medium">Tecnologías afectadas:</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {solarData.affectedTech.map((tech, index) => {
                let Icon = DroneIcon;
                if (tech.toLowerCase().includes('wifi')) Icon = SatelliteIcon;
                if (tech.toLowerCase().includes('escuelas')) Icon = SchoolIcon;
                if (tech.toLowerCase().includes('radio')) Icon = RadioIcon;

                return (
                  <span key={index} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--text)]/90 transition-all duration-200 hover:border-[rgba(201,162,39,0.18)] hover:bg-white/[0.06]">
                    <Icon className="h-3.5 w-3.5 text-[var(--primary)]/60" />
                    <span>{tech}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-2">
        <button
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[rgba(201,162,39,0.22)] bg-[rgba(201,162,39,0.08)] text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-[var(--text)]/92 transition-all duration-200 hover:border-[rgba(201,162,39,0.34)] hover:bg-[rgba(201,162,39,0.14)] hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(201,162,39,0.12)] active:scale-[0.98]"
        >
          VER ALERTA COMPLETA
          <span className="ml-2"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 21H3V3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" /></svg></span>
        </button>
      </div>
    </div>
  );
}
