import { ReactNode } from "react";

interface GlassCardProps {
  className?: string;
  children: ReactNode;
  dark?: boolean;
}

export default function GlassCard({
  className = "",
  children,
  dark = false,
}: GlassCardProps) {
  return (
    <div className={`glass-morphism ${dark ? "glass-morphism-dark" : ""} ${className}`}>
      {children}
    </div>
  );
}