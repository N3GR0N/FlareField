import { useState } from "react";

type ZoneMarkerSeverity = "media" | "alta";

interface ZoneMarkerProps {
  severity: ZoneMarkerSeverity;
  zoneName: string;
  severityLabel: string;
  coverageLine: string;
  techPreview: string;
  className?: string;
}

const SEVERITY_RGB: Record<ZoneMarkerSeverity, string> = {
  media: "183 122 67",
  alta: "168 95 74",
};

export default function ZoneMarker({
  severity,
  zoneName,
  severityLabel,
  coverageLine,
  techPreview,
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
      style={{
        "--zone-tone-rgb": SEVERITY_RGB[severity],
        "--zone-core-rgb": "201 162 39",
      } as React.CSSProperties & Record<string, string | number>}
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
      <span className="zone-ripple-ring" />
      <span className="zone-ripple-halo" />
      <span className="zone-ripple-core" />
      <div className="zone-ripple-tooltip pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-20 w-60 -translate-x-1/2 translate-y-2 scale-95 rounded-[18px] border border-white/10 bg-[rgba(11,13,15,0.84)] px-4 py-3 text-left shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 opacity-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.26em] text-[var(--text)]/92">
              {zoneName}
            </div>
            <div className="mt-1 text-[0.68rem] uppercase tracking-[0.28em] text-[var(--primary)]/88">
              {severityLabel}
            </div>
          </div>
          <div className="mt-0.5 rounded-full border border-[rgba(201,162,39,0.22)] bg-[rgba(201,162,39,0.08)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]/92">
            {severity === "alta" ? "ALERTA" : "MEDIA"}
          </div>
        </div>
        <div className="mt-3 space-y-1 text-[0.72rem] leading-5 text-[var(--text-muted)]/80">
          <div><span className="font-semibold text-[var(--text)]/88">Cobertura:</span> {coverageLine}</div>
          <div><span className="font-semibold text-[var(--text)]/88">Sistemas:</span> {techPreview}</div>
        </div>
      </div>
    </div>
  );
}