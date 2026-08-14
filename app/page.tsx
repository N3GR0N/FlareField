"use client";

import { useEffect, useState, useCallback } from "react";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import SolarMap from "@/components/features/SolarMap";
import MonitoringPanel from "@/components/features/MonitoringPanel";
import SlidePanel from "@/components/features/SlidePanel";
import { LayoutDashboard } from "lucide-react";
import {
  CONDITION_LABELS,
  SEVERITY_DOT_COLORS,
  severityFromKp,
  useSolarData,
} from "@/hooks/useSolarData";
export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { data, loading } = useSolarData();

  const [locationError, setLocationError] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    if (!("geolocation" in navigator)) return "Geolocalización no disponible.";
    return null;
  });

  useEffect(() => {
    let cancelled = false;

    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (cancelled) return;
        const { latitude, longitude } = position.coords;
        let locationName = "Tu ubicación";

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { "Accept-Language": "es" } }
          );
          if (response.ok) {
            const data = await response.json();
            locationName =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              data?.address?.state ||
              data?.display_name?.split(",")?.[0] ||
              locationName;
          }
        } catch {
          // Keep fallback name
        }

        setUserLocation({ lat: latitude, lng: longitude, name: locationName });
      },
      (error) => {
        if (cancelled) return;
        setLocationError(error.message || "No se pudo obtener la ubicación.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );

    return () => { cancelled = true; };
  }, []);

  const locationLabel = locationError
    ? "Ubicación no disponible"
    : userLocation?.name ?? "Detectando...";

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  return (
    <div
      className="min-h-screen overflow-hidden pt-20"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Map background */}
      <div className="fixed inset-0 z-0">
        <SolarMap userLocation={userLocation} />
      </div>

      <TopNav locationName={locationLabel} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      <BottomNav />

      {/* Desktop: floating monitoring panel */}
      <div className="hidden md:block fixed right-8 bottom-12 z-30 w-[348px] max-h-[calc(100vh-10rem)] overflow-y-auto overflow-x-clip pointer-events-none flex flex-col items-end">
        <MonitoringPanel userLocation={userLocation} />
      </div>

      {/* Mobile: floating status pill — resumen de una línea + abre el panel */}
      <button
        onClick={openPanel}
        className="md:hidden fixed right-4 bottom-24 z-30 flex h-12 max-w-[85vw] items-center gap-2.5 rounded-full px-4 transition-transform active:scale-[0.97]"
        style={{
          background: "var(--glass-teal)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-elevated)",
        }}
        aria-label="Abrir panel de monitoreo"
      >
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{
            background: SEVERITY_DOT_COLORS[severityFromKp(data?.kpIndex?.kp)],
            boxShadow: `0 0 8px ${SEVERITY_DOT_COLORS[severityFromKp(data?.kpIndex?.kp)]}`,
          }}
        />
        <span
          className="text-label-medium whitespace-nowrap"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono-stat), sans-serif" }}
        >
          Kp {data?.kpIndex?.kp ?? "—"}
        </span>
        <span
          className="text-label-small truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {loading ? "Cargando…" : CONDITION_LABELS[severityFromKp(data?.kpIndex?.kp)]}
        </span>
        <LayoutDashboard size={16} className="shrink-0" style={{ color: "var(--accent-text)" }} />
      </button>

      {/* Slide-out panel for mobile / zone details */}
      <SlidePanel
        isOpen={panelOpen}
        onClose={closePanel}
        title="Monitoreo"
      >
        <MonitoringPanel userLocation={userLocation} />
      </SlidePanel>

      {/* Footer */}
      <footer className="fixed bottom-20 md:bottom-6 left-1/2 z-10 -translate-x-1/2">
        <span className="text-label-small text-neutral-400 dark:text-neutral-600">
          © 2026 FlareField
        </span>
      </footer>
    </div>
  );
}
