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
      <div
        className="zone-ripple-tooltip pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-20 w-64 -translate-x-1/2 translate-y-2 scale-95 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:opacity-100"
        style={{
          background: "var(--background-100)",
          borderRadius: "var(--md-sys-shape-extra-large)",
          border: "1px solid var(--md-sys-color-outline-variant)",
          boxShadow: "var(--md-sys-elevation-3)",
          padding: "24px",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-title-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
              {zoneName}
            </div>
            <div className="mt-1 text-label-small" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
              {severityLabel}
            </div>
          </div>
          <div
            className="mt-0.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] whitespace-nowrap"
            style={{
              background: "var(--md-sys-color-surface-container)",
              borderColor: "var(--md-sys-color-outline-variant)",
              color: "var(--md-sys-color-on-surface-variant)",
              fontFamily: "var(--font-mono-stat), sans-serif",
            }}
          >
            {severity === "alta" ? "ALERTA" : "MEDIA"}
          </div>
        </div>
        <div className="md-divider my-3" />
        <div className="space-y-2 text-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
          <div>
            <span className="text-label-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
              Cobertura:
            </span>{" "}
            {coverageLine}
          </div>
          <div>
            <span className="text-label-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
              Sistemas:
            </span>{" "}
            {techPreview}
          </div>
        </div>
      </div>
    </div>
  );
}
