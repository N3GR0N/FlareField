"use client";

import React, { useEffect, useRef } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { Zone } from "@/types/solar";

type Severity = Zone["severity"];
type MapLibreModule = typeof import("maplibre-gl");
type MapLibreImport = MapLibreModule & { default?: MapLibreModule };

const SEVERITY_RANK: Record<Severity, number> = {
  green: 0,
  yellow: 1,
  orange: 2,
  red: 3
};

type CapitalZone = Zone & {
  regionId: string;
  regionName: string;
  countryCode: string;
};

type RegionMeta = {
  width: number;
  height: number;
  countryCount: number;
  spreadLat: number;
  spreadLng: number;
  countryNames: string[];
};

const CAPITAL_ZONES: CapitalZone[] = [
  // América del Norte
  { id: "washington", name: "Estados Unidos", countryCode: "US", regionId: "north-america", regionName: "América del Norte", lat: 38.9, lng: -77.0, severity: "red", affectedTech: ["Satélites", "Telecoms", "GPS", "5G"] },
  { id: "ottawa", name: "Canadá", countryCode: "CA", regionId: "north-america", regionName: "América del Norte", lat: 45.4, lng: -75.7, severity: "yellow", affectedTech: ["Monitoreo", "GPS", "Telecoms"] },

  // América Central y Caribe
  { id: "mexico-city", name: "México", countryCode: "MX", regionId: "central-america", regionName: "América Central y Caribe", lat: 19.4, lng: -99.1, severity: "orange", affectedTech: ["Telecoms", "GPS", "Radio"] },
  { id: "guatemala-city", name: "Guatemala", countryCode: "GT", regionId: "central-america", regionName: "América Central y Caribe", lat: 14.6, lng: -90.5, severity: "yellow", affectedTech: ["Radio", "WiFi Sat", "Drones"] },
  { id: "panama-city", name: "Panamá", countryCode: "PA", regionId: "central-america", regionName: "América Central y Caribe", lat: 8.98, lng: -79.5, severity: "green", affectedTech: ["Puertos", "Telecoms", "GPS"] },
  { id: "havana", name: "Cuba", countryCode: "CU", regionId: "central-america", regionName: "América Central y Caribe", lat: 23.1, lng: -82.4, severity: "yellow", affectedTech: ["Radio", "Telecoms", "Monitoreo"] },
  { id: "santo-domingo", name: "Rep. Dominicana", countryCode: "DO", regionId: "central-america", regionName: "América Central y Caribe", lat: 18.5, lng: -69.9, severity: "orange", affectedTech: ["Telecoms", "GPS", "Satélites"] },

  // América del Sur
  { id: "buenos-aires", name: "Argentina", countryCode: "AR", regionId: "south-america", regionName: "América del Sur", lat: -34.6, lng: -58.4, severity: "red", affectedTech: ["Radio", "WiFi Sat", "Drones", "Energía"] },
  { id: "montevideo", name: "Uruguay", countryCode: "UY", regionId: "south-america", regionName: "América del Sur", lat: -34.9, lng: -56.2, severity: "red", affectedTech: ["Telecoms", "GPS", "Radio"] },
  { id: "brasilia", name: "Brasil", countryCode: "BR", regionId: "south-america", regionName: "América del Sur", lat: -15.8, lng: -47.9, severity: "orange", affectedTech: ["Telecoms", "Satélites", "IoT"] },
  { id: "santiago", name: "Chile", countryCode: "CL", regionId: "south-america", regionName: "América del Sur", lat: -33.4, lng: -70.7, severity: "yellow", affectedTech: ["GPS", "Monitoreo", "Radio"] },
  { id: "lima", name: "Perú", countryCode: "PE", regionId: "south-america", regionName: "América del Sur", lat: -12.0, lng: -77.0, severity: "orange", affectedTech: ["Telecoms", "Drones", "WiFi Sat"] },
  { id: "bogota", name: "Colombia", countryCode: "CO", regionId: "south-america", regionName: "América del Sur", lat: 4.7, lng: -74.1, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Radio"] },

  // Europa Occidental
  { id: "london", name: "Reino Unido", countryCode: "UK", regionId: "western-europe", regionName: "Europa Occidental", lat: 51.5, lng: -0.1, severity: "green", affectedTech: ["Monitoreo", "Datos", "Telecoms"] },
  { id: "paris", name: "Francia", countryCode: "FR", regionId: "western-europe", regionName: "Europa Occidental", lat: 48.9, lng: 2.3, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Energía"] },
  { id: "madrid", name: "España", countryCode: "ES", regionId: "western-europe", regionName: "Europa Occidental", lat: 40.4, lng: -3.7, severity: "orange", affectedTech: ["Telecoms", "GPS", "Satélites"] },
  { id: "berlin", name: "Alemania", countryCode: "DE", regionId: "western-europe", regionName: "Europa Occidental", lat: 52.5, lng: 13.4, severity: "yellow", affectedTech: ["Industria", "GPS", "Telecoms"] },
  { id: "rome", name: "Italia", countryCode: "IT", regionId: "western-europe", regionName: "Europa Occidental", lat: 41.9, lng: 12.5, severity: "orange", affectedTech: ["Telecoms", "Monitoreo", "Energía"] },

  // Europa del Norte y Ártico
  { id: "reykjavik", name: "Islandia", countryCode: "IS", regionId: "northern-europe", regionName: "Europa del Norte y Ártico", lat: 64.1, lng: -21.9, severity: "red", affectedTech: ["Satélites", "Monitoreo", "Radio"] },
  { id: "oslo", name: "Noruega", countryCode: "NO", regionId: "northern-europe", regionName: "Europa del Norte y Ártico", lat: 59.9, lng: 10.8, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Energía"] },
  { id: "stockholm", name: "Suecia", countryCode: "SE", regionId: "northern-europe", regionName: "Europa del Norte y Ártico", lat: 59.3, lng: 18.1, severity: "yellow", affectedTech: ["Monitoreo", "GPS", "Datos"] },
  { id: "helsinki", name: "Finlandia", countryCode: "FI", regionId: "northern-europe", regionName: "Europa del Norte y Ártico", lat: 60.2, lng: 24.9, severity: "orange", affectedTech: ["Telecoms", "Energía", "GPS"] },

  // Europa Oriental
  { id: "warsaw", name: "Polonia", countryCode: "PL", regionId: "eastern-europe", regionName: "Europa Oriental", lat: 52.2, lng: 21.0, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Industria"] },
  { id: "kyiv", name: "Ucrania", countryCode: "UA", regionId: "eastern-europe", regionName: "Europa Oriental", lat: 50.4, lng: 30.5, severity: "orange", affectedTech: ["Energía", "Telecoms", "GPS"] },
  { id: "bucharest", name: "Rumania", countryCode: "RO", regionId: "eastern-europe", regionName: "Europa Oriental", lat: 44.4, lng: 26.1, severity: "yellow", affectedTech: ["Telecoms", "Radio", "GPS"] },
  { id: "moscow", name: "Rusia", countryCode: "RU", regionId: "eastern-europe", regionName: "Europa Oriental", lat: 55.8, lng: 37.6, severity: "orange", affectedTech: ["Satélites", "Telecoms", "GPS"] },

  // Medio Oriente
  { id: "riyadh", name: "Arabia Saudita", countryCode: "SA", regionId: "middle-east", regionName: "Medio Oriente", lat: 24.7, lng: 46.7, severity: "orange", affectedTech: ["Energía", "Telecoms", "GPS"] },
  { id: "tehran", name: "Irán", countryCode: "IR", regionId: "middle-east", regionName: "Medio Oriente", lat: 35.7, lng: 51.4, severity: "red", affectedTech: ["Telecoms", "Satélites", "GPS"] },
  { id: "baghdad", name: "Irak", countryCode: "IQ", regionId: "middle-east", regionName: "Medio Oriente", lat: 33.3, lng: 44.4, severity: "yellow", affectedTech: ["Telecoms", "Radio", "GPS"] },
  { id: "jerusalem", name: "Israel", countryCode: "IL", regionId: "middle-east", regionName: "Medio Oriente", lat: 31.8, lng: 35.2, severity: "orange", affectedTech: ["Telecoms", "GPS", "Monitoreo"] },

  // África del Norte
  { id: "cairo", name: "Egipto", countryCode: "EG", regionId: "north-africa", regionName: "África del Norte", lat: 30.0, lng: 31.2, severity: "orange", affectedTech: ["Energía", "Telecoms", "GPS"] },
  { id: "algiers", name: "Argelia", countryCode: "DZ", regionId: "north-africa", regionName: "África del Norte", lat: 36.7, lng: 3.1, severity: "yellow", affectedTech: ["Telecoms", "Radio", "GPS"] },
  { id: "rabat", name: "Marruecos", countryCode: "MA", regionId: "north-africa", regionName: "África del Norte", lat: 34.0, lng: -6.8, severity: "yellow", affectedTech: ["Telecoms", "Monitoreo", "GPS"] },
  { id: "tunis", name: "Túnez", countryCode: "TN", regionId: "north-africa", regionName: "África del Norte", lat: 36.8, lng: 10.2, severity: "orange", affectedTech: ["Telecoms", "GPS", "Energía"] },

  // África Subsahariana
  { id: "lagos", name: "Nigeria", countryCode: "NG", regionId: "sub-saharan-africa", regionName: "África Subsahariana", lat: 6.5, lng: 3.4, severity: "yellow", affectedTech: ["Telecoms", "Radio", "GPS"] },
  { id: "nairobi", name: "Kenia", countryCode: "KE", regionId: "sub-saharan-africa", regionName: "África Subsahariana", lat: -1.3, lng: 36.8, severity: "yellow", affectedTech: ["Telecoms", "Drones", "GPS"] },
  { id: "johannesburg", name: "Sudáfrica", countryCode: "ZA", regionId: "sub-saharan-africa", regionName: "África Subsahariana", lat: -26.2, lng: 28.0, severity: "orange", affectedTech: ["Minería", "Telecoms", "GPS"] },
  { id: "addis-ababa", name: "Etiopía", countryCode: "ET", regionId: "sub-saharan-africa", regionName: "África Subsahariana", lat: 9.0, lng: 38.7, severity: "orange", affectedTech: ["Radio", "Telecoms", "GPS"] },

  // Asia Central
  { id: "astana", name: "Kazajistán", countryCode: "KZ", regionId: "central-asia", regionName: "Asia Central", lat: 51.2, lng: 71.4, severity: "yellow", affectedTech: ["Telecoms", "Satélites", "GPS"] },
  { id: "tashkent", name: "Uzbekistán", countryCode: "UZ", regionId: "central-asia", regionName: "Asia Central", lat: 41.3, lng: 69.2, severity: "orange", affectedTech: ["Telecoms", "Radio", "GPS"] },

  // Asia del Sur
  { id: "delhi", name: "India", countryCode: "IN", regionId: "south-asia", regionName: "Asia del Sur", lat: 28.6, lng: 77.2, severity: "red", affectedTech: ["WiFi Sat", "Drones", "Radio"] },
  { id: "karachi", name: "Pakistán", countryCode: "PK", regionId: "south-asia", regionName: "Asia del Sur", lat: 24.9, lng: 67.1, severity: "orange", affectedTech: ["Telecoms", "GPS", "Radio"] },
  { id: "dhaka", name: "Bangladés", countryCode: "BD", regionId: "south-asia", regionName: "Asia del Sur", lat: 23.8, lng: 90.4, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Monitoreo"] },
  { id: "colombo", name: "Sri Lanka", countryCode: "LK", regionId: "south-asia", regionName: "Asia del Sur", lat: 6.9, lng: 79.9, severity: "green", affectedTech: ["Telecoms", "Radio", "GPS"] },

  // Asia Oriental
  { id: "tokyo", name: "Japón", countryCode: "JP", regionId: "east-asia", regionName: "Asia Oriental", lat: 35.6, lng: 139.7, severity: "red", affectedTech: ["Satélites", "5G", "Telecoms", "GPS"] },
  { id: "seoul", name: "Corea del Sur", countryCode: "KR", regionId: "east-asia", regionName: "Asia Oriental", lat: 37.6, lng: 127.0, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Datos"] },
  { id: "beijing", name: "China", countryCode: "CN", regionId: "east-asia", regionName: "Asia Oriental", lat: 39.9, lng: 116.4, severity: "orange", affectedTech: ["Telecoms", "Satélites", "GPS"] },
  { id: "taipei", name: "Taiwán", countryCode: "TW", regionId: "east-asia", regionName: "Asia Oriental", lat: 25.0, lng: 121.5, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Monitoreo"] },

  // Sudeste Asiático
  { id: "singapore", name: "Singapur", countryCode: "SG", regionId: "southeast-asia", regionName: "Sudeste Asiático", lat: 1.35, lng: 103.8, severity: "red", affectedTech: ["5G", "Telecoms", "Puertos"] },
  { id: "bangkok", name: "Tailandia", countryCode: "TH", regionId: "southeast-asia", regionName: "Sudeste Asiático", lat: 13.7, lng: 100.5, severity: "orange", affectedTech: ["Telecoms", "GPS", "Drones"] },
  { id: "jakarta", name: "Indonesia", countryCode: "ID", regionId: "southeast-asia", regionName: "Sudeste Asiático", lat: -6.2, lng: 106.8, severity: "orange", affectedTech: ["Telecoms", "GPS", "Radio"] },
  { id: "manila", name: "Filipinas", countryCode: "PH", regionId: "southeast-asia", regionName: "Sudeste Asiático", lat: 14.6, lng: 121.0, severity: "yellow", affectedTech: ["Telecoms", "Radio", "GPS"] },
  { id: "hanoi", name: "Vietnam", countryCode: "VN", regionId: "southeast-asia", regionName: "Sudeste Asiático", lat: 21.0, lng: 105.8, severity: "yellow", affectedTech: ["Telecoms", "GPS", "Monitoreo"] },

  // Oceanía
  { id: "canberra", name: "Australia", countryCode: "AU", regionId: "oceania", regionName: "Oceanía", lat: -35.3, lng: 149.1, severity: "yellow", affectedTech: ["Telecoms", "Satélites", "GPS"] },
  { id: "wellington", name: "Nueva Zelanda", countryCode: "NZ", regionId: "oceania", regionName: "Oceanía", lat: -41.3, lng: 174.8, severity: "green", affectedTech: ["Telecoms", "Monitoreo", "GPS"] }
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildRegionMeta = (zones: CapitalZone[]): Record<string, RegionMeta> => {
  const grouped = new Map<string, { minLat: number; maxLat: number; minLng: number; maxLng: number; count: number; countryNames: Set<string> }>();

  zones.forEach((zone) => {
    const entry = grouped.get(zone.regionId) ?? {
      minLat: zone.lat,
      maxLat: zone.lat,
      minLng: zone.lng,
      maxLng: zone.lng,
      count: 0,
      countryNames: new Set<string>()
    };

    entry.minLat = Math.min(entry.minLat, zone.lat);
    entry.maxLat = Math.max(entry.maxLat, zone.lat);
    entry.minLng = Math.min(entry.minLng, zone.lng);
    entry.maxLng = Math.max(entry.maxLng, zone.lng);
    entry.count += 1;
    entry.countryNames.add(zone.name);
    grouped.set(zone.regionId, entry);
  });

  const meta: Record<string, RegionMeta> = {};
  grouped.forEach((entry, key) => {
    const spreadLat = entry.maxLat - entry.minLat;
    const spreadLng = entry.maxLng - entry.minLng;
    const width = clamp(140 + spreadLng * 2.2, 160, 320);
    const height = clamp(110 + spreadLat * 2.0, 120, 260);

    meta[key] = {
      width,
      height,
      countryCount: entry.count,
      spreadLat,
      spreadLng,
      countryNames: Array.from(entry.countryNames)
    };
  });

  return meta;
};

const createSeededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  let state = Math.abs(hash) + 1;
  return () => {
    state = (state * 48271) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

type BlobEllipse = { cx: number; cy: number; rx: number; ry: number; opacity: number };
type FlowPath = { d: string; strokeWidth: number; opacity: number; className: string };

const getBlobEllipses = (width: number, height: number, seed: string): BlobEllipse[] => {
  const rand = createSeededRandom(seed);
  const baseRx = width * 0.42;
  const baseRy = height * 0.28;

  return [
    {
      cx: width * (0.44 + (rand() - 0.5) * 0.12),
      cy: height * (0.5 + (rand() - 0.5) * 0.12),
      rx: baseRx * (0.92 + rand() * 0.12),
      ry: baseRy * (0.92 + rand() * 0.12),
      opacity: 0.24
    },
    {
      cx: width * (0.62 + (rand() - 0.5) * 0.12),
      cy: height * (0.44 + (rand() - 0.5) * 0.12),
      rx: width * 0.32 * (0.9 + rand() * 0.15),
      ry: height * 0.24 * (0.9 + rand() * 0.15),
      opacity: 0.2
    },
    {
      cx: width * (0.36 + (rand() - 0.5) * 0.12),
      cy: height * (0.6 + (rand() - 0.5) * 0.12),
      rx: width * 0.28 * (0.9 + rand() * 0.15),
      ry: height * 0.22 * (0.9 + rand() * 0.15),
      opacity: 0.16
    }
  ];
};

const getFlowPaths = (width: number, height: number): FlowPath[] => {
  const x1 = width * 0.08;
  const x2 = width * 0.42;
  const x3 = width * 0.7;
  const x4 = width * 0.94;

  return [
    {
      d: `M ${x1} ${height * 0.56} Q ${x2} ${height * 0.28} ${x3} ${height * 0.46} T ${x4} ${height * 0.54}`,
      strokeWidth: 2.4,
      opacity: 0.9,
      className: "flow-path-1"
    },
    {
      d: `M ${x1} ${height * 0.68} Q ${x2} ${height * 0.52} ${x3} ${height * 0.58} T ${x4} ${height * 0.64}`,
      strokeWidth: 2.0,
      opacity: 0.65,
      className: "flow-path-2"
    },
    {
      d: `M ${x1} ${height * 0.42} Q ${x2} ${height * 0.2} ${x3} ${height * 0.36} T ${x4} ${height * 0.4}`,
      strokeWidth: 1.6,
      opacity: 0.45,
      className: "flow-path-3"
    }
  ];
};

const REGION_META = buildRegionMeta(CAPITAL_ZONES);

const combineRegions = (zones: CapitalZone[]): Zone[] => {
  const grouped = new Map<string, { id: string; name: string; zones: CapitalZone[] }>();

  zones.forEach((zone) => {
    const entry = grouped.get(zone.regionId) || {
      id: zone.regionId,
      name: zone.regionName,
      zones: []
    };
    entry.zones.push(zone);
    grouped.set(zone.regionId, entry);
  });

  return Array.from(grouped.values()).map((region) => {
    let severity: Severity = "green";
    region.zones.forEach((zone) => {
      if (SEVERITY_RANK[zone.severity] > SEVERITY_RANK[severity]) {
        severity = zone.severity;
      }
    });

    const lat = region.zones.reduce((sum, zone) => sum + zone.lat, 0) / region.zones.length;
    const lng = region.zones.reduce((sum, zone) => sum + zone.lng, 0) / region.zones.length;
    const affectedTech = Array.from(new Set(region.zones.flatMap((zone) => zone.affectedTech))).slice(0, 6);
    const name = region.name;

    return {
      id: region.id,
      name,
      lat,
      lng,
      severity,
      affectedTech
    };
  });
};

const WORLD_ZONES: Zone[] = combineRegions(CAPITAL_ZONES);

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
  const mapRef = useRef<MapLibreMap | null>(null);

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
        const maplibregl = ((mod as MapLibreImport).default ?? mod) as MapLibreModule;
        const container = containerRef.current;
        if (!container) return;

        const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
        const camera = getCameraPreset();

        const map = new maplibregl.Map({
          container,
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
          const severityLabels: Record<Zone["severity"], string> = {
            red: "TORNADO SOLAR",
            orange: "TORMENTA ACTIVA",
            yellow: "KP ELEVADO",
            green: "SEÑAL ESTABLE"
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
            markerEl.setAttribute('data-hover', 'false');

            const color = colorMap[zone.severity] || '#00c896';
            const regionMeta = REGION_META[zone.id];
            const width = Math.round(regionMeta?.width ?? 180);
            const height = Math.round(regionMeta?.height ?? 140);
            const ellipses = getBlobEllipses(width, height, zone.id);
            const flows = getFlowPaths(width, height);
            const countryNames = regionMeta?.countryNames ?? [];
            const countryPreview = countryNames.slice(0, 3).join(", ");
            const remainingCount = Math.max(countryNames.length - 3, 0);
            const coverageLine = countryPreview
              ? `${countryPreview}${remainingCount > 0 ? ` +${remainingCount}` : ""}`
              : "Cobertura regional";
            const techPreview = zone.affectedTech.slice(0, 2).join(" • ");
            markerEl.style.setProperty('--storm-color', toRgb(color));
            markerEl.style.width = `${width}px`;
            markerEl.style.height = `${height}px`;

            markerEl.innerHTML = `
              <svg class="maplibre-zone-shape" viewBox="0 0 ${width} ${height}" fill="none" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="storm-core-${zone.id}" cx="38%" cy="32%">
                    <stop offset="0%" style="stop-color:rgb(var(--storm-color));stop-opacity:0.28" />
                    <stop offset="68%" style="stop-color:rgb(var(--storm-color));stop-opacity:0" />
                  </radialGradient>
                  <linearGradient id="flow-gradient-${zone.id}" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0" />
                    <stop offset="35%" stop-color="${color}" stop-opacity="0.88" />
                    <stop offset="70%" stop-color="${color}" stop-opacity="0.62" />
                    <stop offset="100%" stop-color="${color}" stop-opacity="0" />
                  </linearGradient>
                  <marker id="arrow-${zone.id}" markerWidth="12" markerHeight="10" refX="8" refY="3.5" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L8,3.5 L0,7 L2,3.5 Z" fill="${color}" />
                  </marker>
                </defs>

                <g class="maplibre-zone-blob">
                  ${ellipses.map((ellipse) => `
                    <ellipse
                      cx="${ellipse.cx}"
                      cy="${ellipse.cy}"
                      rx="${ellipse.rx}"
                      ry="${ellipse.ry}"
                      fill="url(#storm-core-${zone.id})"
                      opacity="${ellipse.opacity}"
                    />
                  `).join("")}
                </g>

                ${flows.map((flow) => `
                  <path
                    class="maplibre-flow-glow ${flow.className}"
                    d="${flow.d}"
                    stroke="url(#flow-gradient-${zone.id})"
                    stroke-width="${flow.strokeWidth + 2.2}"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    marker-end="url(#arrow-${zone.id})"
                    opacity="${flow.opacity * 0.35}"
                  />
                  <path
                    class="maplibre-flow-path ${flow.className}"
                    d="${flow.d}"
                    stroke="url(#flow-gradient-${zone.id})"
                    stroke-width="${flow.strokeWidth}"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    marker-end="url(#arrow-${zone.id})"
                    opacity="${flow.opacity}"
                  />
                `).join("")}
              </svg>
              <div class="maplibre-zone-hover">
                <div class="maplibre-zone-hover-top">
                  <div class="maplibre-zone-title">${zone.name}</div>
                  <div class="maplibre-zone-badge maplibre-zone-badge-${zone.severity}">
                    ${severityLabels[zone.severity] ?? "ALERTA"}
                  </div>
                </div>
                <div class="maplibre-zone-info">
                  <div class="maplibre-zone-subtitle"><span class="maplibre-zone-label">Cobertura</span> ${coverageLine}</div>
                  <div class="maplibre-zone-tech"><span class="maplibre-zone-label">Sistemas</span> ${techPreview}</div>
                </div>
              </div>
            `;

            markerEl.style.position = 'absolute';
            markerEl.style.left = '0';
            markerEl.style.top = '0';
            markerEl.style.transform = 'translate(-50%, -50%)';
            markerEl.style.cursor = 'pointer';
            markerEl.style.zIndex = '10';
            markerEl.style.pointerEvents = 'auto';

            const hoverCard = markerEl.querySelector<HTMLElement>('.maplibre-zone-hover');
            const setHoverState = (isHovering: boolean) => {
              markerEl.setAttribute('data-hover', isHovering ? 'true' : 'false');
              if (hoverCard) {
                hoverCard.style.opacity = isHovering ? '1' : '0';
                hoverCard.style.visibility = isHovering ? 'visible' : 'hidden';
                hoverCard.style.transform = isHovering
                  ? 'translate(-50%, 0) scale(1) perspective(900px) rotateX(0deg)'
                  : 'translate(-50%, 12px) scale(0.93) perspective(900px) rotateX(8deg)';
              }
            };

            setHoverState(false);
            markerEl.addEventListener('mouseenter', () => {
              setHoverState(true);
            });
            markerEl.addEventListener('mouseleave', () => {
              setHoverState(false);
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
            const markers = overlay.querySelectorAll<HTMLElement>('[data-lng][data-lat]');
            markers.forEach((marker) => {
              const lngAttr = marker.getAttribute('data-lng');
              const latAttr = marker.getAttribute('data-lat');
              if (!lngAttr || !latAttr) return;

              const lng = parseFloat(lngAttr);
              const lat = parseFloat(latAttr);
              if (Number.isNaN(lng) || Number.isNaN(lat)) return;
              
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
      
      } catch {
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
