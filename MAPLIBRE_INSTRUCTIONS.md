MapLibre / Mapbox 3D integration instructions

This project now contains a scaffolded MapLibre client component at:

- components/features/SolarMap.maplibre.client.tsx

What the scaffold does
- Uses maplibre-gl and a dark MapTiler style (configured via `NEXT_PUBLIC_MAP_STYLE`).
- Sets a pitched, bearing camera to create a diagonal 3D view.
- Adds markers for the mock `ARGENTINA_ZONES` and for `userLocation` when provided.
- Adds navigation controls and enables drag/pitch/rotate interactions.
- Applies the same Poppins typography family used by the navbar and cards to map controls, popups, and attribution.

How to enable MapLibre in development
1) Install dependencies (maplibre-gl):

```bash
pnpm add maplibre-gl
```

2) Enable MapLibre by setting the environment variable `NEXT_PUBLIC_USE_MAPLIBRE=1`.

For example, in `.env.local`:

```
NEXT_PUBLIC_USE_MAPLIBRE=1
# Optional: override the style URL (dark style recommended)
NEXT_PUBLIC_MAP_STYLE=https://api.maptiler.com/maps/streets-v2-dark/style.json?key=YOUR_MAPTILER_KEY
```

3) Run the dev server:

```bash
pnpm dev
```

Notes and next steps
- The current setup uses a dark MapTiler style to match the app's dark 3D map direction.
- To add real 3D terrain with elevation and extrusions, MapLibre can be combined with a DEM raster source and `terrain`/`raster-dem` layers — this typically requires a tileset or Mapbox/MapTiler token.
- Building structures are rendered with `fill-extrusion` when a compatible vector source is available in the selected style.
- If you prefer Mapbox GL JS (official Mapbox), you can switch but will need a Mapbox token and to replace imports accordingly.
- I left `components/features/SolarMap.client.tsx` intact as a fallback; the wrapper `components/features/SolarMap.tsx` will load MapLibre if `NEXT_PUBLIC_USE_MAPLIBRE=1`.
- MapLibre UI typography is intentionally aligned with the navbar/cards by using Poppins and the same dark text tone in popups/controls.

If you want, I can:
- Add automatic dynamic loading of the MapLibre CSS to avoid editing global CSS.
- Increase terrain exaggeration or adjust the dark style if you want a more dramatic 3D effect.
- Replace the mocked zones with geojson data and add clustering.
