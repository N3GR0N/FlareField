"use client";

import { useMemo, useEffect, useRef } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Zone } from "@/types/solar";
import { DroneIcon, SatelliteIcon, SchoolIcon, RadioIcon } from "@/components/ui/Icons";

const ACCENT = "var(--accent-fill)";

const getLightTileUrl = () => 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const getDarkTileUrl = () => 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://carto.com">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

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

function ThemeAwareLayer() {
  const map = useMap();
  const mapRef = useRef(map);
  mapRef.current = map;

  const updateTileLayer = (isDark: boolean) => {
    console.log('Updating tiles, isDark:', isDark)
    if (!mapRef.current) return
    
    const url = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current!.removeLayer(layer)
      }
    })
    
    L.tileLayer(url, {
      attribution: '© <a href="https://carto.com">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapRef.current)
  }

  useEffect(() => {
    updateTileLayer(document.documentElement.getAttribute('data-theme') === 'dark')

    const observer = new MutationObserver(() => {
      updateTileLayer(document.documentElement.getAttribute('data-theme') === 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      observer.disconnect()
    }
  }, [map])

  return null
}

const severityOpacity: Record<Zone['severity'], string> = {
  green: "0.55",
  yellow: "0.65",
  orange: "0.8",
  red: "1",
};

const getZoneIcon = (severity: Zone['severity']) => {
  const opacity = severityOpacity[severity];
  const icon = new L.DivIcon({
    html: `<div class="relative w-6 h-6 flex items-center justify-center"><div style="width:8px;height:8px;border-radius:9999px;background:${ACCENT};opacity:${opacity};border:1.5px solid rgba(255,255,255,0.8)"></div></div>`,
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
    <div className="relative h-[calc(100vh-3rem)] w-full nrg-map-base">
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
            <ThemeAwareLayer />

            {zones.map(zone => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={getZoneIcon(zone.severity)}>
                <Popup>
                  <div className="text-title-medium mb-3" style={{ color: "var(--text-primary)" }}>
                    {zone.name}
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <span className={`popup-status-badge severity-${zone.severity}`}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: ACCENT, opacity: severityOpacity[zone.severity] }} />
                      {zone.severity === 'green' ? 'SEÑAL ESTABLE' : zone.severity === 'yellow' ? 'KP ELEVADO' : zone.severity === 'orange' ? 'TORMENTA ACTIVA' : 'TORMENTA CRÍTICA'}
                    </span>
                  </div>
                  <div className="text-label-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                    Tecnologías afectadas
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {zone.affectedTech.map(tech => {
                      let Icon = DroneIcon;
                      if (tech.toLowerCase().includes('wifi')) Icon = SatelliteIcon;
                      if (tech.toLowerCase().includes('escuela')) Icon = SchoolIcon;
                      if (tech.toLowerCase().includes('radio')) Icon = RadioIcon;

                      return (
                        <span key={tech} className="popup-tech-chip">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--accent-fill)]" />
                          <span>{tech}</span>
                        </span>
                      );
                    })}
                  </div>
                  <div className="text-label-small" style={{ color: "var(--text-muted)" }}>
                    Actualizado hace 2 min
                  </div>
                </Popup>

              </Marker>
            ))}

            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={new L.DivIcon({ html: `<div class="relative w-6 h-6 flex items-center justify-center"><div style="width:10px;height:10px;border-radius:9999px;border:2px solid rgba(168,196,232,0.4);background:rgba(168,196,232,0.15)"></div></div>`, iconSize: [12,12], iconAnchor: [6,6] })}>
                <Popup>
                  <div className="text-label-medium uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
                    Tu ubicación
                  </div>
                  <div className="text-body-medium mt-1" style={{ color: "var(--text-secondary)" }}>
                    {userLocation.name}
                  </div>
                </Popup>
              </Marker>
            )}

            <div className="absolute inset-0 pointer-events-none">
              {zones.slice(0,3).map((zone, index) => {
                // Simple line without problematic transform calculations
                const isNearby = Math.abs(zone.lat - (-38.0)) < 5 && Math.abs(zone.lng - (-64.0)) < 5;

                return isNearby ? (
                  <div key={`line-${index}`} className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                       style={{
                         left: `calc(${(zone.lng + 75) * 2}%)`,
                         top: `calc(${(90 - zone.lat) * 2}%)`,
                         width: '4px',
                         height: '4px',
                               backgroundColor: "var(--accent-fill)",
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
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
          <div className="text-center space-y-4">
            <div className="h-6 w-6 rounded-full border-2" style={{ borderColor: "var(--border-subtle)" }}></div>
            <p style={{ fontFamily: "var(--font-mono-stat), sans-serif", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)" }}>Detectando tu ubicación...</p>
          </div>
        </div>
      )}
    </div>
  );
}
