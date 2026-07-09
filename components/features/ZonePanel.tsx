"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
        <div className="flex items-center gap-3">
          <BoltIcon className="h-5 w-5 text-[var(--primary)]/90" />
          <div>
            <h2 className="font-sans text-xl font-bold tracking-tight text-[var(--text)]">FlareField</h2>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--text-muted)]/70">
              {locationName}
            </p>
          </div>
        </div>
      </motion.div>

      {/* KP Index - protagonista visual gigante */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="rounded-2xl border border-white/8 bg-[#14161A]/90 px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-[var(--text-muted)]/70">
              Kp Index
            </p>
            <motion.div
              key={solarData.kpIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-mono-stat text-7xl font-extrabold leading-none tracking-tight text-[var(--text)]"
            >
              {solarData.kpIndex}
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.15 }}
            className="rounded-full"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--background)'
            }}
          >
            <span className="block px-5 py-2.5 text-sm font-bold uppercase tracking-[0.22em] text-center">
              {solarData.condition}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Fila secundaria comprimida: Próximas horas + Tecnologías */}
      <div className="space-y-3">
        {/* Próximas horas - compacto */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.15 }}
          className="rounded-2xl border border-white/8 bg-[#14161A]/90 px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--text-muted)]/70">
              PRÓXIMAS HORAS
            </p>
            <span className="font-mono-stat text-lg font-bold tracking-tight text-[var(--text)]">
              +3h
            </span>
          </div>
        </motion.div>

        {/* Tecnologías afectadas - compacto */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          className="space-y-2"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9CDD3] px-1">
            Tecnologías afectadas
          </p>
          <div className="grid grid-cols-2 gap-2">
            {solarData.affectedTech.map((tech, index) => {
              let Icon = DroneIcon;
              if (tech.toLowerCase().includes('wifi')) Icon = SatelliteIcon;
              if (tech.toLowerCase().includes('escuelas')) Icon = SchoolIcon;
              if (tech.toLowerCase().includes('radio')) Icon = RadioIcon;

              const isActive = index === 0;

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                  className={`rounded-xl border px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
                    isActive
                      ? 'border-[var(--primary)] bg-[#14161A]/90'
                      : 'border-white/8 bg-[#14161A]/90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]/60'}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)]/80'}`}>
                      {tech}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Botón - CTA principal con dorado sólido */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.25 }}
      >
        <button
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#C9A227] text-sm font-bold uppercase tracking-[0.22em] text-[#0B0D0F] transition-all duration-200 hover:bg-[#D4B032] hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(201,162,39,0.3)] active:scale-[0.98]"
        >
          VER ALERTA COMPLETA
          <span className="ml-2"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 21H3V3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" /></svg></span>
        </button>
      </motion.div>
    </motion.div>
  );
}
