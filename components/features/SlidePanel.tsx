"use client";

import { ReactNode, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function SlidePanel({ isOpen, onClose, title, children }: SlidePanelProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;

    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement;
    const panel = panelRef.current;
    if (panel) panel.focus();

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      const previous = previousFocusRef.current;
      if (previous instanceof HTMLElement) previous.focus();
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
        ref={panelRef}
        tabIndex={-1}
        className={`slide-panel ${isOpen ? "slide-panel-open" : ""}`}
        role="dialog"
        aria-label={title || "Panel lateral"}
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between h-14 px-4"
          style={{
            background: "var(--bg-surface-1)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {title && (
            <h2
              className="text-title-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-[background] duration-200 hover:bg-[var(--bg-surface-3)] active:scale-[0.97] ml-auto"
            aria-label="Cerrar panel"
          >
            <X size={20} style={{ color: "var(--text-primary)" }} />
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