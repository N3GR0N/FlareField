"use client";

import { KpData, KpLevel, SolarFlare, ForecastDay, SolarReport } from "@/types/solar";
import { useEffect, useMemo, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import KpIndex from "@/components/features/KpIndex";
import SolarMap from "@/components/features/SolarMap";
import ReportCard from "@/components/features/ReportCard";
import StatusChip from "@/components/ui/StatusChip";
import { useI18n } from "@/src/i18n/useI18n";

type SolarApiEvent = {
  id: string;
  date: string;
  type: string;
  message: string;
};

type SolarApiResponse = {
  actual_state: string;
  events: SolarApiEvent[];
};

type TabType = "today" | "tomorrow" | "week";
type ViewType = "list" | "map";

const forecastSeed: Array<{
  kpMin: KpLevel;
  kpMax: KpLevel;
  probability: number;
  warning: ForecastDay["warning"];
}> = [
  { kpMin: 3, kpMax: 5, probability: 58, warning: "watch" },
  { kpMin: 2, kpMax: 4, probability: 44, warning: "watch" },
  { kpMin: 4, kpMax: 6, probability: 67, warning: "alert" },
  { kpMin: 1, kpMax: 3, probability: 29, warning: "calm" },
  { kpMin: 5, kpMax: 7, probability: 78, warning: "critical" },
  { kpMin: 2, kpMax: 5, probability: 51, warning: "watch" },
  { kpMin: 0, kpMax: 2, probability: 18, warning: "calm" },
  { kpMin: 3, kpMax: 6, probability: 63, warning: "alert" },
  { kpMin: 4, kpMax: 7, probability: 74, warning: "critical" },
];

function formatDay(date: Date): string {
  return date.toLocaleDateString("es-ES", { weekday: "short" });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

function toneFromKp(kp: number): "calm" | "watch" | "alert" | "critical" {
  if (kp <= 2) return "calm";
  if (kp <= 4) return "watch";
  if (kp <= 6) return "alert";
  return "critical";
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [selectedTab, setSelectedTab] = useState<TabType>("today");
  const [viewMode, setViewMode] = useState<ViewType>("map");
  const [liveData, setLiveData] = useState<SolarApiResponse | null>(null);
  const [isLoadingLiveData, setIsLoadingLiveData] = useState(true);

  const mockData = useMemo(() => {
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const kpData: KpData = {
      current: 5,
      timestamp: new Date(baseDate),
      forecast3h: 6,
      forecast12h: 4,
    };

    const flares: SolarFlare[] = [
      {
        id: "flare-001",
        class: "M",
        time: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000),
        location: { x: 30, y: 20 },
        region: "AR3087",
      },
      {
        id: "flare-002",
        class: "C",
        time: new Date(baseDate.getTime() - 6 * 60 * 60 * 1000),
        location: { x: -40, y: 10 },
        region: "AR3088",
      },
      {
        id: "flare-003",
        class: "X",
        time: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000),
        location: { x: 5, y: -35 },
        region: "AR3089",
      },
    ];

    const forecast: ForecastDay[] = forecastSeed.map((item, index) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + index);
      return {
        date,
        kpMin: item.kpMin,
        kpMax: item.kpMax,
        probability: item.probability,
        warning: item.warning,
      };
    });

    return { baseDate, kpData, flares, forecast };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadLiveData = async () => {
      try {
        setIsLoadingLiveData(true);
        const response = await fetch("/api/solar", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as SolarApiResponse;
        if (isMounted) {
          setLiveData(data);
        }
      } catch {
        // Keep fallback behavior stable.
      } finally {
        if (isMounted) {
          setIsLoadingLiveData(false);
        }
      }
    };

    loadLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  const reportSummary = useMemo(() => {
    const events = liveData?.events ?? [];
    if (events.length === 0) {
      return "Actividad solar moderada con posibles impactos de comunicación en latitudes altas.";
    }

    const latest = events[0];
    return `Estado actual: ${liveData?.actual_state ?? "Monitoreo"}. Último evento ${latest.type.toLowerCase()} el ${new Date(latest.date).toLocaleDateString("es-ES")}.`;
  }, [liveData]);

  const reportDate = useMemo(() => {
    const latestDate = liveData?.events?.[0]?.date;
    return latestDate ? new Date(latestDate) : new Date(mockData.baseDate);
  }, [liveData, mockData.baseDate]);

  const dashboardReport: SolarReport = useMemo(
    () => ({
      id: "report-today",
      period: "daily",
      date: reportDate,
      summary: reportSummary,
      kpIndex: mockData.kpData,
      flares: mockData.flares,
      forecast: mockData.forecast,
    }),
    [mockData, reportDate, reportSummary]
  );

  const weeklyReport: SolarReport = useMemo(
    () => ({
      ...dashboardReport,
      id: "report-weekly",
      period: "weekly",
      summary: "Resumen semanal: ventanas de mayor riesgo geomagnético entre miércoles y viernes.",
    }),
    [dashboardReport]
  );

  const tabForecast = useMemo(() => {
    if (selectedTab === "today") return mockData.forecast.slice(0, 6);
    if (selectedTab === "tomorrow") return mockData.forecast.slice(1, 7);
    return mockData.forecast.slice(0, 6);
  }, [selectedTab, mockData.forecast]);

  const subtitleDate = useMemo(
    () =>
      new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <TopNav />
      <Sidebar />

      <main className="pl-0 pt-16 md:pl-64">
        <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8 py-6 space-y-6">
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-[32px] leading-tight font-normal [font-family:var(--font-display)]">
                  {t("dashboard.title")}
                </h1>
                <p className="text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[#8A7E78] mt-1">
                  {subtitleDate}
                </p>
              </div>
              <StatusChip
                tone={toneFromKp(mockData.kpData.current)}
                label={isLoadingLiveData ? t("dashboard.syncing") : (liveData?.actual_state ?? t("dashboard.local_mode"))}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-card)] pb-3">
              <div className="flex items-center gap-2">
                {([
                  ["today", t("dashboard.today")],
                  ["tomorrow", t("dashboard.tomorrow")],
                  ["week", t("dashboard.next_7_days")],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setSelectedTab(value)}
                    className={`px-3 py-2 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] border rounded-[var(--radius)] transition-colors ${
                      selectedTab === value
                        ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--surface-container)]"
                        : "border-[var(--border-card)] text-[#8A7E78] bg-[var(--surface-container-low)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="inline-flex rounded-[var(--radius)] border border-[var(--border-card)] overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] ${
                    viewMode === "list" ? "bg-[var(--surface-container)] text-[var(--primary)]" : "bg-[var(--surface-container-low)] text-[#8A7E78]"
                  }`}
                >
                  {t("dashboard.list")}
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-2 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] border-l border-[var(--border-card)] ${
                    viewMode === "map" ? "bg-[var(--surface-container)] text-[var(--primary)]" : "bg-[var(--surface-container-low)] text-[#8A7E78]"
                  }`}
                >
                  {t("dashboard.map")}
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {tabForecast.map((day, idx) => (
              <article
                key={day.date.toISOString()}
                className={`border rounded-[var(--radius-lg)] bg-[#FDFAF5] border-[var(--border-card)] p-4 ${
                  idx === 0 ? "md:col-span-2 border-l-4 border-l-[#C4612A]" : "md:col-span-1"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[#8A7E78]">
                  {idx === 0 ? t("dashboard.today") : formatDay(day.date)}
                </p>
                <p className="mt-1 text-[13px] text-[var(--on-surface-variant)]">{formatDate(day.date)}</p>
                <p className="mt-4 text-[24px] leading-none [font-family:var(--font-mono)] text-[var(--primary)]">
                  {day.kpMin}-{day.kpMax}
                </p>
                <p className="mt-2 text-xs [font-family:var(--font-mono)] text-[var(--on-surface-variant)]">
                  {t("dashboard.probability")} {day.probability}%
                </p>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="border rounded-[var(--radius-lg)] bg-[#FDFAF5] border-[var(--border-card)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[#8A7E78]">
                    {t("dashboard.world_map")}
                  </p>
                  <div className="inline-flex items-center gap-2">
                    <button className="h-7 w-7 rounded-[var(--radius-sm)] border border-[var(--border-card)] bg-[var(--surface-container-low)] text-[var(--on-surface-variant)]">
                      +
                    </button>
                    <button className="h-7 w-7 rounded-[var(--radius-sm)] border border-[var(--border-card)] bg-[var(--surface-container-low)] text-[var(--on-surface-variant)]">
                      -
                    </button>
                  </div>
                </div>
                <SolarMap flares={mockData.flares} />
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="border rounded-[var(--radius-lg)] bg-[#FDFAF5] border-[var(--border-card)] p-4">
                <KpIndex data={mockData.kpData} />
              </div>

              <div className="space-y-4">
                <div className="border rounded-[var(--radius-lg)] bg-[#FDFAF5] border-[var(--border-card)] border-l-4 border-l-[var(--tertiary)] p-4">
                  <ReportCard report={dashboardReport} />
                </div>
                <div className="border rounded-[var(--radius-lg)] bg-[#FDFAF5] border-[var(--border-card)] border-l-4 border-l-[var(--primary)] p-4">
                  <ReportCard report={weeklyReport} />
                </div>
              </div>
            </aside>
          </section>

          <footer className="pt-2 pb-6 text-center text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[#8A7E78]">
            {t("dashboard.footer")}
          </footer>
        </div>
      </main>
    </div>
  );
}
