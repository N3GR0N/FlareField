---
name: FlareField
description: Guía operativa de clima espacial para el campo argentino
colors:
  midnight: "#181C22"
  graphite: "#222831"
  space-gray: "#393E46"
  titanium: "#484E58"
  starlight: "#F2EDE4"
  silver-fog: "#A8A29A"
  aluminum: "#948F88"
  desert-gold: "#C9B98F"
  champagne: "#DFD0B8"
  espresso: "#2A2620"
  ink-on-gold: "#1C170E"
typography:
  wordmark:
    fontFamily: "'Cormorant Garamond', Georgia, serif"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: normal
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontWeight: 300
    fontSize: "clamp(3.75rem, 8vw, 6rem)"
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontWeight: 400
    fontSize: "15px"
    lineHeight: 1.7
    letterSpacing: "0.016em"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontWeight: 600
    fontSize: "10px"
    lineHeight: 1
    letterSpacing: "0.25em"
rounded:
  sm: "10px"
  md: "16px"
  lg: "22px"
  chip: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "80px"
components:
  nav-pill-active:
    backgroundColor: "{colors.desert-gold}"
    textColor: "{colors.ink-on-gold}"
    rounded: "{rounded.chip}"
    height: "44px"
    padding: "6px 12px"
  card-glass:
    backgroundColor: "rgba(0, 0, 0, 0.65)"
    textColor: "{colors.starlight}"
    rounded: "{rounded.md}"
    padding: "24px"
  glossary-card:
    backgroundColor: "rgba(0, 0, 0, 0.65)"
    textColor: "{colors.starlight}"
    rounded: "{rounded.lg}"
    padding: "24px"
  status-chip:
    backgroundColor: "{colors.space-gray}"
    textColor: "{colors.silver-fog}"
    rounded: "{rounded.chip}"
    padding: "4px 10px"
---

# Design System: FlareField

## Overview

**Creative North Star: "Instrumento de Campo"**

FlareField se ve como un instrumento de medición construido para usarse afuera: carcasa nocturna (`midnight`), módulos de vidrio esmerilado flotando sobre la página plana, y lecturas doradas como grabados en latón. Todo lo que brilla es un dato; no hay ornamento que no sea información. La densidad es baja y deliberada — una persona parada en un lote, con el sol de frente, necesita leer el estado en segundos.

El sistema es **dark-only**: no existe modo claro ni está previsto. El vidrio (`backdrop-filter` con saturación) es el material estructural del sistema — barra de navegación, tarjetas y tooltips del mapa comparten exactamente la misma receta — y las sombras existen solo como vocabulario de dos niveles, nunca como decoración. La tipografía lleva la voz técnica: monoespaciada para toda lectura de dato, sans humanista para prosa, y una única serif reservada por completo a la marca.

**Key Characteristics:**
- Dark-only carbón azulado con acento oro viejo usado con rareza disciplinada.
- Glass unificado: una sola receta de fondo+blur para toda superficie flotante.
- Micro-etiquetas monoespaciadas en mayúsculas como firma del sistema.
- Iconografía de trazo (Lucide, stroke 1.5) — sin emoji, sin glyphs sueltos.
- Movimiento contenido: springs de entrada y reveals al scroll, nada elástico-decorativo.

## Colors

Paleta fría-carbón con un único acento cálido: casi todo es noche y niebla, y el oro aparece solo donde hay que mirar.

### Primary
- **Desert Gold** (`#C9B98F`, var `--accent-fill`): el acento único del sistema. Estado activo del nav, lecturas del gauge Kp, flechas destacadas del diagrama, números de entrada en hover. Su rareza es el mensaje: si algo es dorado, importa.
- **Espresso** (`#2A2620`, var `--accent-bg`): contenedor oscuro del oro — superficies de estado elevado, fondos de chip activo, halos funcionales detrás del gauge.
- **Champagne** (`#DFD0B8`, var `--accent-text`): texto sobre contextos de acento cuando necesita más aire que el oro pleno.
- **Ink on Gold** (`#1C170E`, var `--accent-fill-on`): texto obligatorio sobre Desert Gold (pill activa del nav).

