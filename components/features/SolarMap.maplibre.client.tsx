"use client";

import React, { useEffect, useRef } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { createRoot, type Root as ReactRoot } from "react-dom/client";
import { gsap } from "gsap";
import { Zone } from "@/types/solar";
import ZoneMarker from "@/components/ui/ZoneMarker";

type Severity = Zone["severity"];
type MapLibreModule = typeof import("maplibre-gl");
type MapLibreImport = MapLibreModule & { default?: MapLibreModule };

const SEVERITY_RANK: Record<Severity, number> = {
  green: 0,
  yellow: 1,
  orange: 2,
  red: 3
};

const SEVERITY_AREA_SIZE: Record<Severity, number> = {
  green: 30,
  yellow: 40,
  orange: 60,
  red: 90
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

  const ellipses: BlobEllipse[] = [];
  for (let i = 0; i < 5; i += 1) { // Generate more ellipses
    ellipses.push({
      cx: width * (0.4 + (rand() - 0.5) * 0.3), // More varied positions
      cy: height * (0.5 + (rand() - 0.5) * 0.3),
      rx: baseRx * (0.7 + rand() * 0.5), // More varied sizes
      ry: baseRy * (0.7 + rand() * 0.5),
      opacity: 0.1 + rand() * 0.2 // Varied opacity
    });
  }
  return ellipses;
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
  const markerRootsRef = useRef<ReactRoot[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    const preventContextMenu = (e: Event) => e.preventDefault();

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

        // Get theme-appropriate style URL
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const styleUrl = isDark
          ? 'https://api.maptiler.com/maps/streets-v2-dark/style.json?key=' + process.env.NEXT_PUBLIC_MAPTILER_API_KEY
          : 'https://api.maptiler.com/maps/dataviz/style.json?key=' + process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
        console.log('Tile URL:', styleUrl);
        
        const camera = getCameraPreset();

        markerRootsRef.current.forEach((root) => root.unmount());
        markerRootsRef.current = [];

        const map = new maplibregl.Map({
          container,
          style: styleUrl,
          center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
          zoom: camera.zoom,
          pitch: camera.pitch,
          bearing: camera.bearing,
          antialias: true,
          maxPitch: 0,
          minZoom: 2,
          maxZoom: 18,
          renderWorldCopies: true
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: false }), 'top-right');

        map.on('load', () => {
          // Force resize after a small delay to ensure dimensions are correct
          setTimeout(() => {
            map.resize();
            // Sync overlay after resize to fix alignment
            requestAnimationFrame(() => {
              if (mapRef.current) {
                // Trigger position update after map stabilization
              }
            });
          }, 150);

          // Apply initial map filter based on current theme
          const initialIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
          if (containerRef.current) {
            containerRef.current.style.filter = initialIsDark
              ? 'saturate(0.65) hue-rotate(40deg) brightness(0.85) contrast(1.02)'
              : 'saturate(0.75) hue-rotate(40deg) brightness(1.03) contrast(0.94)';
          }

          // Disable right-click drag rotation and touch rotation — 2D only
          map.dragRotate.disable();
          map.touchZoomRotate.disableRotation();
          map.dragPan.enable();
          map.scrollZoom.enable();
          map.doubleClickZoom.enable();

          // Prevent browser context menu on right-click over the map
          container.addEventListener('contextmenu', preventContextMenu);

          mapRef.current = map;
        });

        // Add markers using HTML overlay (more reliable than maplibregl.Marker)
        const addMarkersToOverlay = () => {
          const overlay = document.querySelector('.maplibre-markers-overlay');
          if (!overlay) return;

          // Clear any existing markers
          overlay.innerHTML = '';

          // Create zone markers
          WORLD_ZONES.forEach((zone) => {
            const markerEl = document.createElement('div');
            markerEl.className = 'maplibre-ripple-zone';
            markerEl.setAttribute('data-zone', zone.name);
            markerEl.setAttribute('data-severity', zone.severity);
            markerEl.setAttribute('data-lng', String(zone.lng));
            markerEl.setAttribute('data-lat', String(zone.lat));
            markerEl.setAttribute('data-hover', 'false');
            const markerSeverity = zone.severity === "orange" || zone.severity === "red" ? "alta" : "media";
            const severityLabel = zone.severity === "red"
              ? "TORNADO SOLAR"
              : zone.severity === "orange"
                ? "TORMENTA ACTIVA"
                : zone.severity === "yellow"
                  ? "KP ELEVADO"
                  : "SEÑAL ESTABLE";
            const regionMeta = REGION_META[zone.id];
            const countryNames = regionMeta?.countryNames ?? [];
            const countryPreview = countryNames.slice(0, 3).join(", ");
            const remainingCount = Math.max(countryNames.length - 3, 0);
            const coverageLine = countryPreview
              ? `${countryPreview}${remainingCount > 0 ? ` +${remainingCount}` : ""}`
              : "Cobertura regional";
            const techPreview = zone.affectedTech.slice(0, 2).join(" • ");

            markerEl.style.position = 'absolute';
            markerEl.style.left = '0';
            markerEl.style.top = '0';
            markerEl.style.transform = 'translate(-50%, -50%)';
            markerEl.style.overflow = 'visible';
            markerEl.style.cursor = 'pointer';
            markerEl.style.zIndex = '10';
            markerEl.style.pointerEvents = 'auto';

            const root = createRoot(markerEl);
            root.render(
              <ZoneMarker
                severity={markerSeverity}
                zoneName={zone.name}
                severityLabel={severityLabel}
                coverageLine={coverageLine}
                techPreview={techPreview}
                size={SEVERITY_AREA_SIZE[zone.severity]}
              />
            );
            markerRootsRef.current.push(root);

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
            userMarker.style.background = 'radial-gradient(circle, var(--accent-fill) 0%, var(--accent-bg) 70%)';
            userMarker.style.border = '2px solid white';
            userMarker.style.borderRadius = '50%';
            userMarker.style.zIndex = '5';
            userMarker.style.boxShadow = '0 0 12px rgba(201, 106, 42, 0.6)';
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
              
              // Project lng/lat to pixel coordinates (correct order for MapLibre)
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
          map.on('render', updateMarkerPositions);
        };

        // Wait for map to be ready then add markers
        if (map.loaded()) {
          addMarkersToOverlay();
        } else {
          map.once('idle', addMarkersToOverlay);
        }

        // Theme change handler
        const handleThemeChange = () => {
          if (!map || !map.loaded()) return;
          console.log('OBSERVER FIRED - data-theme:', document.documentElement.getAttribute('data-theme'));
          const newIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
          console.log('UPDATING MAP STYLE to:', newIsDark ? 'dark' : 'light');
          const newStyleUrl = newIsDark
            ? 'https://api.maptiler.com/maps/streets-v2-dark/style.json?key=' + process.env.NEXT_PUBLIC_MAPTILER_API_KEY
            : 'https://api.maptiler.com/maps/dataviz/style.json?key=' + process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
          
          if (map && map.getStyle && map.getStyle()) {
            map.setStyle(newStyleUrl);
          }

          // Update map container CSS filter for palette shift
          if (containerRef.current) {
            containerRef.current.style.filter = newIsDark
              ? 'saturate(0.65) hue-rotate(40deg) brightness(0.85) contrast(1.02)'
              : 'saturate(0.75) hue-rotate(40deg) brightness(1.03) contrast(0.94)';
          }
        };

        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      
      } catch {
        // maplibre not installed or failed to load — warn but don't throw
        // console.warn('MapLibre not loaded:', err);
      }
    })();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.removeEventListener('contextmenu', preventContextMenu);
      }
      if (mapRef.current) {
        const overlay = document.querySelector('.maplibre-markers-overlay');
        overlay?.replaceChildren();
      }
      markerRootsRef.current.forEach((root) => {
        queueMicrotask(() => {
          root.unmount();
        });
      });
      markerRootsRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [containerRef, userLocation]);

  // GSAP pulse animation for zone area markers
  const gsapCtxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const overlay = document.querySelector('.maplibre-markers-overlay');
    if (!overlay) return;

    const observer = new MutationObserver(() => {
      const areas = overlay.querySelectorAll('.zone-ripple-area');
      if (areas.length === 0) return;
      observer.disconnect();

      gsapCtxRef.current?.kill();
      gsapCtxRef.current = gsap.context(() => {
        areas.forEach((el) => {
          gsap.fromTo(el,
            { scale: 1, opacity: 0.5 },
            {
              scale: 1.15,
              opacity: 0.8,
              duration: 2.5,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: gsap.utils.random(0, 1.5),
            }
          );
        });
      }, overlay);
    });

    observer.observe(overlay, { childList: true, subtree: true });

    // Check if zones already exist
    const existing = overlay.querySelectorAll('.zone-ripple-area');
    if (existing.length > 0) {
      observer.disconnect();
      gsapCtxRef.current?.kill();
      gsapCtxRef.current = gsap.context(() => {
        existing.forEach((el) => {
          gsap.fromTo(el,
            { scale: 1, opacity: 0.5 },
            {
              scale: 1.15,
              opacity: 0.8,
              duration: 2.5,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: gsap.utils.random(0, 1.5),
            }
          );
        });
      }, overlay);
    }

    return () => {
      observer.disconnect();
      gsapCtxRef.current?.kill();
      gsapCtxRef.current = null;
    };
  }, []);

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
          height: '100%',
          filter: 'saturate(0.65) hue-rotate(40deg) brightness(0.85) contrast(1.02)',
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
          zIndex: 2,
          overflow: 'visible'
        }}
      />


      
    </div>
  );
}
