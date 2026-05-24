import { ReactNode } from "react";

interface PulseMarkerProps {
  className?: string;
  severity: "green" | "yellow" | "orange" | "red";
  size?: number; // in pixels, default 20
  children?: ReactNode; // optional content inside the pulse marker
}

export default function PulseMarker({
  className = "",
  severity,
  size = 20,
  children,
}: PulseMarkerProps) {
  // Map severity to color token
  const getSeverityColor = () => {
    switch (severity) {
      case "green": return "var(--alert-green)";
      case "yellow": return "var(--alert-yellow)";
      case "orange": return "var(--alert-orange)";
      case "red": return "var(--alert-red)";
      default: return "var(--alert-green)";
    }
  };

  // Determine animation speed based on severity
  const getAnimationDuration = () => {
    switch (severity) {
      case "red": return "1.5s";
      case "orange": return "2s";
      case "yellow": return "3s";
      default: return "2s";
    }
  };

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer pulsing ring */}
      <span
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          border: `2px solid ${getSeverityColor()}`,
          opacity: "0.5",
          animationDuration: getAnimationDuration(),
        }}
      />
      {/* Inner dot */}
      <span
        className="relative z-10 rounded-full"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          backgroundColor: getSeverityColor(),
        }}
      >
        {children}
      </span>
    </span>
  );
}