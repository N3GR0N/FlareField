"use client";

import React, { useEffect, useRef } from "react";
import { Zone } from "@/types/solar";

const WORLD_ZONES: Zone[] = [
  { id: "buenos-aires", name: "Buenos Aires", lat: -34.6, lng: -58.4, severity: "yellow", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "tokyo", name: "Tokio", lat: 35.6, lng: 139.7, severity: "red", affectedTech: ["Satélites", "5G", "Telecoms", "GPS"] },
  { id: "sydney", name: "Sídney", lat: -33.9, lng: 151.2, severity: "orange", affectedTech: ["IoT", "Radar", "WiFi Sat"] },
  { id: "nairobi", name: "Nairobi", lat: -1.3, lng: 36.8, severity: "yellow", affectedTech: ["Telecoms", "Drones", "GPS"] },
  { id: "london", name: "Londres", lat: 51.5, lng: -0.1, severity: "green", affectedTech: ["Monitoreo", "Datos"] },
  { id: "los-angeles", name: "Los Ángeles", lat: 34.0, lng: -118.2, severity: "red", affectedTech: ["Satélites", "Telecoms", "GPS", "5G"] },
  { id: "delhi", name: "Nueva Delhi", lat: 28.6, lng: 77.2, severity: "yellow", affectedTech: ["WiFi Sat", "Drones", "Radio"] },
  { id: "sao-paulo", name: "São Paulo", lat: -23.5, lng: -46.6, severity: "orange", affectedTech: ["Telecoms", "Satélites", "IoT"] },
  { id: "mexico-city", name: "Ciudad de México", lat: 19.4, lng: -99.1, severity: "orange", affectedTech: ["5G", "Telecoms", "GPS"] },
  { id: "new-york", name: "Nueva York", lat: 40.7, lng: -74.0, severity: "yellow", affectedTech: ["Finanzas", "Telecoms", "GPS"] },
  { id: "cairo", name: "El Cairo", lat: 30.0, lng: 31.2, severity: "orange", affectedTech: ["Energía", "Telecoms", "GPS"] },
  { id: "johannesburg", name: "Johannesburgo", lat: -26.2, lng: 28.0, severity: "yellow", affectedTech: ["Minería", "Telecoms", "GPS"] },
  { id: "singapore", name: "Singapur", lat: 1.35, lng: 103.8, severity: "red", affectedTech: ["5G", "Telecoms", "Puertos"] },
  { id: "reykjavik", name: "Reikiavik", lat: 64.1, lng: -21.9, severity: "red", affectedTech: ["Satélites", "Monitoreo"] },
];

const DEFAULT_CENTER = { lat: 15.0, lng: 50.0 };

function getCameraPreset() {
  if (typeof window === "undefined") {
    return { zoom: 2.2, pitch: 0, bearing: 0 };
  }

  const isWideViewport = window.matchMedia("(min-width: 1280px)").matches;

  return isWideViewport
    ? { zoom: 2.5, pitch: 0, bearing: 0 }
    : { zoom: 2.2, pitch: 0, bearing: 0 };
}

