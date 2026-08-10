import dynamic from 'next/dynamic';

const loadingShell = (
  <div className="flex h-[calc(100vh-3rem)] w-full items-end rounded-b-[28px] border nrg-map-base p-5" style={{ borderColor: "var(--md-sys-color-outline-variant)" }}>
    <div className="max-w-xs px-4 py-3 text-sm" style={{ background: "var(--md-sys-color-surface-container-low)", borderRadius: "12px", boxShadow: "var(--shadow-soft)", color: "var(--md-sys-color-on-surface)" }}>
      Cargando mapa...
    </div>
  </div>
);

type SolarMapProps = {
  userLocation: { lat: number; lng: number; name: string } | null;
};

const SolarMapMapLibre = dynamic<SolarMapProps>(() => import('./SolarMap.maplibre.client'), { ssr: false, loading: () => loadingShell });

export default function SolarMap(props: SolarMapProps) {
  return <SolarMapMapLibre {...props} />;
}
