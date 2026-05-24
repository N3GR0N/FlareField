"use client";

import React, { useEffect, useState, useRef } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useSpring, animated } from "@react-spring/web";
import { Zone } from "@/types/solar";
import { PulseMarker } from "@/components/ui/PulseMarker";
import { DroneIcon, SatelliteIcon, SchoolIcon, RadioIcon } from "@/components/ui/Icons";

// Custom icon for zone markers
const getZoneIcon = (severity: Zone['severity']) => {
  const colors: Record<Zone['severity'], string> = {
    green: "#00c896",
    yellow: "#f5a623",
    orange: "#ff6b35",
    red: "#e8334a",
  };

  const hexToRgba = (hex: string, alpha = 1) => {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const icon = new L.DivIcon({
    html: `<div class="relative w-10 h-10 flex items-center justify-center"><div class="absolute inset-0 rounded-full" style="background:${hexToRgba(colors[severity],0.22)}; border:2px solid ${colors[severity]}; filter: blur(0.2px);"></div><div class="pulse-3d" style="width:22px;height:22px;border-radius:9999px;background:${colors[severity]};box-shadow:0 0 12px ${hexToRgba(colors[severity],0.35)}"></div></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -20]
  });

  return icon;
};

// Mock zones data for Argentina (simplified)
const ARGENTINA_ZONES: Zone[] = [
  { id: "la-pampa", name: "La Pampa", lat: -38.0, lng: -64.0, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "buenos-aires", name: "Buenos Aires", lat: -34.6, lng: -58.4, severity: "yellow", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "cordoba", name: "Córdoba", lat: -31.4, lng: -64.2, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "mendoza", name: "Mendoza", lat: -32.9, lng: -68.8, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "salta", name: "Salta", lat: -24.8, lng: -65.4, severity: "yellow", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "chaco", name: "Chaco", lat: -27.5, lng: -59.0, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
];

export default function SolarMapClient({ userLocation }: { userLocation: { lat: number; lng: number; name: string } | null }) {
  const [zones, setZones] = useState<Zone[]>(ARGENTINA_ZONES);
  const mapRef = useRef<any>(null);
  const [mapZoom, setMapZoom] = useState(5);

  // Ensure map is removed on unmount to avoid Leaflet reusing container
  useEffect(() => {
    return () => {
      if (mapRef.current && typeof mapRef.current.remove === 'function') {
        try {
          mapRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Update zone severity based on user location proximity and mock solar activity
  useEffect(() => {
    if (!userLocation) return;

    const updatedZones = zones.map(zone => {
      const distance = Math.sqrt(
        Math.pow(zone.lat - userLocation.lat, 2) +
        Math.pow(zone.lng - userLocation.lng, 2)
      ) * 100;

      let newSeverity = zone.severity;
      if (distance < 200) newSeverity = "yellow";
      if (distance < 100) newSeverity = "orange";
      if (distance < 50) newSeverity = "red";

      return { ...zone, severity: newSeverity };
    });

    setZones(updatedZones);
  }, [userLocation]);

  const getPulseAnimation = (severity: Zone['severity']) => {
    switch (severity) {
      case "red": return "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite";
      case "orange": return "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite";
      case "yellow": return "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite";
      default: return "none";
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full map-3d-root claude-canvas soft-glow">
      <div className="absolute inset-0 overflow-hidden">
        <div className="map-3d-wrap map-3d-tilt relative h-full w-full overflow-hidden" style={{ transformOrigin: 'bottom' }}>
          <MapContainer
            center={[userLocation?.lat ?? -38.0, userLocation?.lng ?? -64.0]}
            zoom={mapZoom}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
            touchZoom={true}
            trackResize={true}
            className="absolute inset-0"
            whenCreated={map => { mapRef.current = map; }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {zones.map(zone => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={getZoneIcon(zone.severity)}>
                <Popup>
                  <div className="text-sm space-y-2">
                    <div className="font-mono text-xs uppercase tracking-wider text-muted">{zone.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `var(--alert-${zone.severity})` }} />
                      <span className="font-label text-xs uppercase">
                        {zone.severity === 'green' ? 'SEÑAL ESTABLE' : zone.severity === 'yellow' ? 'KP ELEVADO' : zone.severity === 'orange' ? 'TORMENTA ACTIVA' : 'TORMENTA CRÍTICA'}
                      </span>
                    </div>
                    <div className="text-label font-label text-xs">Tecnologías afectadas:</div>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {zone.affectedTech.map(tech => {
                        let Icon = DroneIcon;
                        if (tech.toLowerCase().includes('wifi')) Icon = SatelliteIcon;
                        if (tech.toLowerCase().includes('escuela')) Icon = SchoolIcon;
                        if (tech.toLowerCase().includes('radio')) Icon = RadioIcon;

                          return (
                            <span key={tech} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: '#071124', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              <Icon className="h-4 w-4 text-black/70" />
                              <span>{tech}</span>
                            </span>
                          );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-muted">Actualizado hace 2 min</div>
                  </div>
                </Popup>

              </Marker>
            ))}

            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={new L.DivIcon({ html: `<div class="relative w-8 h-8"><div class="absolute inset-0 rounded-full" style="background: var(--primary); opacity:0.18; border:2px solid var(--primary);"></div><div style="width:18px;height:18px;border-radius:9999px;background:var(--primary);opacity:1"></div></div>`, iconSize: [16,16], iconAnchor: [8,8] })}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-mono text-xs uppercase tracking-wider text-muted">Tu ubicación</div>
                    <div className="mt-1 text-label font-label text-xs">{userLocation.name}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            <div className="absolute inset-0 pointer-events-none">
              {zones.slice(0,3).map((zone,index) => {
                const nextZone = zones[(index+1)%zones.length];
                const angle = Math.atan2(nextZone.lat - zone.lat, nextZone.lng - zone.lng) * 180 / Math.PI;
                const width = Math.abs((zone.lat - nextZone.lat) * 2);
                const height = Math.abs((zone.lng - nextZone.lng) * 2);

                return <div key={`line-${index}`} className={`absolute pointer-events-none`} style={{ left: `${zone.lng * 2 + 100}%`, top: `${zone.lat * -2 + 50}%`, width: `${width}px`, height: `${height}px`, backgroundColor: `var(--alert-${zone.severity})`, opacity: 0.12, transform: `rotate(${angle}deg)` }} />
              })}
            </div>
          </MapContainer>

          {/* 3D floor shadow to enhance illusion of depth */}
          <div className="map-floor" />

          <div className="absolute inset-0" style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBkPSJNMCAxMBMjAgMTAgTTEwIDBMMTAgMjAiIHN0eWxlPSJzdHJva2U6I2ZmZjtzdHJva2Utd2lkdGg6MDU7b3BhY2l0eTowLjEiIC8+PC9zdmc+')` }} />
        </div>
      </div>

      {!userLocation && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'var(--background)', opacity: 0.5 }}>
          <div className="text-center space-y-4">
            <div className="h-8 w-8 border-2 border-primary rounded-full animate-pulse"></div>
            <p className="text-label font-label text-xs uppercase">Detectando tu ubicación...</p>
          </div>
        </div>
      )}
    </div>
  );
}
