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
          // CSS import might fail in some bundlers; ignore errors
          import('maplibre-gl/dist/maplibre-gl.css').catch(() => null)
        ]);
        if (cancelled) return;
        const maplibregl = (mod as any).default || mod;

        const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE || `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY || ''}`;

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: styleUrl,
          center: [userLocation?.lng ?? -64.0, userLocation?.lat ?? -38.0],
          zoom: 5.25,
          pitch: 68,
          bearing: -28,
          antialias: true
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
        map.dragRotate.enable();
        map.touchZoomRotate.enable();

        map.on('load', () => {
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
                  maxzoom: 14
                });

                // set terrain with gentle exaggeration
                try {
                  map.setTerrain({ source: demSourceId, exaggeration: 1.45 });
                } catch (e) {
                  // some styles or versions may not support setTerrain -> ignore
                }

                // optional: soft fog to enhance depth
                try {
                  map.setFog && map.setFog({ 'range': [-1, 2], 'color': 'rgba(3, 8, 20, 0.16)', 'horizon-blend': 0.08 });
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

          // If we didn't find a building layer, attempt to add an extrusion layer referencing a common vector source name
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

          if (!buildingLayerFound) {
            tryAddExtrusion();
          }

          ARGENTINA_ZONES.forEach((zone: any) => {
            const el = document.createElement('div');
            el.className = 'rounded-full';
            el.style.width = '18px';
            el.style.height = '18px';
            el.style.boxShadow = '0 4px 12px rgba(2,6,23,0.35)';
            el.style.background = zone.severity === 'red' ? '#e8334a' : zone.severity === 'orange' ? '#ff6b35' : zone.severity === 'yellow' ? '#f5a623' : '#00c896';

            new maplibregl.Marker({ element: el })
              .setLngLat([zone.lng, zone.lat])
                .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`<div style="font-family: Poppins, system-ui; font-size:12px"><strong>${zone.name}</strong><br/>${zone.affectedTech.join(', ')}</div>`))
              .addTo(map);
          });

          if (userLocation) {
            const uel = document.createElement('div');
            uel.style.width = '16px';
            uel.style.height = '16px';
            uel.style.borderRadius = '9999px';
            uel.style.background = 'var(--primary)';
            uel.style.boxShadow = '0 6px 18px rgba(0,102,204,0.45)';

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

  return <div ref={containerRef} className="w-full h-[calc(100vh-4rem)] rounded-lg maplibre-dark-shell" />;
}
