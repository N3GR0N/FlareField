"use client";

import { useState, useEffect, useCallback, useRef, useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";

interface GlossaryEntry {
  id: string;
  number: string;
  title: string;
  body: string;
  example: string;
  summary: string;
}

interface Annotation {
  id: string;
  label: string;
  cardId: string;
  elX: "left" | "right";
  labelSide: "left" | "right";
  labelYPct: number;
}

interface LabelPos {
  cx: number;
  cy: number;
  left: number;
  right: number;
}

const glossaryData: GlossaryEntry[] = [
  {
    id: "kp", number: "01", title: "Índice Kp",
    body: "Escala del 0 al 9 que mide la actividad geomagnética global. Cuanto mayor el número, mayor la perturbación del campo magnético terrestre. Kp 0–3 es normal. Kp 4–5 puede interferir con GPS. Kp 6 o más, no volar drones.",
    example: "Un Kp de 7 puede hacer que tu drone pierda señal GPS sin aviso previo.",
    summary: "Escala de 0 a 9 que mide la perturbación del campo magnético.",
  },
  {
    id: "storm", number: "02", title: "Tormenta Geomagnética",
    body: "Perturbación del campo magnético terrestre causada por viento solar. Se mide en escala G1 a G5. Afecta GPS, comunicaciones de radio y satélite, especialmente en altas latitudes.",
    example: "Una tormenta G3 puede cortar internet satelital en escuelas rurales por horas.",
    summary: "Perturbación del campo magnético causada por viento solar.",
  },
  {
    id: "flare", number: "03", title: "Llamarada Solar",
    body: "Explosión de energía en la superficie del sol. Se clasifica por intensidad: C (leve), M (moderada), X (severa). Las clase X pueden afectar todas las tecnologías simultáneamente.",
    example: "Una llamarada X2 apagó redes satelitales en zonas rurales en 2024.",
    summary: "Explosión de energía en la superficie del sol.",
  },
  {
    id: "nasa", number: "04", title: "NASA DONKI API",
    body: "Base de datos oficial de la NASA con eventos espaciales en tiempo real. Es la fuente más confiable y actualizada del mundo para este tipo de datos.",
    example: "Todos los eventos que ves en FlareField vienen directamente de los servidores de la NASA.",
    summary: "Base de datos oficial de la NASA con eventos espaciales en tiempo real.",
  },
  {
    id: "drones", number: "05", title: "Drones de Fumigación",
    body: "Pérdida de señal GPS, deriva de posición, desconexión del operador. El drone puede desviarse de la zona de trabajo o no regresar al punto de inicio.",
    example: "Una tormenta G3 puede hacer que un drone pierda referencia GPS y se desvíe del campo.",
    summary: "Pérdida de GPS y deriva de posición durante eventos solares.",
  },
  {
    id: "wifi", number: "06", title: "WiFi Satelital Rural",
    body: "Latencia alta, cortes intermitentes, pérdida total de señal. Riesgo: pérdida de comunicación en zonas sin alternativa de conectividad.",
    example: "Descargá materiales importantes antes de una tormenta prevista.",
    summary: "Latencia alta y cortes intermitentes de señal.",
  },
  {
    id: "schools", number: "07", title: "Internet en Escuelas Rurales",
    body: "Igual que WiFi satelital, pero impacta clases en línea y sistemas administrativos. Las escuelas rurales dependen de internet satelital para conectividad.",
    example: "Planificá clases offline como backup durante alertas naranjas o rojas.",
    summary: "Impacta clases en línea y sistemas administrativos.",
  },
  {
    id: "radio", number: "08", title: "Comunicaciones de Radio",
    body: "Interferencia en frecuencias HF, degradación de señal VHF/UHF. Las frecuencias HF son las más vulnerables a perturbaciones ionosféricas.",
    example: "Establecé horarios de check-in más frecuentes durante alertas.",
    summary: "Interferencia en frecuencias HF, VHF y UHF.",
  },
];

const annotations: Annotation[] = [
  { id: "kp",        label: "Escala de 0 a 9. Cuanto más\nalto, peor para tus equipos.",  cardId: "kp",     elX: "left",  labelSide: "left",  labelYPct: 0.10 },
  { id: "status",    label: "El estado actual de tu zona:\nestable, elevado o crítico.",     cardId: "storm",  elX: "left",  labelSide: "left",  labelYPct: -0.25 },
  { id: "gauge",     label: "Muestra qué tan activo está el\ncampo magnético ahora mismo.", cardId: "kp",     elX: "left",  labelSide: "left",  labelYPct: 0.46 },
  { id: "hours",     label: "Ventana de tiempo en que el\nefecto va a durar.",               cardId: "storm",  elX: "left",  labelSide: "left",  labelYPct: 0.82 },
  { id: "eventname", label: "El nombre del evento\ndetectado por la NASA.",                  cardId: "flare",  elX: "right", labelSide: "right", labelYPct: 0.02 },
  { id: "intensity", label: "La intensidad del evento.\nG y X son las más peligrosas.",      cardId: "flare",  elX: "right", labelSide: "right", labelYPct: 0.28 },
  { id: "source",    label: "Fuente oficial: base de datos\nespacial de la NASA en tiempo real.", cardId: "nasa", elX: "right", labelSide: "right", labelYPct: 0.52 },
  { id: "tech",      label: "Qué equipos van a tener\nproblemas en tu campo.",              cardId: "drones", elX: "right", labelSide: "right", labelYPct: 0.90 },
];

function DiagramCard({
  highlightedId,
  onElementEnter,
  onElementLeave,
  refs,
}: {
  highlightedId: string | null;
  onElementEnter: (id: string) => void;
  onElementLeave: () => void;
  refs: Record<string, React.RefObject<HTMLDivElement | null>>;
}) {
  const { gauge, kp, status, hours, eventname, intensity, source, tech } = refs;

  const elGlow = "bg-[var(--accent-fill)]/8 ring-1 ring-[var(--accent-fill)]/15";
  const elNoGlow = "";

  return (
    <div className="flex flex-col md:flex-row gap-5 justify-center">
      {/* ─── Monitoreo en Vivo ─── */}
      <div className="w-full md:w-[280px] p-5 glass-card-light">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--accent-fill)] animate-pulse" />
          <span className="text-kicker" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>Monitoreo en Vivo</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            ref={gauge}
            className={`relative w-[90px] h-[90px] shrink-0 rounded-xl transition-all duration-200 cursor-pointer ${highlightedId === "gauge" ? elGlow : elNoGlow}`}
            onMouseEnter={() => onElementEnter("gauge")}
            onMouseLeave={onElementLeave}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
              <circle fill="none" cx="60" cy="60" r="50" stroke="var(--border-subtle)" strokeWidth="5" />
              <circle fill="none" cx="60" cy="60" r="50" stroke="var(--accent-fill)" strokeWidth="5" strokeLinecap="round" strokeDasharray={2 * Math.PI * 50} strokeDashoffset={2 * Math.PI * 50 * 0.44} />
            </svg>
            <div
              ref={kp}
              className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${highlightedId === "kp" ? elGlow : elNoGlow}`}
              onMouseEnter={() => onElementEnter("kp")}
              onMouseLeave={onElementLeave}
            >
              <span className="text-[28px] font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>4</span>
              <span className="text-kicker" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>Kp</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div>
              <div className="text-kicker mb-1" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>Estado</div>
              <span
                ref={status}
                className={`inline-flex items-center rounded-full border px-2.5 py-1 border-[var(--border-strong)]/30 bg-[var(--bg-surface-2)] transition-all duration-200 cursor-pointer ${highlightedId === "status" ? "bg-[var(--accent-bg)] border-[var(--accent-fill)]/25 ring-1 ring-[var(--accent-fill)]/10" : ""}`}
                style={{
                  fontFamily: "var(--font-mono-stat), sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: highlightedId === "status" ? "var(--accent-text)" : "var(--text-secondary)",
                }}
                onMouseEnter={() => onElementEnter("status")}
                onMouseLeave={onElementLeave}
              >
                KP ELEVADO
              </span>
            </div>
            <div
              ref={hours}
              className={`rounded-lg px-2 py-1 -mx-2 transition-all duration-200 cursor-pointer ${highlightedId === "hours" ? elGlow : elNoGlow}`}
              onMouseEnter={() => onElementEnter("hours")}
              onMouseLeave={onElementLeave}
            >
              <div className="text-kicker mb-1" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>Próximas horas</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-[5px] w-[5px] rounded-full bg-[var(--accent-fill)] animate-pulse" />
                <span className="text-[13px] text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-body), sans-serif" }}>+3h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Eventos Activos ─── */}
      <div className="w-full md:w-[280px] p-5 glass-card-light">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--accent-fill)] animate-pulse" />
            <span className="text-kicker" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>Eventos Activos</span>
          </div>
          <span
            className="inline-flex items-center shrink-0 rounded-full border px-2.5 py-1 border-[var(--accent-fill)]/30 bg-[var(--accent-bg)]/20"
            style={{
              fontFamily: "var(--font-mono-stat), sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "var(--accent-fill)",
            }}
          >
            TORMENTA ACTIVA
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div
              ref={eventname}
              className={`text-[14px] font-semibold text-[var(--text-primary)] rounded px-1 -mx-1 transition-all duration-200 cursor-pointer ${highlightedId === "eventname" ? elGlow : elNoGlow}`}
              style={{ fontFamily: "var(--font-body), sans-serif" }}
              onMouseEnter={() => onElementEnter("eventname")}
              onMouseLeave={onElementLeave}
            >
              Tormenta Solar
            </div>
            <div
              ref={source}
              className={`text-kicker mt-0.5 rounded px-1 -mx-1 transition-all duration-200 cursor-pointer ${highlightedId === "source" ? "bg-[var(--accent-bg)]/10 ring-1 ring-[var(--accent-fill)]/15" : ""}`}
              style={{
                fontFamily: "var(--font-mono-stat), sans-serif",
                color: highlightedId === "source" ? "var(--accent-fill)" : undefined,
              }}
              onMouseEnter={() => onElementEnter("source")}
              onMouseLeave={onElementLeave}
            >
              NASA DONKI API
            </div>
          </div>
          <span
            ref={intensity}
            className={`shrink-0 text-[20px] font-bold tracking-tight text-[var(--text-primary)] rounded px-1 transition-all duration-200 cursor-pointer ${highlightedId === "intensity" ? elGlow : elNoGlow}`}
            style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}
            onMouseEnter={() => onElementEnter("intensity")}
            onMouseLeave={onElementLeave}
          >
            G3
          </span>
        </div>
        <div className="h-px bg-[var(--border-subtle)]/40 mb-3" />
        <div
          ref={tech}
          className={`rounded-lg p-1 -m-1 transition-all duration-200 cursor-pointer ${highlightedId === "tech" ? elGlow : elNoGlow}`}
          onMouseEnter={() => onElementEnter("tech")}
          onMouseLeave={onElementLeave}
        >
          <div className="text-kicker mb-2" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>Tecnologías Afectadas</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "M12 7a5 5 0 100 10 5 5 0 000-10zM4 4l4 4M20 4l-4 4M4 20l4-4M20 20l-4-4", label: "Drones" },
              { icon: "M21 3l-6 6M3 13h8v6H3z", label: "WiFi Sat" },
              { icon: "M12 3l9 5-9 5-9-5 9-5zM3 10v7a2 2 0 002 2h14", label: "Escuela" },
              { icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM4.93 4.93l14.14 14.14", label: "Radio" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 border border-[var(--border-subtle)]/40 rounded-2xl px-3 py-2 bg-[var(--bg-surface-2)]/40">
                <svg className="h-[14px] w-[14px] shrink-0 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
                <span className="text-[12px] text-[var(--text-secondary)] truncate" style={{ fontFamily: "var(--font-body), sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GlossaryCard({
  entry, isVisible, isHighlighted, onMouseEnter, onMouseLeave, reducedMotion,
}: {
  entry: GlossaryEntry; isVisible: boolean; isHighlighted: boolean;
  onMouseEnter: () => void; onMouseLeave: () => void; reducedMotion: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => { setIsHovered(true); onMouseEnter(); }}
      onMouseLeave={() => { setIsHovered(false); onMouseLeave(); }}
      className="glass-card-light p-6 cursor-default"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? (isHovered ? "translateY(-3px)" : "translateY(0)")
            : "translateY(16px)",
          transition: reducedMotion ? "none" : "opacity 0.5s ease-out, transform 0.4s ease-out, background-color 0.3s ease, border-color 0.3s ease",
          backgroundColor: isHighlighted ? "var(--bg-surface-3)" : (isHovered ? "var(--bg-surface-2)" : undefined),
          borderColor: isHighlighted ? "var(--accent-bg)" : (isHovered ? "var(--border-subtle)" : undefined),
        }}
    >
      <span
        className="block text-[11px] mb-4"
        style={{
          fontFamily: "var(--font-mono-stat), sans-serif",
          color: isHovered ? "var(--accent-fill)" : "var(--text-secondary)",
          transition: reducedMotion ? "none" : "color 0.3s ease",
        }}
      >
        {entry.number}
      </span>
      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>
        {entry.title}
      </h3>
      {/* Separator */}
      <div className="h-px mb-4" style={{ background: "var(--border-subtle)" }} />
      <p className="text-[15px] leading-[1.8] text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-body), sans-serif" }}>
        {entry.body}
      </p>
      <p className="text-[13px] italic leading-relaxed text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-body), sans-serif" }}>
        {entry.example}
      </p>
    </div>
  );
}

export default function GlossaryPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [isDiagramVisible, setIsDiagramVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [arrowsDrawn, setArrowsDrawn] = useState(false);
  const [positions, setPositions] = useState<Record<string, { cx: number; cy: number; elLeft: number; elRight: number }>>({});
  const [labelPositions, setLabelPositions] = useState<Record<string, LabelPos>>({});
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [titleOpacity, setTitleOpacity] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const elKp = useRef<HTMLDivElement | null>(null);
  const elGauge = useRef<HTMLDivElement | null>(null);
  const elStatus = useRef<HTMLDivElement | null>(null);
  const elHours = useRef<HTMLDivElement | null>(null);
  const elEventname = useRef<HTMLDivElement | null>(null);
  const elIntensity = useRef<HTMLDivElement | null>(null);
  const elSource = useRef<HTMLDivElement | null>(null);
  const elTech = useRef<HTMLDivElement | null>(null);

  const labelKp = useRef<HTMLDivElement | null>(null);
  const labelGauge = useRef<HTMLDivElement | null>(null);
  const labelStatus = useRef<HTMLDivElement | null>(null);
  const labelHours = useRef<HTMLDivElement | null>(null);
  const labelEventname = useRef<HTMLDivElement | null>(null);
  const labelIntensity = useRef<HTMLDivElement | null>(null);
  const labelSource = useRef<HTMLDivElement | null>(null);
  const labelTech = useRef<HTMLDivElement | null>(null);

  const elementRefs = useMemo<Record<string, React.RefObject<HTMLDivElement | null>>>(() => ({
    kp: elKp, gauge: elGauge, status: elStatus, hours: elHours,
    eventname: elEventname, intensity: elIntensity, source: elSource, tech: elTech,
  }), [elKp, elGauge, elStatus, elHours, elEventname, elIntensity, elSource, elTech]);

  const annotationRefs = useMemo<Record<string, React.RefObject<HTMLDivElement | null>>>(() => ({
    kp: labelKp, gauge: labelGauge, status: labelStatus, hours: labelHours,
    eventname: labelEventname, intensity: labelIntensity, source: labelSource, tech: labelTech,
  }), [labelKp, labelGauge, labelStatus, labelHours, labelEventname, labelIntensity, labelSource, labelTech]);

  const handleAnnotationEnter = useCallback((id: string) => setHighlightedId(id), []);
  const handleAnnotationLeave = useCallback(() => setHighlightedId(null), []);
  const handleElementEnter = useCallback((id: string) => setHighlightedId(id), []);
  const handleElementLeave = useCallback(() => setHighlightedId(null), []);
  const handleCardEnter = useCallback((cardId: string) => {
    const match = annotations.find((a) => a.cardId === cardId);
    if (match) setHighlightedId(match.id);
  }, []);
  const handleCardLeave = useCallback(() => setHighlightedId(null), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Hero entrance animation
  useEffect(() => {
    if (reducedMotion) {
      const id = requestAnimationFrame(() => setHeroVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Arrow draw-in animation when diagram becomes visible
  useEffect(() => {
    if (isDiagramVisible && !reducedMotion) {
      const timer = setTimeout(() => setArrowsDrawn(true), 300);
      return () => clearTimeout(timer);
    }
    if (reducedMotion && isDiagramVisible) {
      const id = requestAnimationFrame(() => setArrowsDrawn(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isDiagramVisible, reducedMotion]);

  // Scroll progress indicator + title fade
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const y = window.scrollY;
      const max = docH - winH;
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);
      // title fade: fully visible 0–150, fade out 150–300
      if (y <= 150) setTitleOpacity(1);
      else if (y >= 300) setTitleOpacity(0);
      else setTitleOpacity(1 - (y - 150) / 150);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure all positions on mount and resize
  useLayoutEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const cRect = container.getBoundingClientRect();
      setContainerSize({ w: cRect.width, h: cRect.height });

      const elPos: Record<string, { cx: number; cy: number; elLeft: number; elRight: number }> = {};
      for (const ann of annotations) {
        const el = elementRefs[ann.id]?.current;
        if (el) {
          const r = el.getBoundingClientRect();
          elPos[ann.id] = {
            cx: r.left - cRect.left + r.width / 2,
            cy: r.top - cRect.top + r.height / 2,
            elLeft: r.left - cRect.left,
            elRight: r.right - cRect.left,
          };
        }
      }
      setPositions(elPos);

      const lblPos: Record<string, LabelPos> = {};
      for (const ann of annotations) {
        const lbl = annotationRefs[ann.id]?.current;
        if (lbl) {
          const r = lbl.getBoundingClientRect();
          lblPos[ann.id] = {
            cx: r.left - cRect.left + r.width / 2,
            cy: r.top - cRect.top + r.height / 2,
            left: r.left - cRect.left,
            right: r.right - cRect.left,
          };
        }
      }
      setLabelPositions(lblPos);
    };

    measure();

    let raf: number;
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const resizeObs = new ResizeObserver(scheduleMeasure);
    resizeObs.observe(container);
    window.addEventListener("resize", scheduleMeasure);

    // Re-measure once entrance transforms and web-font swaps have settled:
    // the section translates in over 700ms and next/font may resolve after
    // mount; both shift element rects without resizing the container, so
    // ResizeObserver alone leaves stale coordinates and mis-aimed arrows.
    const settleTimers = [750, 1500].map((ms) => window.setTimeout(scheduleMeasure, ms));
    document.fonts.ready.then(scheduleMeasure).catch(() => {});
    window.addEventListener("load", scheduleMeasure);

    return () => {
      resizeObs.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
      settleTimers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, isDiagramVisible, elementRefs, annotationRefs]);

  useEffect(() => {
    const onScroll = () => {
      const diagramEl = document.getElementById("diagram-section");
      if (diagramEl) {
        const rect = diagramEl.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) setIsDiagramVisible(true);
      }
      const cardEls = document.querySelectorAll("[data-glossary-id]");
      setVisibleCards((prev) => {
        const next = new Set(prev);
        let changed = false;
        cardEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.85) {
            const id = el.getAttribute("data-glossary-id");
            if (id && !next.has(id)) { next.add(id); changed = true; }
          }
        });
        return changed ? next : prev;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const highlightedCardId = highlightedId
    ? annotations.find((a) => a.id === highlightedId)?.cardId ?? null
    : null;

  // Compute arrow paths — all coordinates from DOM measurement
  const arrowPaths = annotations.map((ann) => {
    const startPos = positions[ann.id];
    const lblPos = labelPositions[ann.id];
    if (!startPos || !lblPos) return null;

    const isLeft = ann.elX === "left";
    const startX = isLeft ? startPos.elLeft : startPos.elRight;
    const startY = startPos.cy;
    const endX = isLeft ? lblPos.right : lblPos.left;
    const endY = lblPos.cy;

    if (ann.id === "status") {
      const cp1x = startX - 25;
      const cp1y = startY - 55;
      const cp2x = endX + 20;
      const cp2y = endY + 40;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    if (ann.id === "kp") {
      const cp1x = startX - 20;
      const cp1y = startY - 8;
      const cp2x = endX + 15;
      const cp2y = endY + 12;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    if (ann.id === "gauge") {
      const cp1x = startX - 18;
      const cp1y = startY + 6;
      const cp2x = endX + 12;
      const cp2y = endY - 10;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    if (ann.id === "hours") {
      const cp1x = startX - 20;
      const cp1y = startY + 30;
      const cp2x = endX + 25;
      const cp2y = endY - 20;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    if (ann.id === "eventname") {
      const cp1x = startX + 25;
      const cp1y = startY - 45;
      const cp2x = endX - 18;
      const cp2y = endY + 25;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    if (ann.id === "intensity") {
      const cp1x = startX + 15;
      const cp1y = startY - 10;
      const cp2x = endX - 10;
      const cp2y = endY + 8;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    if (ann.id === "source") {
      const cp1x = startX + 12;
      const cp1y = startY + 5;
      const cp2x = endX - 15;
      const cp2y = endY - 8;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    if (ann.id === "tech") {
      const cp1x = startX + 22;
      const cp1y = startY + 35;
      const cp2x = endX - 20;
      const cp2y = endY - 18;
      return {
        ...ann,
        path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
      };
    }

    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const tension = Math.min(dist * 0.35, 60);

    const cp1x = startX + (isLeft ? -tension : tension);
    const cp1y = startY;
    const cp2x = endX + (isLeft ? tension : -tension);
    const cp2y = endY;

    return {
      ...ann,
      path: `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`,
    };
  }).filter(Boolean) as Array<Annotation & { path: string }>;

  return (
    <>
      {/* ─── Scroll Progress Bar ─── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: "2px",
          background: "var(--accent-fill)",
          zIndex: 100,
          transition: "width 0.1s linear",
        }}
      />

      {/* ─── FlareField Hero Title (fixed top-left, matching map page) ─── */}
      <div
        className="pointer-events-none max-w-xl md:left-8 lg:left-12"
        style={{ position: "fixed", top: 0, left: "0.5rem", zIndex: 50, opacity: titleOpacity, pointerEvents: titleOpacity === 0 ? "none" : undefined }}
      >
        <p
          className="text-kicker mb-3"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(12px)",
            transition: reducedMotion ? "none" : "opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s",
          }}
        >
          Monitoreo espacial en tiempo real
        </p>
        <h1
          className="text-5xl md:text-6xl lg:text-7xl"
          style={{
            fontFamily: "var(--font-wordmark), 'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
            lineHeight: 1,
            color: "var(--text-primary)",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(16px)",
            transition: reducedMotion ? "none" : "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          FlareField
        </h1>
      </div>

      <div className="relative min-h-screen" style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}>
      <TopNav isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      <BottomNav />

      <main className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* ─── Hero ─── */}
        <section className="pt-[100px] pb-20 text-center">
          <h2
            className="text-6xl sm:text-7xl md:text-[96px] font-light text-[var(--text-primary)] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display), sans-serif",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: reducedMotion ? "none" : "opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s",
            }}
          >
            Glosario
          </h2>
          <p
            className="mx-auto max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]"
            style={{
              fontFamily: "var(--font-body), sans-serif",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(10px)",
              transition: reducedMotion ? "none" : "opacity 0.6s ease-out 0.25s, transform 0.6s ease-out 0.25s",
            }}
          >
            Entendé qué afecta tu tecnología y cuándo actuar.
          </p>
        </section>

        {/* ─── Mobile: Simple list ─── */}
        {isMobile && (
          <section className="pb-16">
            <p className="text-kicker mb-6 text-center" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>
              Qué estás viendo en el mapa
            </p>
            <div className="space-y-3">
              {glossaryData.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 py-3 border-b border-[var(--border-subtle)]/30 last:border-0">
                  <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 shrink-0" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>{entry.number}</span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>{entry.title}</div>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-0.5" style={{ fontFamily: "var(--font-body), sans-serif" }}>{entry.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Annotated Diagram (tablet+) ─── */}
        {!isMobile && (
          <section
            id="diagram-section"
            className={`pb-24 transition-all duration-700 ease-out ${isDiagramVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <p
              className="text-center text-kicker mb-12"
              style={{
                fontFamily: "var(--font-mono-stat), sans-serif",
                opacity: isDiagramVisible ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.6s ease-out",
              }}
            >
              Qué estás viendo en el mapa
            </p>

            <div ref={containerRef} className="relative px-[170px]">
              {/* SVG overlay — coordinates = DOM pixels relative to this container */}
              {containerSize.w > 0 && (
                <svg
                  ref={svgRef}
                  width={containerSize.w}
                  height={containerSize.h}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ overflow: "visible" }}
                  role="img"
                  aria-label="Diagrama anotado que explica los elementos de las tarjetas de monitoreo"
                >
                  <defs>
                    <marker id="ah" viewBox="0 0 10 7" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-secondary)" />
                    </marker>
                    <marker id="ah-active" viewBox="0 0 10 7" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-fill)" />
                    </marker>
                  </defs>

                  {arrowPaths.map((ann, idx) => (
                    <g
                      key={ann.id}
                      className="pointer-events-auto cursor-pointer"
                      onMouseEnter={() => handleAnnotationEnter(ann.id)}
                      onMouseLeave={handleAnnotationLeave}
                    >
                      {/* Invisible wide hit area */}
                      <path d={ann.path} fill="none" stroke="transparent" strokeWidth="16" />
                      {/* Visible arrow with draw-in animation */}
                      <path
                        d={ann.path}
                        fill="none"
                        stroke={highlightedId === ann.id ? "var(--accent-fill)" : "var(--text-secondary)"}
                        strokeWidth={highlightedId === ann.id ? "1.8" : "1.2"}
                        strokeLinecap="round"
                        markerEnd={highlightedId === ann.id ? "url(#ah-active)" : "url(#ah)"}
                        opacity={highlightedId === ann.id ? "0.9" : "0.45"}
                        style={{
                          transition: "all 0.3s ease",
                          strokeDasharray: reducedMotion ? "none" : "1000",
                          strokeDashoffset: arrowsDrawn ? "0" : "1000",
                          transitionProperty: "stroke-dashoffset, stroke, strokeWidth, opacity",
                          transitionDuration: reducedMotion ? "0s" : "0.8s, 0.3s, 0.3s, 0.3s",
                          transitionTimingFunction: "ease-out, ease, ease, ease",
                          transitionDelay: reducedMotion ? "0s" : `${idx * 0.15}s, 0s, 0s, 0s`,
                        }}
                      />
                    </g>
                  ))}
                </svg>
              )}

              {/* Left annotation labels */}
              {annotations.filter((a) => a.labelSide === "left").map((ann, idx) => (
                <div
                  key={`lbl-${ann.id}`}
                  ref={annotationRefs[ann.id]}
                  className="absolute left-0 w-[150px] text-right cursor-pointer"
                  style={{
                    top: `${ann.labelYPct * 100}%`,
                    transform: "translateY(-50%)",
                    opacity: arrowsDrawn ? 1 : 0,
                    transition: reducedMotion ? "none" : `opacity 0.5s ease-out ${0.8 + idx * 0.15}s`,
                  }}
                  onMouseEnter={() => handleAnnotationEnter(ann.id)}
                  onMouseLeave={handleAnnotationLeave}
                >
                  {ann.label.split("\n").map((line, i) => (
                    <span
                      key={i}
                      className={`block text-[12px] italic leading-snug transition-all duration-300 ${
                        highlightedId === ann.id ? "text-[var(--accent-fill)] opacity-100" : "text-[var(--text-secondary)] opacity-70"
                      }`}
                      style={{ fontFamily: "var(--font-body), sans-serif" }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              ))}

              {/* Right annotation labels */}
              {annotations.filter((a) => a.labelSide === "right").map((ann, idx) => (
                <div
                  key={`lbl-${ann.id}`}
                  ref={annotationRefs[ann.id]}
                  className="absolute right-0 w-[150px] cursor-pointer"
                  style={{
                    top: `${ann.labelYPct * 100}%`,
                    transform: "translateY(-50%)",
                    opacity: arrowsDrawn ? 1 : 0,
                    transition: reducedMotion ? "none" : `opacity 0.5s ease-out ${0.8 + idx * 0.15}s`,
                  }}
                  onMouseEnter={() => handleAnnotationEnter(ann.id)}
                  onMouseLeave={handleAnnotationLeave}
                >
                  {ann.label.split("\n").map((line, i) => (
                    <span
                      key={i}
                      className={`block text-[12px] italic leading-snug transition-all duration-300 ${
                        highlightedId === ann.id ? "text-[var(--accent-fill)] opacity-100" : "text-[var(--text-secondary)] opacity-70"
                      }`}
                      style={{ fontFamily: "var(--font-body), sans-serif" }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              ))}

              {/* Cards in normal flow — measured via refs */}
              <DiagramCard
                highlightedId={highlightedId}
                onElementEnter={handleElementEnter}
                onElementLeave={handleElementLeave}
                refs={elementRefs}
              />
            </div>
          </section>
        )}

        {/* ─── Glossary Cards ─── */}
        <section className="pb-24">
          <p
            className="text-center text-kicker mb-8"
            style={{
              fontFamily: "var(--font-mono-stat), sans-serif",
              opacity: visibleCards.size > 0 ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease-out",
            }}
          >
            Términos clave
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {glossaryData.map((entry) => (
              <div key={entry.id} data-glossary-id={entry.id}>
                <GlossaryCard
                  entry={entry}
                  isVisible={visibleCards.has(entry.id)}
                  isHighlighted={highlightedCardId === entry.id}
                  onMouseEnter={() => handleCardEnter(entry.id)}
                  onMouseLeave={handleCardLeave}
                  reducedMotion={reducedMotion}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="text-center py-12 border-t border-[var(--border-subtle)]/40">
          <p className="text-kicker mb-6" style={{ fontFamily: "var(--font-mono-stat), sans-serif" }}>
            © 2026 FlareField
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150" style={{ fontFamily: "var(--font-body), sans-serif" }}>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver al mapa
          </Link>
        </footer>
      </main>
    </div>
    </>
  );
}
