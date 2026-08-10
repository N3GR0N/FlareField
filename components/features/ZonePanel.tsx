"use client";

import { useEffect, useState } from "react";
import { ExternalLink, MonitorSmartphone, RadioTower, School, Wheat, Wifi, Zap, type LucideIcon } from "lucide-react";
import AlertChip from "@/components/ui/AlertChip";
import BubbleCard from "@/components/ui/BubbleCard";

type SolarCondition = "SEÑAL ESTABLE" | "KP ELEVADO" | "TORMENTA ACTIVA";

const techIcons: Record<string, LucideIcon> = {
  "drones": Wheat,
  "wifi": Wifi,
  "escuelas": School,
  "radio": RadioTower,
};

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
      <BubbleCard delay={0}>
        <div className="flex items-center gap-3">
          <Zap size={20} style={{ color: "var(--md-sys-color-primary)" }} />
          <div>
            <h2 className="text-title-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
              FlareField
            </h2>
            <p className="text-label-small" style={{ color: "var(--md-sys-color-outline)" }}>
              {locationName}
            </p>
          </div>
        </div>
      </BubbleCard>

      {/* KP Index */}
      <BubbleCard delay={1}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <p className="mb-2 text-label-small" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
              Kp Index
            </p>
            <div className="text-display-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
              {solarData.kpIndex}
            </div>
          </div>
          <AlertChip variant={severityLevel}>
            {solarData.condition}
          </AlertChip>
        </div>

        <div className="md-divider my-4" />

        <div className="flex items-center justify-between">
          <p className="text-label-small" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
            PRÓXIMAS HORAS
          </p>
          <span className="text-title-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
            +3h
          </span>
        </div>
      </BubbleCard>

      {/* Tecnologías afectadas */}
      <BubbleCard delay={2}>
        <div className="mb-4">
          <span className="text-label-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
            Tecnologías Afectadas
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {solarData.affectedTech.map((tech, i) => {
            const iconKey = Object.keys(techIcons).find(k => tech.toLowerCase().includes(k));
            const Icon = iconKey ? techIcons[iconKey] : MonitorSmartphone;
            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-2xl border px-3 py-2.5 tech-hover"
                style={{
                  borderColor: "var(--md-sys-color-outline-variant)",
                  background: "var(--md-sys-color-surface-container)",
                }}
              >
                <Icon
                  size={14}
                  className="shrink-0"
                  style={{ color: "var(--md-sys-color-primary)" }}
                />
                <span className="text-body-small truncate" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                  {tech}
                </span>
              </div>
            );
          })}
        </div>

        <div className="md-divider my-3" />

        <button
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
          Ver Alerta Completa
          <ExternalLink size={16} />
        </button>
      </BubbleCard>
    </div>
  );
}
