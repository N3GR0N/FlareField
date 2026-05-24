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
    // Simulate geolocation detection
    const detectLocation = async () => {
      try {
        // In a real app, we would use navigator.geolocation
        // For now, we'll use a fixed location for Argentina (La Pampa)
        // and then try to get a real location if permissions allow
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              // Reverse geocode to get region name
              fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then((res) => res.json())
                .then((data) => {
                  const name = data.address?.state || data.address?.city || "Tu zona";
                  setUserLocation({ lat, lng, name });
                })
                .catch(() => {
                  setUserLocation({ lat, lng, name: "Tu zona" });
                });
            },
            (error) => {
              console.error("Geolocation error:", error);
              setLocationError("No se pudo acceder a la ubicación");
              // Fallback to center of Argentina (La Pampa)
              setUserLocation({ lat: -38.0, lng: -64.0, name: "La Pampa" });
            }
          );
        } else {
          setLocationError("La geolocalización no está disponible en este navegador");
          // Fallback to center of Argentina (La Pampa)
          setUserLocation({ lat: -38.0, lng: -64.0, name: "La Pampa" });
        }
      } catch (err) {
        console.error("Error detecting location:", err);
        setLocationError("Error al detectar la ubicación");
        setUserLocation({ lat: -38.0, lng: -64.0, name: "La Pampa" });
      }
    };

    detectLocation();
  }, []);

  if (locationError) {
    // In a real app, we might show an error message
    console.warn(locationError);
  }

  return (
    <div className="relative min-h-screen bg-background claude-canvas">
      <TopNav />
      {/* Map container - will be 3D later */}
      <div className="absolute inset-0" style={{ willChange: 'transform, opacity' }}>
        <SolarMap userLocation={userLocation} />
      </div>

      {/* Left Panel (Zone) — moved to bottom edge for balance */}
      <div
        className="fixed left-6 bottom-8 w-72 md:w-80 max-w-[340px] z-20"
        style={{
          transition: 'transform 180ms cubic-bezier(0.23,1,0.32,1), opacity 160ms cubic-bezier(0.77,0,0.175,1)',
          willChange: 'transform, opacity'
        }}
      >
        <ZonePanel userLocation={userLocation} />
      </div>

      {/* Right Panel (Active Event) — aligned to same bottom edge */}
      <div className="fixed right-6 bottom-8 w-60 md:w-64 z-20" style={{ transition: 'transform 180ms cubic-bezier(0.23,1,0.32,1)', willChange: 'transform' }}>
        <ActiveEventCard />
      </div>

      {/* Discrete centered footer */}
      <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-20">
        <span className="text-xs topnav-text" style={{ opacity: 0.6 }}>
          © 2026 FlareField — Derechos Juan Pedro Suñer
        </span>
      </div>
    </div>
  );
}