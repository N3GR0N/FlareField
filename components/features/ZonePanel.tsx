"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import AlertChip from "@/components/ui/AlertChip";
import { DroneIcon, SatelliteIcon, SchoolIcon, RadioIcon, ClipboardIcon, BoltIcon } from "@/components/ui/Icons";

export default function ZonePanel({ userLocation }: { userLocation: { lat: number; lng: number; name: string } | null }) {
  const [solarData, setSolarData] = useState({
    condition: "SEÑAL ESTABLE" as const,
    kpIndex: 0,
    lastUpdated: new Date().toISOString(),
    affectedTech: ["Drones de fumigación", "WiFi satelital", "Internet en escuelas rurales", "Comunicaciones de radio"] as const,
  });

  // Fetch solar data (mock for now, will connect to API later)
  useEffect(() => {
    const fetchSolarData = async () => {
      try {
        // Mock data - in real app, this would come from NASA DONKI and NOAA
        const mockCondition = Math.random() > 0.7 ? (Math.random() > 0.5 ? "TORMENTA ACTIVA" : "KP ELEVADO") : "SEÑAL ESTABLE";
        const mockKp = mockCondition === "SEÑAL ESTABLE" ? Math.floor(Math.random() * 3) :
                      mockCondition === "KP ELEVADO" ? 4 + Math.floor(Math.random() * 2) :
                      6 + Math.floor(Math.random() * 3);

        setSolarData({
          condition: mockCondition as typeof solarData.condition,
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

  const getConditionClass = () => {
    switch (solarData.condition) {
      case "SEÑAL ESTABLE": return "border-alert-green/20 bg-alert-green/5 text-alert-green";
      case "KP ELEVADO": return "border-alert-yellow/20 bg-alert-yellow/5 text-alert-yellow";
      case "TORMENTA ACTIVA": return "border-alert-orange/20 bg-alert-orange/5 text-alert-orange";
      default: return "border-alert-green/20 bg-alert-green/5 text-alert-green";
    }
  };

  return (
    <div className="panel-custom p-5 space-y-4 topnav-text panel-content">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <BoltIcon className="h-5 w-5 text-black/80" />
          <h2 className="text-2xl topnav-title tracking-tighter">FlareField</h2>
        </div>
        <p className="text-label text-xs uppercase topnav-text">
          Estado del espacio en tu zona
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-t border-border/20 pt-4">
          <h3 className="text-label text-xs uppercase topnav-text mb-2">
            :: CONDICIÓN SOLAR
          </h3>
            <div className="flex items-center space-x-3">
            <AlertChip variant={solarData.condition.toLowerCase() as "stable" | "elevated" | "active" | "critical"}>
              {solarData.condition}
            </AlertChip>
            <div className="text-label text-xs topnav-text" style={{ opacity: 0.8 }}>
              Actualizado {new Date(solarData.lastUpdated).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-4">
          <h3 className="text-label text-xs uppercase topnav-text mb-2">
            :: IMPACTO ESTIMADO
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <MetricCard label="Kp Index" value={solarData.kpIndex.toString()} unit="" />
            <MetricCard label="Próximas horas" value="Próximas" unit="h" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs topnav-text">
              <ClipboardIcon className="h-4 w-4 text-black/60" />
              <span>Tecnologías afectadas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {solarData.affectedTech.map((tech, index) => {
                let Icon = DroneIcon;
                if (tech.toLowerCase().includes('wifi')) Icon = SatelliteIcon;
                if (tech.toLowerCase().includes('escuelas')) Icon = SchoolIcon;
                if (tech.toLowerCase().includes('radio')) Icon = RadioIcon;

                return (
                  <span key={index} className="px-2.5 py-1 rounded text-xs" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#071124' }}>
                    <Icon className="h-4 w-4 text-black/70" />
                    <span>{tech}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="w-full flex h-10 items-center justify-center gap-2 rounded-md border border-black/10 bg-white/30 px-4 topnav-text transition-all hover:bg-white/40 hover:border-black/20"
        >
          VER ALERTA COMPLETA
          <span className="ml-2"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 21H3V3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" /></svg></span>
        </button>
      </div>
    </div>
  );
}