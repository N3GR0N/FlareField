export interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: 'green' | 'yellow' | 'orange' | 'red';
  affectedTech: string[];
}

export interface SolarFlare {
  id: string;
  class: string; // e.g., 'X1.2'
  peakTime: string; // ISO string
  source: string; // e.g., 'NASA DONKI API'
}

export interface GeomagneticStorm {
  id: string;
  class: string; // e.g., 'G2'
  onsetTime: string; // ISO string
  source: string; // e.g., 'NASA DONKI API'
}

export interface KpIndex {
  kp: number;
  time_tag: string; // ISO string
  severity: 'green' | 'yellow' | 'orange' | 'red';
}

export interface SolarData {
  zones: Zone[];
  flares: SolarFlare[];
  storms: GeomagneticStorm[];
  kpIndex: KpIndex | null;
  lastUpdated: string;
}