export default function SolarMapMapLibre({ userLocation }: { userLocation: { lat: number; lng: number; name: string } | null }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        // Dynamically import maplibre (and CSS) at runtime so build won't fail if package missing
        const [mod] = await Promise.all([
          import('maplibre-gl'),
        ]);
        if (cancelled) return;
        const maplibregl = (mod as any).default || mod;

        const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
        const camera = getCameraPreset();

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: styleUrl,
          center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
          zoom: camera.zoom,
          pitch: camera.pitch,
          bearing: camera.bearing,
          antialias: true,
          maxPitch: 80,
          minZoom: 2,
          maxZoom: 18,
          renderWorldCopies: true
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

        map.on('load', () => {
          // Force resize after a small delay to ensure dimensions are correct
          setTimeout(() => {
            map.resize();
          }, 100);
          
          // Enable interactions
          if (!map.dragRotate.isEnabled()) map.dragRotate.enable();
          if (!map.touchZoomRotate.isEnabled()) map.touchZoomRotate.enable();
          map.dragPan.enable();
          map.scrollZoom.enable();
          map.doubleClickZoom.enable();

          mapRef.current = map;
        });

        // Add markers using HTML overlay (more reliable than maplibregl.Marker)
        const addMarkersToOverlay = () => {
          const overlay = document.querySelector('.maplibre-markers-overlay');
          if (!overlay) return;

          // Clear any existing markers
          overlay.innerHTML = '';

          const colorMap: Record<Zone["severity"], string> = {
            'red': '#e8334a',
            'orange': '#ff6b35',
            'yellow': '#f5a623',
            'green': '#00c896'
          };

          const toRgb = (hex: string) => {
            const cleaned = hex.replace('#', '');
            const value = cleaned.length === 3
              ? cleaned.split('').map((ch) => ch + ch).join('')
              : cleaned;
            const num = parseInt(value, 16);
            const r = (num >> 16) & 255;
            const g = (num >> 8) & 255;
            const b = num & 255;
            return `${r} ${g} ${b}`;
          };

          // Create zone markers
          WORLD_ZONES.forEach((zone) => {
            const markerEl = document.createElement('div');
            markerEl.className = 'maplibre-storm-zone';
            markerEl.setAttribute('data-zone', zone.name);
            markerEl.setAttribute('data-severity', zone.severity);
            markerEl.setAttribute('data-lng', String(zone.lng));
            markerEl.setAttribute('data-lat', String(zone.lat));

            const color = colorMap[zone.severity] || '#00c896';
            markerEl.style.setProperty('--storm-color', toRgb(color));

            markerEl.innerHTML = `
              <svg class="maplibre-storm-core" viewBox="0 0 120 120" fill="none">
                <defs>
                  <radialGradient id="storm-core-${zone.id}" cx="35%" cy="35%">
                    <stop offset="0%" style="stop-color:rgb(var(--storm-color));stop-opacity:0.32" />
                    <stop offset="68%" style="stop-color:rgb(var(--storm-color));stop-opacity:0" />
                  </radialGradient>
                  <marker id="arrow-${zone.id}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6" fill="${color}" />
                  </marker>
                </defs>
                
                <!-- Storm core background -->
                <circle cx="60" cy="60" r="58" fill="url(#storm-core-${zone.id})" stroke="${color}" stroke-width="1.2" opacity="0.8" />
                
                <!-- Flow paths with arrows -->
                <path class="flow-path flow-path-1" d="M 14 64 Q 42 40 70 50 T 106 58" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow-${zone.id})" opacity="0.9" />
                <path class="flow-path flow-path-2" d="M 18 78 Q 46 60 74 66 T 100 72" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow-${zone.id})" opacity="0.6" />
                <path class="flow-path flow-path-3" d="M 22 50 Q 44 36 66 44 T 96 48" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow-${zone.id})" opacity="0.45" />
              </svg>
              <div class="maplibre-marker-popup" style="display:none; position:absolute; top:-30px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.9); color:white; padding:4px 8px; border-radius:4px; font-size:11px; white-space:nowrap; pointer-events:none;">
                ${zone.name}
              </div>
            `;

            markerEl.style.position = 'absolute';
            markerEl.style.left = '0';
            markerEl.style.top = '0';
            markerEl.style.transform = 'translate(-50%, -50%)';
            markerEl.style.cursor = 'pointer';
            markerEl.style.zIndex = '10';
            markerEl.style.pointerEvents = 'auto';

            markerEl.addEventListener('mouseenter', () => {
              const popup = markerEl.querySelector<HTMLElement>('.maplibre-marker-popup');
              if (popup) popup.style.display = 'block';
            });
            markerEl.addEventListener('mouseleave', () => {
              const popup = markerEl.querySelector<HTMLElement>('.maplibre-marker-popup');
              if (popup) popup.style.display = 'none';
            });

            overlay.appendChild(markerEl);
          });

          // Create user marker if available
          if (userLocation) {
            const userMarker = document.createElement('div');
            userMarker.className = 'maplibre-user-marker';
            userMarker.setAttribute('data-lng', String(userLocation.lng));
            userMarker.setAttribute('data-lat', String(userLocation.lat));
            userMarker.style.position = 'absolute';
            userMarker.style.width = '20px';
            userMarker.style.height = '20px';
            userMarker.style.left = '0';
            userMarker.style.top = '0';
            userMarker.style.transform = 'translate(-50%, -50%)';
            userMarker.style.background = 'radial-gradient(circle, #4a9eff 0%, #0066cc 70%)';
            userMarker.style.border = '2px solid white';
            userMarker.style.borderRadius = '50%';
            userMarker.style.zIndex = '5';
            userMarker.style.boxShadow = '0 0 12px rgba(74, 158, 255, 0.6)';
            userMarker.style.pointerEvents = 'auto';
            overlay.appendChild(userMarker);
          }

          // Function to update marker positions based on map projection
          const updateMarkerPositions = () => {
            const markers = overlay.querySelectorAll('[data-lng][data-lat]');
            markers.forEach((marker: any) => {
              const lng = parseFloat(marker.getAttribute('data-lng'));
              const lat = parseFloat(marker.getAttribute('data-lat'));
              
              // Project lat/lng to pixel coordinates
              const pixel = map.project([lng, lat]);
              
              // Update marker position
              marker.style.left = pixel.x + 'px';
              marker.style.top = pixel.y + 'px';
            });
          };

          // Initial position update
          updateMarkerPositions();

          // Update positions on map move
          map.on('move', updateMarkerPositions);
          map.on('zoom', updateMarkerPositions);
          map.on('rotate', updateMarkerPositions);
        };

        // Wait for map to be ready then add markers
        if (map.loaded()) {
          addMarkersToOverlay();
        } else {
          map.once('idle', addMarkersToOverlay);
        }
      
      } catch (err) {
        // maplibre not installed or failed to load — warn but don't throw
        // console.warn('MapLibre not loaded:', err);
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [containerRef, userLocation]);

  const locationLabel = userLocation?.name || "La Pampa";

  return (
    <div className="relative w-full h-full overflow-hidden maplibre-dark-shell">
      <div 
        ref={containerRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }} 
      />
      
      {/* Markers overlay container */}
      <div 
        className="maplibre-markers-overlay pointer-events-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 5
        }}
      />
      
      <div className="pointer-events-none absolute left-5 top-5 z-10 flex max-w-[240px] flex-col gap-2 maplibre-hud">
        <div className="maplibre-hud-pill">Impacto Global en Vivo</div>
        <div className="maplibre-hud-card">
          <p className="maplibre-hud-kicker">Monitor de Tormentas</p>
          <p className="maplibre-hud-title">Eventos Solares</p>
          <p className="maplibre-hud-body">Flujos en tiempo real • {WORLD_ZONES.length} zonas activas</p>
        </div>
      </div>
    </div>
  );
}
