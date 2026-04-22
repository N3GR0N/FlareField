"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Button from "@/components/ui/Button";

type SolarEvent = {
  id: string;
  date: string;
  type: string;
  message: string;
};

type SolarResponse = {
  actual_state: string;
  events: SolarEvent[];
};

function mapTone(state: string): "calm" | "watch" | "alert" | "critical" {
  const v = state.toLowerCase();
  if (v.includes("cr")) return "critical";
  if (v.includes("alerta")) return "alert";
  if (v.includes("moder")) return "watch";
  return "calm";
}

export default function DashboardPage() {
  const [data, setData] = useState<SolarResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/solar")
      .then((res) => res.json())
      .then((json: SolarResponse) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <TopNav />

      <div className="mx-auto flex max-w-6xl">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl">Panorama Solar</h1>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Monitoreo editorial de actividad y eventos recientes.
              </p>
            </div>
            <Button variant="secondary">Actualizar</Button>
          </div>

          {loading ? (
            <p className="text-sm text-[var(--color-text-muted)] [font-family:var(--font-mono)]">
              Sincronizando con DONKI...
            </p>
          ) : (
            <section className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] [font-family:var(--font-label)]">
                  Estado Actual
                </p>
                <div className="flex items-center gap-3">
                  <StatusChip
                    label={data?.actual_state ?? "Sin datos"}
                    tone={mapTone(data?.actual_state ?? "")}
                  />
                </div>
              </Card>

              <Card className="p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] [font-family:var(--font-label)]">
                  Próximo Módulo
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Forecast 7 días y mapa solar se integran en el siguiente bloque.
                </p>
              </Card>

              <Card className="p-4 md:col-span-2">
                <p className="mb-3 text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] [font-family:var(--font-label)]">
                  Eventos Recientes
                </p>
                <div className="space-y-2">
                  {(data?.events ?? []).slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-[0.5rem] border border-[var(--color-border)] bg-[var(--color-surface-low)] p-3"
                    >
                      <p className="text-sm">{event.message}</p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)] [font-family:var(--font-mono)]">
                        {new Date(event.date).toLocaleString("es-AR")}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}