### Neutral
- **Midnight** (`#181C22`, var `--bg-page`): fondo de página. Carbón con matiz azul, nunca negro puro.
- **Graphite** (`#222831`, var `--bg-surface-1`): superficie base de paneles opacos.
- **Space Gray** (`#393E46`, var `--bg-surface-2`): superficie elevada — chips en reposo, hover de botones.
- **Titanium** (`#484E58`, var `--bg-surface-3`): superficie máxima — estado destacado de tarjetas anotadas.
- **Starlight** (`#F2EDE4`, var `--text-primary`): texto principal. Blanco cálido lino, no blanco puro.
- **Silver Fog** (`#A8A29A`, var `--text-secondary`): texto secundario, descripciones, labels en reposo.
- **Aluminum** (`#948F88`, var `--text-muted`): texto terciario y outline del kicker.
- **Glass Ink** (`rgba(0,0,0,0.65)`, var `--glass-unified-bg`): fondo de toda superficie de vidrio.
- **Linen Veil** (`rgba(223,208,184,0.10)` sutil / `0.18` fuerte, vars `--border-subtle` / `--border-strong`): todos los bordes del sistema derivan de Starlight en alpha — jamás gris o negro puro.

### Named Rules
**The Brass Rarity Rule.** Desert Gold cubre ≤10% de cualquier pantalla. Si dudás si algo debe ser dorado, no lo sea: el oro señala estado activo o dato crítico, jamás decora.

**The Warm Border Rule.** Todo borde es Linen Veil (alpha de `#DFD0B8`). Un borde gris neutro o negro rompe la temperatura del sistema.

## Typography

**Display Font:** Geist (fallback `system-ui, sans-serif`) — var `--font-display` / `--font-body`
**Body Font:** Geist (misma familia que display; la jerarquía la hacen peso y tamaño)
**Label/Mono Font:** Geist Mono — var `--font-mono-stat`
**Wordmark:** Cormorant Garamond 600 — var `--font-wordmark`

**Character:** Sans humanista geométrica para todo lo narrativo, monoespaciada para todo lo medido. La pareja transmite instrumento: la mono no es estética "tech", es señal de lectura de dato.

### Hierarchy
- **Display** (300, hasta 96px / `clamp(3.75rem, 8vw, 6rem)`, line-height 1.05, tracking -0.02em): título de página ("Glosario"). Uno por página.
- **Title / Stat** (Geist Mono 600, 14–28px, tracking -0.01em en números grandes): títulos de tarjeta, valores del gauge, intensidades (G3).
- **Body** (400, 15px, line-height 1.7): prosa de glosario y descripciones. Máximo ~70ch.
- **Label — Kicker** (Geist Mono 600, 10px, letter-spacing 0.25em, MAYÚSCULAS, clase `.text-kicker`): micro-etiquetas sobre datos ("Monitoreo en Vivo", headers de sección, footer). Es la firma tipográfica del sistema.
- **Label — Chip** (Geist Mono 600, 10px, letter-spacing 0.08em, MAYÚSCULAS, inline): badges de estado ("KP ELEVADO", "TORMENTA ACTIVA"), especificación idéntica a `.popup-status-badge`.

### Named Rules
**The One Serif Rule.** Cormorant Garamond aparece exclusivamente en el wordmark "FlareField" (600, line-height 1). Jamás en headings, cuerpo ni UI: si una serif entra a la interfaz, el sistema quedó roto.

## Layout

Columna única centrada de `max-w-6xl` (1152px) con padding lateral progresivo (24/32/48px). La navegación desktop es una píldora flotante centrada arriba (`.notch-nav`); en móvil, barra inferior fija + hamburger dentro de la píldora. Secciones respiran con `padding-bottom` de 80–96px y los grids de tarjetas escalan 1→2→4 columnas con gap de 24px. El diagrama anotado reserva canales laterales de 170px (`px-[170px]`) para labels conectados por SVG. Presupuesto de performance vinculante (ver PRODUCT.md): cada asset se justifica; sin imágenes decorativas.

## Elevation & Depth

Sistema híbrido de vidrio flotante: la página base es plana (Midnight plano, sin textura), y la profundidad la construyen superficies de vidrio esmerilado (`--glass-unified-bg` + `--glass-unified-blur`: `blur(24px) saturate(140%)`) sombreadas con un vocabulario de exactamente dos niveles. Sin glows externos, sin halos decorativos, sin dot-grids: fueron removidos por decisión de sistema (2026-08-23).

### Shadow Vocabulary
- **Soft** (`box-shadow: 0 8px 32px rgba(12,14,12,0.12)`, var `--shadow-soft`): reposo de superficies secundarias.
- **Elevated** (`box-shadow: 0 12px 48px rgba(12,14,12,0.18)`, var `--shadow-elevated`): nav flotante, tarjetas de mapa, toda superficie que flota sobre contenido.

