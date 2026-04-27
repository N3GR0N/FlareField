"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Button from "@/components/ui/Button";
import type { LucideIcon } from "lucide-react";
import {
  Crosshair,
  LocateFixed,
  Radio,
  Satellite,
  ScanLine,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type RiskLevel = "bajo" | "moderado" | "alto" | "crítico";

function getTone(risk: RiskLevel): "calm" | "watch" | "alert" | "critical" {
  if (risk === "bajo") return "calm";
  if (risk === "moderado") return "watch";
  if (risk === "alto") return "alert";
  return "critical";
}

export default function MyZonePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const riskLevel: RiskLevel = "alto";

  const auroraForecast = [
    { day: "OCT 24", kp: "5.3", active: true },
    { day: "OCT 25", kp: "3.1", active: false },
    { day: "OCT 26", kp: "2.8", active: false },
  ];

  const locationData = {
    name: "NORWEGIAN SEA",
    lat: "LAT: 68.5123",
    lon: "LON: 10.2241",
    alt: "ALT: 45km (150m)",
  };

  const equipmentStats = [
    {
      id: "gps",
      icon: LocateFixed,
      name: "GPS ACCURACY",
      value: "0.8m",
      desc: "Minimal ionospheric delay detected.",
    },
    {
      id: "drones",
      icon: ScanLine,
      name: "DRONE OPS",
      value: "Caution",
      desc: "Sporadic interference expected in sector 2.",
    },
    {
      id: "satellite",
      icon: Satellite,
      name: "SATELLITE LINK",
      value: "L-Band",
      desc: "99.8% availability across current orbit.",
    },
    {
      id: "hf",
      icon: Radio,
      name: "HF / WIFI",
      value: "Stable",
      desc: "Minor scintillation at high frequencies.",
    },
  ] satisfies Array<{
    id: string;
    icon: LucideIcon;
    name: string;
    value: string;
    desc: string;
  }>;

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="liquid-orb top-20 right-32 w-96 h-96 bg-[radial-gradient(circle,var(--color-primary),transparent_70%)]" />
        <div className="liquid-orb bottom-40 left-10 w-72 h-72 bg-[radial-gradient(circle,var(--color-tertiary),transparent_70%)]" />
      </div>

      <Sidebar />

      <main className="flex-1 overflow-auto relative z-10">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-light text-[var(--color-text)] [font-family:var(--font-display)]">
                My Zone
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Ubicación personalizada y pronóstico de aurora boreal
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Edit Zone
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mapa + Risk Level (columna izquierda, 2 filas) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mapa Interactivo */}
              <Card className="p-0 h-80 md:h-96 overflow-hidden relative animate-in fade-in slide-in-from-left-4 duration-700">
                {/* SVG Mapa Mundo */}
                <svg
                  viewBox="0 0 960 600"
                  className="w-full h-full"
                  style={{
                    filter: "brightness(0.8) contrast(1.2)",
                  }}
                >
                  {/* Mapa simplificado */}
                  <defs>
                    <filter id="glow-location">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Fondo */}
                  <rect width="960" height="600" fill="#18120c" />

                  {/* Océanos texturizados */}
                  <circle cx="480" cy="300" r="290" fill="#211a14" opacity="0.45" />

                  {/* Continentes simplificados (rectángulos aproximados) */}
                  <rect x="150" y="100" width="120" height="150" fill="#302921" opacity="0.8" /> {/* Europa */}
                  <rect x="70" y="200" width="180" height="200" fill="#302921" opacity="0.8" /> {/* África */}
                  <rect x="400" y="80" width="200" height="180" fill="#302921" opacity="0.8" /> {/* Asia */}
                  <circle cx="550" cy="400" r="80" fill="#302921" opacity="0.8" /> {/* Australia */}
                  <rect x="650" y="150" width="180" height="250" fill="#302921" opacity="0.8" /> {/* América */}

                  {/* Punto de ubicación (Norwegian Sea) */}
                  <circle
                    cx="360"
                    cy="140"
                    r="3"
                    fill="#ffbe6e"
                    filter="url(#glow-location)"
                    opacity="0.9"
                  />
                  {/* Aura de ubicación */}
                  <circle
                    cx="360"
                    cy="140"
                    r="15"
                    fill="#ffbe6e"
                    opacity="0.15"
                  />

                  {/* Línea de latitud */}
                  <line
                    x1="10"
                    y1="140"
                    x2="950"
                    y2="140"
                    stroke="#ffbe6e"
                    strokeWidth="0.5"
                    opacity="0.2"
                  />

                  {/* Controles zoom */}
                </svg>

                {/* Overlay de controles */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                  <button className="glass-pill w-8 h-8 rounded flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                    <ZoomIn className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <button className="glass-pill w-8 h-8 rounded flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                    <ZoomOut className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              </Card>

              {/* Risk Level Card */}
              <Card className="p-6 md:p-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)] mb-4">
                      Current Risk Level
                    </h3>
                    <div className="flex items-baseline gap-4">
                      <span className="text-6xl font-light text-[var(--color-primary)] [font-family:var(--font-display)]">
                        {riskLevel.toUpperCase()}
                      </span>
                      <StatusChip
                        label={riskLevel}
                        tone={getTone(riskLevel)}
                      />
                    </div>
                  </div>

                  {/* Aurora Forecast */}
                  <div className="border-t border-[var(--color-border)]/30 pt-6 space-y-4">
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
                      3-Day Aurora Forecast
                    </h4>
                    <div className="space-y-3">
                      {auroraForecast.map((forecast) => (
                        <div
                          key={forecast.day}
                          className="glass-soft flex items-center gap-4 p-3 rounded"
                        >
                          <span className="w-16 text-xs font-medium text-[var(--color-text-muted)]">
                            {forecast.day}
                          </span>
                          <div className="flex-1 h-2 bg-[var(--color-surface-high)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[var(--color-primary-muted)] to-[var(--color-primary)]"
                              style={{ width: `${(parseInt(forecast.kp) / 9) * 100}%` }}
                            />
                          </div>
                          <span className="text-right text-sm font-medium text-[var(--color-primary)]">
                            Kp {forecast.kp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Columna derecha: Location + Equipment */}
            <div className="space-y-6">
              {/* Location Info */}
              <Card className="p-6 animate-in fade-in slide-in-from-right-4 duration-700">
                <h3 className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)] mb-4">
                  Location
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="glass-pill mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-primary)]">
                      <Crosshair className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {locationData.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {locationData.lat}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {locationData.lon}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {locationData.alt}
                      </p>
                    </div>
                  </div>
                  <Button variant="outlined" className="w-full mt-4">
                    Download Sector Report
                  </Button>
                </div>
              </Card>

              {/* Equipment Status */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
                  Equipment Status
                </h3>
                {equipmentStats.map((eq, idx) => (
                  <div
                    key={eq.id}
                    className="animate-in fade-in duration-700"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onMouseEnter={() => setHoveredCard(eq.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Card
                      className={`p-4 cursor-pointer border transition-all duration-300 ${
                        hoveredCard === eq.id
                          ? "border-[var(--color-primary)]/50 scale-105"
                          : "border-[var(--color-border)]/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="glass-pill mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-primary)]">
                          <eq.icon className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                        <div className="flex-1">
                          <h4 className="text-xs uppercase tracking-[0.06em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
                            {eq.name}
                          </h4>
                          <p className="text-lg font-light text-[var(--color-primary)] mt-1 [font-family:var(--font-display)]">
                            {eq.value}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-2">
                            {eq.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}