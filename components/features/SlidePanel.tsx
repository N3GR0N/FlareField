"use client";

import { ReactNode, useEffect, useCallback } from "react";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function SlidePanel({ isOpen, onClose, title, children }: SlidePanelProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`slide-panel-backdrop ${isOpen ? "slide-panel-backdrop-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`slide-panel ${isOpen ? "slide-panel-open" : ""}`}
        role="dialog"
        aria-label={title || "Panel lateral"}
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between h-14 px-4"
          style={{
            background: "var(--md-sys-color-surface)",
            borderBottom: "1px solid var(--md-sys-color-outline-variant)",
          }}
        >
          {title && (
            <h2
              className="text-title-medium"
              style={{ color: "var(--md-sys-color-on-surface)" }}
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-[background] duration-200 hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-[0.97] ml-auto"
            aria-label="Cerrar panel"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ color: "var(--md-sys-color-on-surface)" }}
            >
              close
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-5">
          {children}
        </div>
      </aside>
    </>
  );
}
