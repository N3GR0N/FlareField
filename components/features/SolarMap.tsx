import dynamic from 'next/dynamic';
import React from 'react';

const useMapLibre = process.env.NEXT_PUBLIC_USE_MAPLIBRE === '1';

const SolarMapClient = dynamic(() => import('./SolarMap.client'), { ssr: false, loading: () => <div className="h-64">Cargando mapa...</div> });
const SolarMapMapLibre = dynamic(() => import('./SolarMap.maplibre.client'), { ssr: false, loading: () => <div className="h-64">Cargando mapa 3D...</div> });

export default function SolarMap(props: any) {
  if (useMapLibre) {
    // @ts-ignore
    return <SolarMapMapLibre {...props} />;
  }

  // @ts-ignore
  return <SolarMapClient {...props} />;
}