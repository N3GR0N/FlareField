import dynamic from 'next/dynamic';

const useMapLibre = process.env.NEXT_PUBLIC_USE_MAPLIBRE === '1';

const loadingShell = (
  <div className="flex h-[calc(100vh-4rem)] w-full items-end rounded-[28px] border border-white/10 nrg-map-base p-5">
    <div className="max-w-xs rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80 backdrop-blur-xl nrg-hud">
      Cargando mapa...
    </div>
  </div>
);

type SolarMapProps = {
  userLocation: { lat: number; lng: number; name: string } | null;
};

const SolarMapClient = dynamic<SolarMapProps>(() => import('./SolarMap.client'), { ssr: false, loading: () => loadingShell });
const SolarMapMapLibre = dynamic<SolarMapProps>(() => import('./SolarMap.maplibre.client'), { ssr: false, loading: () => loadingShell });

export default function SolarMap(props: SolarMapProps) {
  if (useMapLibre) {
    return <SolarMapMapLibre {...props} />;
  }

  return <SolarMapClient {...props} />;
}
