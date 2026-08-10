"use client";

import { useEffect, useState, useCallback } from "react";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import SolarMap from "@/components/features/SolarMap";
import MonitoringPanel from "@/components/features/MonitoringPanel";
import SlidePanel from "@/components/features/SlidePanel";
export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

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

  if (locationError) {
    console.warn(locationError);
  }

  const locationLabel = locationError
    ? "Ubicación no disponible"
    : userLocation?.name ?? "Detectando...";

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  return (
    <div
      className="min-h-screen overflow-hidden pt-20"
      style={{ background: "var(--md-sys-color-background)" }}
    >
      {/* Map background */}
      <div className="fixed inset-0 z-0">
        <SolarMap userLocation={userLocation} />
      </div>

      <TopNav locationName={locationLabel} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      <BottomNav />

      {/* Desktop: floating monitoring panel */}
      <div className="hidden md:block fixed right-8 bottom-12 z-30 w-[398px] max-h-[calc(100vh-10rem)] overflow-y-auto overflow-x-clip pointer-events-none flex flex-col items-end">
        <MonitoringPanel userLocation={userLocation} />
      </div>

      {/* Mobile: floating open-panel button */}
      <button
        onClick={openPanel}
        className="md:hidden fixed right-4 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full active:scale-[0.95]"
        style={{
          background: "var(--md-sys-color-primary-container)",
          color: "var(--md-sys-color-on-primary-container)",
          boxShadow: "var(--shadow-elevated)",
        }}
        aria-label="Abrir panel de monitoreo"
      >
        <span className="material-symbols-outlined text-[24px]">dashboard</span>
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
      <footer className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-6 bottom-20 md:bottom-6">
        <span className="text-label-small text-neutral-400 dark:text-neutral-600">
          © 2026 FlareField
        </span>
      </footer>
    </div>
  );
}
