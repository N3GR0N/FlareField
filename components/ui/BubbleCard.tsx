"use client";

import { ReactNode } from "react";

interface BubbleCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export default function BubbleCard({ children, className = "", delay = 0, onClick }: BubbleCardProps) {
  return (
    <div
      className={`bubble-card bubble-enter bubble-enter-delay-${delay} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className="bubble-card-content">
        {children}
      </div>
    </div>
  );
}
