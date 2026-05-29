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
    <div className="panel-custom p-6 space-y-5 panel-content">
      <div className="space-y-2.5">
        <div className="flex items-center space-x-3">
          <BoltIcon className="h-5 w-5 text-cyan-300/80" />
          <h2 className="text-lg font-600 tracking-tight" style={{color: 'rgba(255, 255, 255, 0.98)'}}>FlareField</h2>
        </div>
        <p className="text-xs uppercase" style={{color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.4px', fontWeight: 500}}>
          Estado del espacio en tu zona
        </p>
      </div>

      <div className="space-y-5">
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-xs uppercase mb-3" style={{color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.5px', fontWeight: 600}}>
            :: CONDICIÓN SOLAR
          </h3>
            <div className="flex items-center space-x-3">
            <AlertChip variant={solarData.condition.toLowerCase() as "stable" | "elevated" | "active" | "critical"}>
              {solarData.condition}
            </AlertChip>
            <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.65)', fontWeight: 500 }}>
              Actualizado {new Date(solarData.lastUpdated).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-xs uppercase mb-3" style={{color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.5px', fontWeight: 600}}>
            :: IMPACTO ESTIMADO
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <MetricCard label="Kp Index" value={solarData.kpIndex.toString()} unit="" />
            <MetricCard label="Próximas horas" value="Próximas" unit="h" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs" style={{color: 'rgba(255, 255, 255, 0.8)'}}>  
              <ClipboardIcon className="h-4 w-4 text-cyan-300/70" />
              <span style={{fontWeight: 500}}>Tecnologías afectadas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {solarData.affectedTech.map((tech, index) => {
                let Icon = DroneIcon;
                if (tech.toLowerCase().includes('wifi')) Icon = SatelliteIcon;
                if (tech.toLowerCase().includes('escuelas')) Icon = SchoolIcon;
                if (tech.toLowerCase().includes('radio')) Icon = RadioIcon;

                return (
                  <span key={index} className="px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255, 255, 255, 0.92)', fontWeight: 500 }}>
                    <Icon className="h-3.5 w-3.5 text-cyan-300/60" />
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
          className="w-full flex h-10 items-center justify-center gap-2 rounded-lg border transition-all duration-200 active:scale-95"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            color: 'rgba(255, 255, 255, 0.92)',
            fontWeight: 600,
            fontSize: '0.8125rem',
            letterSpacing: '0.3px',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
          }}
        >
          VER ALERTA COMPLETA
          <span className="ml-2"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 21H3V3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" /></svg></span>
        </button>
      </div>
    </div>
  );
}