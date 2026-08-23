# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Personas del campo en Argentina que necesitan saber si su tecnología va a fallar por actividad solar: operadores de drones agrícolas, usuarios de GPS, hogares y escuelas con internet satelital. Consultan antes y durante la jornada de trabajo/trabajo escolar, desde zonas con conectividad intermitente. Audiencia secundaria explícita: escuelas rurales que dependen de conectividad satelital para clases y administración.

## Product Purpose

FlareField traduce datos oficiales de clima espacial (llamaradas solares, tormentas geomagnéticas, índice Kp) a un estado claro y accionable en lenguaje llano: estable, elevado o crítico. Existe porque las fuentes oficiales (NASA DONKI, NOAA) son técnicas y nadie las traduce al impacto concreto sobre equipos rurales. Éxito: una persona del campo abre FlareField y en segundos sabe si puede volar un dron, confiar en el GPS o planificar clases online.

## Positioning

Guía operativa de clima espacial para trabajo rural: datos oficiales de NASA/NOAA convertidos a decisiones ("no vueles hoy", "descargá backup antes de la tormenta"). Un dashboard técnico o una app de auroras no puede copiar esta promesa: su público es experto o recreativo, no operativo rural.

## Operating Context

- Rural Argentina; conexiones satelitales lentas e intermitentes. **Rendir bien en red lenta es requisito duro de diseño** (presupuesto agresivo de peso/red).
- Uso en el campo: consulta rápida previa a operar drones/GPS, y planificación de jornadas escolares/laborales.
- Idioma: español rioplatense con voseo (Descargá, Planificá, Entendé).

## Capabilities and Constraints

- Datos en vivo: índice Kp (NOAA) + llamaradas solares y tormentas geomagnéticas (NASA DONKI), vía proxy interno `app/api/solar/route.ts`.
- Sin clave propia usa `DEMO_KEY` (rate-limited); producción requiere env var `NASA_API_KEY`.
- Mapa con doble implementación seleccionable por env (`NEXT_PUBLIC_USE_MAPLIBRE=1` → MapLibre GL; default Leaflet).
- Stack existente: Next.js 16 App Router + React 19 + Tailwind v4.
- **Bilingüe a futuro**: hoy español-only, pero hay intención declarada de agregar inglés más adelante — el copy debe mantenerse i18n-friendly (longitudes tolerantes, strings centralizables).
- Indecidido (no inventar): notificaciones/alertas push, cuentas de usuario, histórico de datos.

## Brand Commitments

- Nombre: **FlareField** (wordmark fijo en Cormorant Garamond — compromiso visual vinculante decidido 2026-08-23; detalle tipográfico completo en DESIGN.md).
- Tono: directo, cercano, sin tecnicismos innecesarios; explica el riesgo en términos del equipo que se puede romper.

## Evidence on Hand

- Contenido propio: glosario de 8 términos con ejemplos de impacto rural real (`app/glossary/page.tsx`).
- Datos reales en vivo vía APIs públicas NASA/NOAA.
- No existen testimonios, casos de estudio, prensa ni métricas propias: ningún trabajo futuro debe fabricarlos.

## Product Principles

1. **Advertencia accionable antes que precisión técnica**: si un dato no cambia una decisión de campo, no protagoniza la UI.
2. **Confiable en el campo**: cada kilobyte se justifica; la página debe ser útil en una conexión mala.
3. **Datos oficiales, cero invención**: toda afirmación es atribuible a NASA/NOAA; los valores ilustrativos se etiquetan como tales.
4. **Español del campo argentino**: voseo natural, sin jerga técnica sin traducir; preparado para crecer a bilingüe.

## Accessibility & Inclusion

`prefers-reduced-motion` ya está respetado en el código (animaciones desactivadas). Sin estándar WCAG formal exigido por el producto; contraste y targets táctiles deben sostenerse en iteraciones (uso móvil en exterior, luz solar).
