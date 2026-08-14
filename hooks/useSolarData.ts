"use client";

import { useCallback, useEffect, useState } from "react";
import type { SolarData } from "@/types/solar";

export type SeverityLevel = "stable" | "elevated" | "active" | "critical";

const REFRESH_MS = 5 * 60 * 1000;

export const CONDITION_LABELS: Record<SeverityLevel, string> = {
  stable: "SEÑAL ESTABLE",
  elevated: "KP ELEVADO",
  active: "TORMENTA ACTIVA",
  critical: "TORMENTA CRÍTICA",
};

export const SEVERITY_DOT_COLORS: Record<SeverityLevel, string> = {
  stable: "var(--zone-c-green)",
  elevated: "var(--zone-c-yellow)",
  active: "var(--zone-c-orange)",
  critical: "var(--zone-c-red)",
};

export function severityFromKp(kp: number | null | undefined): SeverityLevel {
  if (!kp) return "stable";
  if (kp <= 3) return "stable";
  if (kp <= 5) return "elevated";
  if (kp <= 7) return "active";
  return "critical";
}

export function isDemoData(data: SolarData | null): boolean {
  if (!data) return true;
  if (data.isMock) return true;
  return [...data.flares, ...data.storms].some((e) => e.source.includes("Mock"));
}

export type ActiveEvent = {
  type: string;
  class: string;
  timestamp: string;
  source: string;
  severity: SeverityLevel;
};

function flareSeverity(cls: string): SeverityLevel {
  if (cls.startsWith("X")) return "critical";
  if (cls.startsWith("M")) return "active";
  if (cls.startsWith("C")) return "elevated";
  return "stable";
}

function stormSeverity(cls: string): SeverityLevel {
  if (cls.startsWith("G4") || cls.startsWith("G5")) return "critical";
  if (cls.startsWith("G3")) return "active";
  if (cls.startsWith("G1") || cls.startsWith("G2")) return "elevated";
  return "stable";
}

const SEVERITY_RANK: Record<SeverityLevel, number> = {
  stable: 0,
  elevated: 1,
  active: 2,
  critical: 3,
};

export function selectActiveEvent(data: SolarData | null): ActiveEvent | null {
  if (!data) return null;

  const bestFlare = data.flares.reduce<ActiveEvent | null>((best, flare) => {
    const candidate: ActiveEvent = {
      type: "Tormenta Solar",
      class: flare.class,
      timestamp: flare.peakTime,
      source: flare.source,
      severity: flareSeverity(flare.class),
    };
    return !best || SEVERITY_RANK[candidate.severity] >= SEVERITY_RANK[best.severity]
      ? candidate
      : best;
  }, null);

  const bestStorm = data.storms.reduce<ActiveEvent | null>((best, storm) => {
    const candidate: ActiveEvent = {
      type: "Tormenta Geomagnética",
      class: storm.class,
      timestamp: storm.onsetTime,
      source: storm.source,
      severity: stormSeverity(storm.class),
    };
    return !best || SEVERITY_RANK[candidate.severity] >= SEVERITY_RANK[best.severity]
      ? candidate
      : best;
  }, null);

  if (!bestFlare) return bestStorm;
  if (!bestStorm) return bestFlare;
  return SEVERITY_RANK[bestFlare.severity] >= SEVERITY_RANK[bestStorm.severity]
    ? bestFlare
    : bestStorm;
}

export function useSolarData(refreshMs = REFRESH_MS) {
  const [data, setData] = useState<SolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolar = useCallback(async (): Promise<{ data: SolarData | null; error: string | null }> => {
    try {
      const res = await fetch("/api/solar");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as SolarData;
      return { data: json, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Error de red" };
    }
  }, []);

  useEffect(() => {
    void fetchSolar().then(({ data: nextData, error: nextError }) => {
      setData(nextData);
      setError(nextError);
      setLoading(false);
    });
    const id = setInterval(() => {
      void fetchSolar().then(({ data: nextData, error: nextError }) => {
        setData(nextData);
        setError(nextError);
      });
    }, refreshMs);
    return () => clearInterval(id);
  }, [fetchSolar, refreshMs]);

  const refetch = useCallback(() => {
    setLoading(true);
    void fetchSolar().then(({ data: nextData, error: nextError }) => {
      setData(nextData);
      setError(nextError);
      setLoading(false);
    });
  }, [fetchSolar]);

  return { data, loading, error, refetch };
}