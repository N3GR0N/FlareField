"use client";

import { useEffect, useState } from "react";
import AlertChip from "@/components/ui/AlertChip";
import { DroneIcon, SatelliteIcon, SchoolIcon, RadioIcon, BoltIcon } from "@/components/ui/Icons";

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

  const severityLevel = solarData.condition === "TORMENTA ACTIVA" ? "critical" :
    solarData.condition === "KP ELEVADO" ? "elevated" : "stable";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-black/25 backdrop-blur-lg border border-white/10 rounded-[var(--radius-glass)] shadow-lg shadow-black/20 relative card-hover">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <BoltIcon className="h-5 w-5 text-[var(--color-accent)]" />
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">FlareField</h2>
              <p className="text-glass-label">
                {locationName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KP Index */}
      <div className="bg-black/25 backdrop-blur-lg border border-white/10 rounded-[var(--radius-glass)] shadow-lg shadow-black/20 relative card-hover">
        <div className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <p className="mb-2 text-glass-label">
                Kp Index
              </p>
              <div className="text-glass-value text-6xl">
                {solarData.kpIndex}
              </div>
            </div>
            <AlertChip variant={severityLevel}>
              {solarData.condition}
            </AlertChip>
          </div>
        </div>

        <div className="h-px bg-[var(--glass-border)]" />

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-glass-label">
              PRÓXIMAS HORAS
            </p>
            <span className="text-glass-value text-base">
              +3h
            </span>
          </div>
        </div>
      </div>

      {/* Tecnologías afectadas */}
      <div className="bg-black/25 backdrop-blur-lg border border-white/10 rounded-[var(--radius-glass)] shadow-lg shadow-black/20 relative card-hover">
        <div className="p-6">
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
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-[var(--radius-glass-sm)] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 tech-hover"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
                  <span className="text-xs text-[var(--text-secondary)] truncate">{tech}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-[var(--glass-border)]" />

        <button className="relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-b-[var(--radius-glass)] bg-transparent text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)] transition-[transform,background] duration-[160ms] ease-out-expo hover:bg-[rgba(33,76,78,0.12)] active:scale-[0.97]">
          Ver Alerta Completa
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 21H3V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
