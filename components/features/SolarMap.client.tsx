"use client";

import { useMemo, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Zone } from "@/types/solar";
import { DroneIcon, SatelliteIcon, SchoolIcon, RadioIcon } from "@/components/ui/Icons";

const ACCENT = "#214c4e";

function ContextMenuBlocker() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const handler = (e: Event) => e.preventDefault();
    container.addEventListener("contextmenu", handler);
    return () => container.removeEventListener("contextmenu", handler);
  }, [map]);
  return null;
}

const severityOpacity: Record<Zone['severity'], string> = {
  green: "0.3",
  yellow: "0.5",
  orange: "0.75",
  red: "1",
};

const getZoneIcon = (severity: Zone['severity']) => {
  const opacity = severityOpacity[severity];
  const icon = new L.DivIcon({
    html: `<div class="relative w-6 h-6 flex items-center justify-center"><div style="width:8px;height:8px;border-radius:9999px;background:${ACCENT};opacity:${opacity};border:1.5px solid rgba(255,255,255,0.3)"></div></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -16]
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
  const mapZoom = 5;

  const zones = useMemo(() => {
    if (!userLocation) return ARGENTINA_ZONES;

    return ARGENTINA_ZONES.map(zone => {
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
  }, [userLocation]);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full nrg-map-base">
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full overflow-hidden">
          <MapContainer
            center={[userLocation?.lat ?? -38.0, userLocation?.lng ?? -64.0]}
            zoom={mapZoom}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
            touchZoom={true}
            trackResize={true}
            className="absolute inset-0"
          >
            <ContextMenuBlocker />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {zones.map(zone => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={getZoneIcon(zone.severity)}>
                <Popup>
                  <div className="bg-black/25 backdrop-blur-lg border border-white/10 rounded-[var(--radius-glass)] shadow-lg shadow-black/20 p-6 min-w-[280px]">
                    <div className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)] mb-4">{zone.name}</div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT, opacity: severityOpacity[zone.severity] }} />
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                        {zone.severity === 'green' ? 'SEÑAL ESTABLE' : zone.severity === 'yellow' ? 'KP ELEVADO' : zone.severity === 'orange' ? 'TORMENTA ACTIVA' : 'TORMENTA CRÍTICA'}
                      </span>
                    </div>
                    <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">Tecnologías afectadas:</div>
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      {zone.affectedTech.map(tech => {
                        let Icon = DroneIcon;
                        if (tech.toLowerCase().includes('wifi')) Icon = SatelliteIcon;
                        if (tech.toLowerCase().includes('escuela')) Icon = SchoolIcon;
                        if (tech.toLowerCase().includes('radio')) Icon = RadioIcon;

                          return (
                             <span key={tech} className="flex items-center gap-2 rounded-[var(--radius-glass-sm)] border border-white/[0.08] bg-[rgba(11,15,25,0.9)] px-3 py-2">
                              <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
                              <span className="text-xs text-[var(--text-muted)] truncate">{tech}</span>
                            </span>
                          );
                      })}
                    </div>
                    <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Actualizado hace 2 min</div>
                  </div>
                </Popup>

              </Marker>
            ))}

            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={new L.DivIcon({ html: `<div class="relative w-6 h-6 flex items-center justify-center"><div style="width:10px;height:10px;border-radius:9999px;border:2px solid rgba(40,54,85,0.4);background:rgba(40,54,85,0.15)"></div></div>`, iconSize: [12,12], iconAnchor: [6,6] })}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">Tu ubicación</div>
                    <div className="mt-1 text-xs text-[var(--text-secondary)]">{userLocation.name}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            <div className="absolute inset-0 pointer-events-none">
              {zones.slice(0,3).map((zone,index) => {
                const nextZone = zones[(index+1)%zones.length];
                // Simple line without problematic transform calculations
                const isNearby = Math.abs(zone.lat - (-38.0)) < 5 && Math.abs(zone.lng - (-64.0)) < 5;

                return isNearby ? (
                  <div key={`line-${index}`} className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                       style={{
                         left: `calc(${(zone.lng + 75) * 2}%)`,
                         top: `calc(${(90 - zone.lat) * 2}%)`,
                         width: '4px',
                         height: '4px',
                           backgroundColor: "#214c4e",
                         opacity: 0.25,
                         borderRadius: '2px'
                       }} />
                ) : null;
              })}
            </div>
          </MapContainer>

        </div>
      </div>

      {!userLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]">
          <div className="text-center space-y-4">
            <div className="h-6 w-6 rounded-full border-2 border-[var(--glass-border)]"></div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-primary)]">Detectando tu ubicación...</p>
          </div>
        </div>
      )}
    </div>
  );
}
