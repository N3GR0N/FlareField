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
    // Start with La Pampa, Argentina as the default location
    // No automatic geolocation detection - user can explore the map freely
    setUserLocation({ lat: -38.0, lng: -64.0, name: "La Pampa" });
  }, []);

  if (locationError) {
    // In a real app, we might show an error message
    console.warn(locationError);
  }

  return (
    <>
      {/* TopNav */}
      <TopNav />
      
      {/* Map - full viewport */}
      <div className="fixed inset-0 z-0" style={{ top: '4.5rem', bottom: 0 }}>
        <SolarMap userLocation={userLocation} />
      </div>

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