import { NextResponse } from 'next/server';

// funcion para obtener los datos de la nasa
export async function GET() {
  try {
    // agrego la api key
    const apiKey = process.env.NASA_API_KEY;

    // chequeo integridad de api key, si no esta presente avisamos
    if(!apiKey) {
        return NextResponse.json({ error: 'API key de NASA no encontrada' }, { status: 500 });
    }
  
    //pedimos datos especificos a la nasa (CME)
    const response = await fetch(
      `https://api.nasa.gov/DONKI/CME?startDate=2026-04-01&api_key=${apiKey}`
    );

    //chequeamos integridad de la respuesta, si no es ok avisamos
    if (!response.ok) {
      return NextResponse.json({ error: 'Error al obtener datos de la NASA' }, { status: response.status });
    }

    // convertimos la respuesta a json
    const data = await response.json();

    //verificamos q el formato de la respuesta sea completo, si no lo es avisamos
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Formato de datos inesperado de la NASA' }, { status: 500 });
    }

    // formateamos la respuesta a nuestro gusto para legibilidad 
    const simpleEvents = data.map((event: any) => {
        return{
            id: event.activityID,
            date: event.startTime,
            type: "Tormenta Solar",
            //mensaje de prueba por ahora 
            message: "Evento CME detectado."
        };
    });

    return NextResponse.json({
        actual_state: "Alerta moderada",
        events: simpleEvents
    });

  } catch (error) {
    // Si algo sale mal  avisamos
    const message = 
      error instanceof Error ? error.message : 'Error desconocido al obtener datos de la NASA';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}