### Named Rules
**The Unified Glass Rule.** Existe UNA receta de vidrio: `rgba(0,0,0,0.65)` + `blur(24px) saturate(140%)` (vars `--glass-unified-*`). Navbar, tarjetas de mapa, glosario y tooltip de zona la comparten. Cualquier superficie flotante nueva la usa; prohibido derivar recetas propias de blur o tinte.

**The Two-Shadow Rule.** Solo Soft y Elevated existen. Una sombra nueva necesita antes eliminar una vieja.

## Shapes

Escala de radios de tres pasos más píldora: `--radius-sm` 10px (elementos internos), `--radius-md` 16px (tarjetas de mapa, chips de tecnología, popups Leaflet), `--radius-lg` 22px (nav flotante y tarjetas de glosario), `9999px` para chips y pills. Bordes siempre de 1px en Linen Veil. Silueta característica: rectángulos de vidrio de esquina continua sin bordes coloreados de énfasis — el énfasis nunca viene del trazo del borde sino del relleno de fondo.

## Components

### Notch Navigation
- **Forma:** píldora flotante centrada (radius 22px), glass unificado, Elevated shadow, entrada con spring (stiffness 400 / damping 30).
- **Estados:** link activo = pill Desert Gold con texto Ink on Gold; hover = overlay blanco 16% deslizante (spring compartido `layoutId`); reposo = Silver Fog.
- **Móvil (<900px):** colapsa a hamburger centrado; menú desplegable dentro de la misma píldora.

### Cards / Containers
- **Map Card (`.bubble-card`):** radius 16px, glass unificado, padding interno 24px, Elevated shadow. Hover: `scale(1.02)`; active: `scale(0.98)` (solo pointer fino). Entrada `.bubble-enter` con delays escalonados de 80ms.
- **Glossary Card (`.glass-card-light`):** radius 22px, mismo glass unificado, padding 24px, reveal al scroll (opacity + translateY 16px). Hover levanta 3px; estado anotado tiñe fondo Titanium y borde Espresso.

### Status Chips
- **Estilo:** pill (radius full), borde 1px, Geist Mono 600 10px / 0.08em mayúsculas.
- **Variantes de severidad:** estable (verde `--chip-stable-*`), advertencia (ámbar `--chip-warning-*`), crítico (rojo `--chip-critical-*`); variante de acento usa borde Desert Gold/30 sobre Espresso/20 con texto Desert Gold.

### Kp Gauge (signature)
Anillo SVG de 104px con track en borde sutil y arco de progreso Desert Gold con extremos redondeados; número central Geist Mono bold. Es el corazón del sistema: su geometría (arco, no reloj) puede repetirse, su paleta no.

### Zone Markers (signature)
Halo radial + anillo de precisión + núcleo central sobre el mapa, teñidos por severidad (default/rojo/ámbar/verde vía `--zone-c-*`), pulso CSS suave de 3s. Hover intensifica luz sin deformar.

### Buttons
- **Nav pill / icon button:** altura táctil 44px, radius full, hover de fondo Space Gray, active `scale(0.97)`.
- **Acción primaria contextual:** fondo Desert Gold + Ink on Gold (único uso de relleno dorado en control).
- Iconografía: Lucide, stroke 1.5, 16–20px, heredando color de texto.

## Do's and Don'ts

### Do:
- **Do** usar las vars `--glass-unified-bg` / `--glass-unified-blur` para toda superficie flotante nueva (navbar, cards, tooltips, paneles).
- **Do** usar `.text-kicker` para toda micro-etiqueta; los trackings ad-hoc (`tracking-[0.15em]`…) están fuera del sistema.
- **Do** tomar colores solo de tokens (`var(--accent-fill)`, `var(--bg-surface-2)`…); hex directo en JSX quedó desterrado.
- **Do** respetar `prefers-reduced-motion` en toda animación nueva y mantener el presupuesto de peso (conexiones rurales lentas).
- **Do** dibujar iconos como SVG de trazo consistente (Lucide o path propio equivalente).

### Don't:
- **Don't** introducir modo claro: el sistema es dark-only por decisión.
- **Don't** agregar glows externos, gradientes radiales decorativos, dot-grids ni blobs de blur: se removieron por decisión de sistema (2026-08-23) y no vuelven.
- **Don't** usar Cormorant Garamond fuera del wordmark "FlareField".
- **Don't** truncar títulos con `truncate` para resolver falta de espacio: se reacomoda la composición (bug corregido en glosario).
- **Don't** crear sombras fuera del vocabulario Soft/Elevated ni recetas alternativas de glass.
