import { useState } from "react";

type ZoneMarkerSeverity = "media" | "alta";

interface ZoneMarkerProps {
  severity: ZoneMarkerSeverity;
  zoneName: string;
  severityLabel: string;
  coverageLine: string;
  techPreview: string;
  size?: number;
  className?: string;
}

export default function ZoneMarker({
  severity,
  zoneName,
  severityLabel,
  coverageLine,
  techPreview,
  size = 60,
  className = "",
}: ZoneMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const isOpen = hovered || pinned;

  return (
    <div
      className={`zone-ripple-marker group ${className}`}
      data-severity={severity}
      data-open={isOpen ? "true" : "false"}
      style={{ "--zone-area-size": `${size}px` } as React.CSSProperties}
      aria-label={zoneName}
      aria-expanded={isOpen}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => setPinned((value) => !value)}
    >
      <span className="zone-ripple-area" data-severity={severity} />
      <div className="zone-ripple-tooltip pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-20 w-60 -translate-x-1/2 translate-y-2 scale-95 px-4 py-3 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 md-card-elevated">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.26em] text-[var(--text-primary)]">
              {zoneName}
            </div>
            <div className="mt-1 text-[0.68rem] uppercase tracking-[0.28em] text-[var(--text-muted)]">
              {severityLabel}
            </div>
          </div>
          <div className="mt-0.5 rounded-full border border-[var(--md-outline-variant)] bg-[var(--md-surface-container)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--md-on-surface-variant)]">
            {severity === "alta" ? "ALERTA" : "MEDIA"}
          </div>
        </div>
        <div className="mt-3 space-y-1 text-[0.72rem] leading-5 text-[var(--text-muted)]">
          <div><span className="font-semibold text-[var(--text-primary)]">Cobertura:</span> <span className="text-[var(--text-muted)]">{coverageLine}</span></div>
          <div><span className="font-semibold text-[var(--text-primary)]">Sistemas:</span> <span className="text-[var(--text-muted)]">{techPreview}</span></div>
        </div>
      </div>
    </div>
  );
}
