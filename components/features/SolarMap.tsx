import dynamic from 'next/dynamic';
import React from 'react';

const useMapLibre = process.env.NEXT_PUBLIC_USE_MAPLIBRE === '1';

const loadingShell = (
  <div className="flex h-[calc(100vh-4rem)] w-full items-end rounded-[28px] border border-white/8 maplibre-dark-shell p-5">
    <div className="max-w-xs rounded-2xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-white/80 backdrop-blur-xl">
      Cargando mapa 3D...
    </div>
  </div>
);

const SolarMapClient = dynamic(() => import('./SolarMap.client'), { ssr: false, loading: () => loadingShell });
const SolarMapMapLibre = dynamic(() => import('./SolarMap.maplibre.client'), { ssr: false, loading: () => loadingShell });

export default function SolarMap(props: any) {
  if (useMapLibre) {
    // @ts-ignore
    return <SolarMapMapLibre {...props} />;
  }

  // @ts-ignore
  return <SolarMapClient {...props} />;
}