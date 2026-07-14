"use client";

import { useRef, useEffect, useCallback, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import ThemeToggle from "@/components/ui/ThemeToggle";

function NavLink({ href, pathname, label }: { href: string; pathname: string; label: string }) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="relative flex items-center justify-center h-8 px-3 rounded-full transition-[background,color] duration-200"
      style={{
        background: isActive ? "var(--md-sys-color-secondary-container)" : "transparent",
        color: isActive ? "var(--md-sys-color-on-surface)" : "var(--md-sys-color-on-surface-variant)",
        fontFamily: "var(--font-mono-stat), sans-serif",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.03em",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

interface TopNavProps {
  locationName?: string;
  isNavOpen?: boolean;
  setIsNavOpen?: (open: boolean) => void;
}

export default function TopNav({ locationName = "Detectando...", isNavOpen = false, setIsNavOpen }: TopNavProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const toggle = useCallback(() => setIsNavOpen?.(!isNavOpen), [isNavOpen, setIsNavOpen]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    if (!content || !l1 || !l2 || !l3) return;

    const tl = gsap
      .timeline({ paused: true })
      .to(content, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }, 0)
      .to(l1, { rotation: 45, y: 6.5, duration: 0.25, ease: "power2.inOut" }, 0)
      .to(l2, { scaleX: 0, duration: 0.15, ease: "power2.in" }, 0)
      .to(l3, { rotation: -45, y: -6.5, duration: 0.25, ease: "power2.inOut" }, 0);

    tlRef.current = tl;
    return () => { tl.kill(); tlRef.current = null; };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (isNavOpen) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [isNavOpen]);

  return (
    <nav
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-3 md:px-5"
      style={{
        background: "var(--md-sys-color-surface)",
        borderBottom: "1px solid var(--md-sys-color-outline-variant)",
        boxShadow: "var(--md-sys-elevation-2)",
      }}
    >
      {/* Desktop: inline nav links */}
      {!isMobile && (
        <div className="flex items-center gap-0.5">
          <NavLink href="/" pathname={pathname} label="Mapa" />
          <NavLink href="/reports" pathname={pathname} label="Reportes" />
          <NavLink href="/glossary" pathname={pathname} label="Glosario" />
        </div>
      )}

      {/* Mobile: hamburger */}
      {isMobile && (
        <button
          onClick={toggle}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-[background] duration-200 hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-[0.97]"
          aria-label={isNavOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isNavOpen}
        >
          <span className="flex flex-col items-center justify-center gap-[4px]">
            <span ref={line1Ref} className="block h-[1.5px] w-4 rounded-full bg-[var(--md-sys-color-on-surface)]" />
            <span ref={line2Ref} className="block h-[1.5px] w-4 rounded-full bg-[var(--md-sys-color-on-surface)]" />
            <span ref={line3Ref} className="block h-[1.5px] w-4 rounded-full bg-[var(--md-sys-color-on-surface)]" />
          </span>
        </button>
      )}

      {/* Mobile: expanded menu */}
      {isMobile && (
        <div
          ref={contentRef}
          className="flex items-center gap-1.5 ml-1.5"
          style={{ opacity: 0, transform: "translateX(-8px)" }}
        >
          <NavLink href="/" pathname={pathname} label="Mapa" />
          <NavLink href="/reports" pathname={pathname} label="Reportes" />
          <NavLink href="/glossary" pathname={pathname} label="Glosario" />
        </div>
      )}

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1.5">
        <div className="hidden md:flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ color: "var(--md-sys-color-outline)" }}
          >
            location_on
          </span>
          <span
            className="text-label-small"
            style={{ color: "var(--md-sys-color-on-surface-variant)" }}
          >
            {locationName}
          </span>
        </div>
        <ThemeToggle />
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-full transition-[background] duration-200 hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-[0.97]"
          aria-label="Alertas"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ color: "var(--md-sys-color-on-surface)" }}
          >
            notifications
          </span>
          <span
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
            style={{ background: "var(--md-sys-color-error)" }}
          />
        </button>
      </div>
    </nav>
  );
}
