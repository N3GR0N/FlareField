export type KpLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type KpData = {
    current: KpLevel;
    timestamp: Date;
    forecast3h: KpLevel;
    forecast12h: KpLevel;
};

export type FlareClass = "A" | "B" | "C" | "M" | "X";

export type SolarFlare = {
  id: string;
  class: FlareClass;
  time: Date;
  location: { x: number; y: number }; // posición en el disco
  region: string; // región activa
};

// Datos para pronósticos
export type ForecastDay = {
  date: Date;
  kpMin: KpLevel;
  kpMax: KpLevel;
  probability: number; // 0-100 porcentaje
  warning?: "calm" | "watch" | "alert" | "critical";
};

// Reporte diario/semanal
export type SolarReport = {
  id: string;
  period: "daily" | "weekly";
  date: Date;
  summary: string;
  kpIndex: KpData;
  flares: SolarFlare[];
  forecast: ForecastDay[];
};