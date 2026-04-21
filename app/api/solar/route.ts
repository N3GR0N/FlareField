import { NextResponse } from 'next/server';

// funcion para obtener los datos de la nasa
export async function GET() {
  try {
    // agrego la api key
    const apiKey = process.env.NASA_API_KEY;

    // vamos a experimentar con la api publica mientras se activa la mia
    const response = await fetch(
    `https://api.nasa.gov/DONKI/CME?startDate=2026-04-01&api_key=DEMO_KEY`
    );

    // pedimos datos especificos a la nasa (CME)
    //const response = await fetch(
    //  `https://api.nasa.gov/DONKI/CME?startDate=2026-04-01&api_key=${apiKey}`
    //);


    // convertimos la respuesta a json
    const data = await response.json();

    // formateamos la respuesta a nuestro gusto para legibilidad 
    const SimpleEvents = data.map((event: any) => {
        return{
            id: event.activityID,
            date: event.startTime,
            type: "Tormenta Solar",
            //mensaje de prueba por ahora 
            message: "se detecto tormenta solar la presicion del gps va a variar."
        };
    });

    return NextResponse.json({
        actual_state: "Alerta moderada",
        events: SimpleEvents
    });

  } catch (error) {
    // Si algo sale mal  avisamos
    return NextResponse.json({ error: 'Error al conectar con la NASA' }, { status: 500 });
  }
}