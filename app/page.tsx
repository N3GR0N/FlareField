"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopNav from "@/components/layout/TopNav";
import SolarMap from "@/components/features/SolarMap";
import ZonePanel from "@/components/features/ZonePanel";
import ActiveEventCard from "@/components/features/ActiveEventCard";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
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
    // In a real app, we might show an error message
    console.warn(locationError);
  }

  const locationLabel = locationError
    ? "Ubicación no disponible"
    : userLocation?.name ?? "Detectando...";

  return (
    <div className="page-shell min-h-screen overflow-hidden text-[var(--text)]">
      <div className="fixed inset-0 z-0">
        <SolarMap userLocation={userLocation} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(11,13,15,0.78)_0%,rgba(11,13,15,0.58)_16%,rgba(11,13,15,0.34)_34%,rgba(11,13,15,0.16)_52%,rgba(11,13,15,0)_68%),linear-gradient(180deg,rgba(11,13,15,0.16),rgba(11,13,15,0.44))]" />
      </div>

      <TopNav locationName={locationLabel} />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed left-6 top-6 z-20 max-w-2xl"
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.48em] text-[var(--primary)]/90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
          Institutional solar intelligence
        </p>
        <h1 className="max-w-xl font-sans text-7xl font-extrabold leading-[0.92] tracking-[-0.06em] text-[var(--text)] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] md:text-8xl lg:text-9xl">
          FlareField
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-muted)]/70 drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
          Monitoreo espacial para operaciones críticas con una lectura limpia, sobria y premium.
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="fixed bottom-12 right-8 z-20 w-72 max-w-[340px] md:w-80"
      >
        <ZonePanel userLocation={userLocation} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
        className="fixed bottom-12 left-8 z-20 w-60 md:w-64"
      >
        <ActiveEventCard />
      </motion.div>

      <footer className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2">
        <span className="text-[10px] uppercase tracking-[0.34em] text-[var(--text-muted)]/70">
          © 2026 FlareField
        </span>
      </footer>
    </div>
  );
}
