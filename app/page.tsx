"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import SolarMap from "@/components/features/SolarMap";
import ZonePanel from "@/components/features/ZonePanel";
import ActiveEventCard from "@/components/features/ActiveEventCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    if (!("geolocation" in navigator)) {
      setLocationError("Geolocalización no disponible.");
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
    <>
      {/* Map - full viewport */}
      <div className="fixed inset-0 z-0">
        <SolarMap userLocation={userLocation} />
      </div>

      {/* TopNav - overlay on map */}
      <TopNav locationName={locationLabel} />

      {/* Left Panel (Zone) — bottom left corner */}
      <div
        className="fixed left-6 bottom-8 w-72 md:w-80 max-w-[340px] z-20"
        style={{
          transition: 'transform 180ms cubic-bezier(0.23,1,0.32,1), opacity 160ms cubic-bezier(0.77,0,0.175,1)'
        }}
      >
        <ZonePanel userLocation={userLocation} />
      </div>

      {/* Right Panel (Active Event) — bottom right corner */}
      <div className="fixed right-6 bottom-8 w-60 md:w-64 z-20" style={{ transition: 'transform 180ms cubic-bezier(0.23,1,0.32,1)' }}>
        <ActiveEventCard />
      </div>

      {/* Discrete centered footer */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-10">
        <span className="text-[10px] topnav-text" style={{ opacity: 0.4 }}>
          © 2026 FlareField
        </span>
      </div>
    </>
  );
}
