"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import SolarMap from "@/components/features/SolarMap";
import MonitoringPanel from "@/components/features/MonitoringPanel";
import SlidePanel from "@/components/features/SlidePanel";
export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleReady = useRef(false);

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

  useLayoutEffect(() => {
    if (!titleRef.current || titleReady.current) return;
    titleReady.current = true;

    gsap.set(titleRef.current, { opacity: 0, y: 12 });
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  }, []);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: "var(--md-sys-color-background)" }}
    >
      {/* Map background */}
      <div className="fixed inset-0 z-0">
        <SolarMap userLocation={userLocation} />
      </div>

      <TopNav locationName={locationLabel} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      <BottomNav />

      {/* Hero text — below navbar, compact */}
      <div
        ref={titleRef}
        className="fixed left-4 top-[64px] z-20 max-w-md pointer-events-none md:left-8 lg:left-12"
      >
        <p
          className="text-kicker mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          style={{ color: "var(--md-sys-color-outline)" }}
        >
          Monitoreo espacial en tiempo real
        </p>
        <h1
          className="text-display-medium text-4xl md:text-5xl lg:text-6xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          FlareField
        </h1>
        <p
          className="mt-3 max-w-sm text-body-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          Monitoreo espacial para operaciones críticas con una lectura limpia, precisa y en tiempo real.
        </p>
      </div>

      {/* Desktop: floating monitoring panel */}
      <div className="hidden md:block fixed right-8 bottom-24 z-30 max-h-[calc(100vh-10rem)] overflow-y-auto pointer-events-none">
        <MonitoringPanel userLocation={userLocation} />
      </div>

      {/* Mobile: floating open-panel button */}
      <button
        onClick={openPanel}
        className="md:hidden fixed right-4 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full active:scale-[0.95]"
        style={{
          background: "var(--md-sys-color-primary-container)",
          color: "var(--md-sys-color-on-primary-container)",
          boxShadow: "var(--md-sys-elevation-3)",
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
        <span
          className="text-label-small"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          © 2026 FlareField
        </span>
      </footer>
    </div>
  );
}
