# FlareField 🌞

> Traducimos datos de clima espacial en alertas comprensibles para personas comunes.

FlareField es un sistema web que monitorea la actividad solar y avisa cuándo una tormenta geomagnética puede afectar tu GPS, tus drones, tus antenas, tu señal satelital o tus cultivos. Incluye historial personalizado que cruza los reportes del usuario con eventos reales registrados por NASA y NOAA.

---

## ¿Por qué existe FlareField?

En mayo de 2024, una tormenta geomagnética dejó tractores John Deere parados en plena temporada de siembra en Nebraska y Dakota del Sur. Los GPS fallaron. Los agricultores perdieron días enteros de trabajo. John Deere tuvo que emitir alertas de emergencia.

Las agencias como NOAA y NASA publican estos datos en tiempo real, pero están escritos para ingenieros aeroespaciales y físicos. Nadie los tradujo para el productor agropecuario, el técnico de drones o el encargado de antenas rurales.

**FlareField cierra esa brecha.**

---

## Funcionalidades principales

- **Clima espacial actual y forecast semanal** — estilo app del clima, con íconos y colores (verde/amarillo/naranja/rojo), sin números técnicos
- **Alertas por tecnología** — GPS de precisión, drones, antenas satelitales, WiFi satelital (Starlink), TV satelital
- **Historial personalizado** — el usuario registra sus propios reportes ("mi GPS falló hoy") y el sistema los cruza con eventos solares reales de ese día
- **Notificaciones por email** — aviso anticipado cuando se acerca un evento moderado o fuerte
- **Glosario en lenguaje simple** — qué es el índice Kp, una llamarada clase X, una CME, explicado sin fórmulas

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend + Hosting | Next.js + Vercel |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Datos solares | DONKI (NASA) + NOAA SWPC |
| Notificaciones | Resend |
| Monitoreo uptime | UptimeRobot |

Todo el stack es **gratuito** en su tier inicial. Sin tarjeta de crédito, sin costos fijos.

---

## Fuentes de datos

- **[NASA DONKI](https://api.nasa.gov)** — eventos de clima espacial en tiempo real e históricos (llamaradas, CMEs, tormentas geomagnéticas). Requiere API key gratuita.
- **[NOAA SWPC](https://services.swpc.noaa.gov)** — índice Kp, forecasts, alertas. Sin key, completamente libre.

---

## Estructura de base de datos

```
users          → manejada por Supabase Auth
user_devices   → tecnologías registradas por el usuario (GPS, dron, antena, etc.)
user_location  → ubicación del usuario (lat/lng o región)
user_reports   → reportes manuales (fecha, dispositivo, descripción, foto opcional)
solar_events   → caché local de eventos DONKI para historial
```

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública con estado solar actual |
| `/dashboard` | Panel principal con forecast y resumen personal |
| `/zona` | Vista contextualizada según la ubicación del usuario |
| `/reportes` | Historial personal cruzado con eventos solares |
| `/perfil` | Configuración, dispositivos, preferencias de notificaciones |
| `/glosario` | Explicación en lenguaje simple de los términos técnicos |

---

## Fuera del alcance — v1

- App móvil nativa (la web responsive cubre este caso)
- Mapa interactivo complejo
- Predicciones propias (se usan las de NOAA)
- Notificaciones push del navegador
- Comparación entre usuarios o datos comunitarios

---

## Roadmap

- **Mes 1** — Aprendizaje Next.js + React · Supabase configurado · Primera llamada a DONKI
- **Mes 2** — Motor de traducción: mapeo de valores Kp/flujo solar a alertas por tecnología
- **Mes 3+** — Interfaz · Sistema de reportes · Historial cruzado · Notificaciones
- **Agosto/Septiembre 2025** — v1 funcional y deployada

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/flarefield.git
cd flarefield

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Completar con tus keys de NASA DONKI, Supabase y Resend

# Correr en desarrollo
npm run dev
```

---

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NASA_DONKI_API_KEY=
RESEND_API_KEY=
```

---

## Autor

Proyecto personal en desarrollo — Estudiante de Informática, UNLP.

---

> *"Flare" por llamarada solar. "Field" por campo agrícola y campo electromagnético.*