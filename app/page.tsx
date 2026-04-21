'use client'; 

import { useEffect, useState } from 'react';

export default function Home() {
  // Estado para guardar la respuesta de tu API
  const [datosSolar, setDatosSolar] = useState<any>(null);

  useEffect(() => {
    // Llamamos a tu ruta /api/solar
    fetch('/api/solar')
      .then((res) => res.json())
      .then((data) => {
        setDatosSolar(data);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#0a0a0a] text-[#ececec]">
      <h1 className="text-4xl font-serif mb-4 text-[#f5f5f0]">FlareField</h1>
      
      <div className="max-w-md w-full p-8 border border-stone-800 bg-stone-900/30 rounded-sm">
        <h2 className="text-sm font-mono uppercase tracking-widest text-stone-500 mb-6">
          Estado del Clima Espacial
        </h2>

        {datosSolar ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              {/* Ajustado a 'actual_state' como pusiste en el route.ts */}
              <p className="text-xl font-sans">{datosSolar.actual_state}</p>
            </div>
            
            <p className="text-stone-400 font-serif italic border-l border-stone-700 pl-4">
              {/* Ajustado a 'events' y 'message' */}
              "{datosSolar.events[0]?.message || 'Sin eventos recientes registrados.'}"
            </p>
          </div>
        ) : (
          <p className="animate-pulse font-mono text-stone-600">Sincronizando con DONKI...</p>
        )}
      </div>

      <p className="mt-12 text-xs font-mono text-stone-600 uppercase tracking-tighter">
        Datos provistos por NASA DONKI & NOAA
      </p>
    </main>
  );
}