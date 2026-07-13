"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import TopNav from "@/components/layout/TopNav";
import SolarMap from "@/components/features/SolarMap";
import MonitoringPanel from "@/components/features/MonitoringPanel";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleReady = useRef(false);

  const [locationError, setLocationError] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    if (!("geolocation" in navigator)) return "Geolocalización no disponible.";
    return null;
  });

  useEffect(() => {
    let cancelled = false;

    if (!("geolocation" in navigator)) {
      return;
    }

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

    return () => {
      cancelled = true;
    };
  }, []);

  if (locationError) {
    console.warn(locationError);
  }

  const locationLabel = locationError
    ? "Ubicación no disponible"
    : userLocation?.name ?? "Detectando...";

  // Title entrance — runs once, before paint
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



  return (
    <div className="min-h-screen bg-[#0b0f19] overflow-hidden">
      <div className="fixed inset-0 z-0">
        <SolarMap userLocation={userLocation} />
      </div>

      <TopNav locationName={locationLabel} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />

      <div
        ref={titleRef}
        className="fixed left-2 top-12 z-20 max-w-xl pointer-events-none md:left-8 lg:left-12"
      >
        <p className="text-glass-kicker mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          Monitoreo espacial en tiempo real
        </p>
        <h1 className="text-glass-hero text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
          FlareField
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          Monitoreo espacial para operaciones críticas con una lectura limpia, precisa y en tiempo real.
        </p>
      </div>

      <div className="fixed right-8 bottom-24 z-30 max-h-[calc(100vh-10rem)] overflow-y-auto pointer-events-none">
        <MonitoringPanel userLocation={userLocation} />
      </div>

      <footer className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2">
        <span className="text-glass-label">© 2026 FlareField</span>
      </footer>
    </div>
  );
}
