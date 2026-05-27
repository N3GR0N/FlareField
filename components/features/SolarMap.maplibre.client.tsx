"use client";

import React, { useEffect, useRef } from "react";
import { Zone } from "@/types/solar";

const ARGENTINA_ZONES: Zone[] = [
  { id: "la-pampa", name: "La Pampa", lat: -38.0, lng: -64.0, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "buenos-aires", name: "Buenos Aires", lat: -34.6, lng: -58.4, severity: "yellow", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "cordoba", name: "Córdoba", lat: -31.4, lng: -64.2, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "mendoza", name: "Mendoza", lat: -32.9, lng: -68.8, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "salta", name: "Salta", lat: -24.8, lng: -65.4, severity: "yellow", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
  { id: "chaco", name: "Chaco", lat: -27.5, lng: -59.0, severity: "green", affectedTech: ["Drones", "WiFi Sat", "Escuela", "Radio"] },
];

const DEFAULT_CENTER = { lat: -38.0, lng: -64.0 };

function getCameraPreset() {
  if (typeof window === "undefined") {
    return { zoom: 6.1, pitch: 38, bearing: 0, exaggeration: 0.92 };
  }

  const isWideViewport = window.matchMedia("(min-width: 1280px)").matches;

  return isWideViewport
    ? { zoom: 6.15, pitch: 40, bearing: 0, exaggeration: 0.96 }
    : { zoom: 5.8, pitch: 34, bearing: 0, exaggeration: 0.9 };
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
          center: [userLocation?.lng ?? DEFAULT_CENTER.lng, userLocation?.lat ?? DEFAULT_CENTER.lat],
          zoom: camera.zoom,
          pitch: camera.pitch,
          bearing: camera.bearing,
          antialias: true,
          maxPitch: 80,
          minZoom: 2,
          maxZoom: 18
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

          // Add DEM (raster-dem) and enable real terrain if a MapTiler key is provided
          const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
          if (mapTilerKey) {
            try {
              // raster-dem tileset endpoint (MapTiler Terrain-RGB)
              const demSourceId = 'maptiler-dem';
              if (!map.getSource(demSourceId)) {
                map.addSource(demSourceId, {
                  type: 'raster-dem',
                  tiles: [
                    `https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=${mapTilerKey}`
                  ],
                  tileSize: 512,
                  minzoom: 0,
                  maxzoom: 12
                });

                // set terrain with gentle exaggeration - only if zoom allows it
                try {
                  const currentZoom = map.getZoom();
                  if (currentZoom <= 12) {
                    map.setTerrain({ source: demSourceId, exaggeration: camera.exaggeration });
                  }
                } catch (e) {
                  // some styles or versions may not support setTerrain -> ignore
                }

                // atmospheric fog to keep the 3D scene readable and cinematic
                try {
                  map.setFog && map.setFog({
                    range: [-0.15, 0.95],
                    color: 'rgba(8, 14, 28, 0.04)',
                    'horizon-blend': 0.02,
                    'space-color': 'rgba(5, 9, 24, 0.44)'
                  });
                } catch (e) {}
              }
            } catch (err) {
              // ignore DEM setup errors
            }
          }

          // Try to add building extrusions if the style contains a building vector source
          const style = map.getStyle();
          const layers = style && style.layers ? style.layers : [];
          let buildingLayerFound = false;
          for (const l of layers) {
            if (l['source-layer'] === 'building' || (l.id && l.id.toLowerCase().includes('building'))) {
              buildingLayerFound = true;
              break;
            }
          }

          // If the style exposes building data, attempt an extrusion layer; otherwise skip it.
          const tryAddExtrusion = () => {
            try {
              // find a vector source that likely contains buildings
              const srcNames = Object.keys(style.sources || {});
              let srcName: string | null = null;
              for (const s of srcNames) {
                const src = style.sources[s];
                if (src && src.type === 'vector') {
                  // heuristics: names containing 'building' or 'openmaptiles' are good
                  if (s.toLowerCase().includes('building') || s.toLowerCase().includes('openmaptiles') || s.toLowerCase().includes('osm')) {
                    srcName = s;
                    break;
                  }
                }
              }

              if (!srcName && srcNames.length > 0) srcName = srcNames[0];

              if (srcName && !map.getLayer('buildings-extrusion')) {
                const firstSymbol = layers.find((layer: any) => layer.type === 'symbol')?.id;
                map.addLayer({
                  id: 'buildings-extrusion',
                  source: srcName,
                  'source-layer': 'building',
                  type: 'fill-extrusion',
                  paint: {
                    'fill-extrusion-color': [
                      'interpolate', ['linear'], ['get', 'height'],
                      0, '#5f6b86',
                      20, '#7b88a6',
                      60, '#a2b3d6'
                    ],
                    'fill-extrusion-height': [
                      'case',
                      ['>', ['to-number', ['get', 'height']], 0], ['to-number', ['get', 'height']],
                      ['>', ['to-number', ['get', 'building:levels']], 0], ['*', ['to-number', ['get', 'building:levels']], 3.2],
                      6
                    ],
                    'fill-extrusion-base': ['coalesce', ['get', 'min_height'], 0],
                    'fill-extrusion-opacity': 0.88
                  }
                }, firstSymbol);
              }
            } catch (e) {
              // ignore if adding extrusion fails
            }
          };

          if (buildingLayerFound) {
            tryAddExtrusion();
          }

          ARGENTINA_ZONES.forEach((zone: any) => {
            const el = document.createElement('div');
            el.className = 'maplibre-zone-marker';
            el.style.background = zone.severity === 'red' ? '#e8334a' : zone.severity === 'orange' ? '#ff6b35' : zone.severity === 'yellow' ? '#f5a623' : '#00c896';

            new maplibregl.Marker({ element: el })
              .setLngLat([zone.lng, zone.lat])
                .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`<div style="font-family: Poppins, system-ui; font-size:12px"><strong>${zone.name}</strong><br/>${zone.affectedTech.join(', ')}</div>`))
              .addTo(map);
          });

          if (userLocation) {
            const uel = document.createElement('div');
            uel.className = 'maplibre-user-marker';

            new maplibregl.Marker({ element: uel })
              .setLngLat([userLocation.lng, userLocation.lat])
              .setPopup(new maplibregl.Popup({ offset: 12 }).setText(userLocation.name))
              .addTo(map);
          }

          mapRef.current = map;
        });
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
      
      <div className="pointer-events-none absolute left-5 top-5 z-10 flex max-w-[240px] flex-col gap-2 maplibre-hud">
        <div className="maplibre-hud-pill">Terreno 3D activo</div>
        <div className="maplibre-hud-card">
          <p className="maplibre-hud-kicker">Explorador de Argentina</p>
          <p className="maplibre-hud-title">{locationLabel}</p>
          <p className="maplibre-hud-body">Navega libremente • Relieve 3D en tiempo real</p>
        </div>
      </div>
    </div>
  );
}
