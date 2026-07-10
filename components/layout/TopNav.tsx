"use client";

import { useRef, useEffect, useCallback, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Bell } from "lucide-react";
import { gsap } from "gsap";
import { BoltIcon } from "@/components/ui/Icons";

function NavLink({ href, pathname, label }: { href: string; pathname: string; label: string }) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-[var(--radius-chip)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-[transform,background,color] duration-[160ms] ease-out-expo active:scale-[0.97] ${
        isActive
          ? "bg-[rgba(33,76,78,0.15)] text-white"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]"
      }`}
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

  const toggle = useCallback(() => setIsNavOpen?.(!isNavOpen), [isNavOpen, setIsNavOpen]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    if (!container || !content || !l1 || !l2 || !l3) return;

    const expandedWidth = Math.min(window.innerWidth * 0.9, 600);

    gsap.set(container, { width: 44, height: 44, borderRadius: "1rem" });
    gsap.set(content, { opacity: 0 });

    const tl = gsap
      .timeline({ paused: true })
      .to(
        container,
        {
          width: expandedWidth,
          height: 56,
          borderRadius: "var(--radius-glass)",
          duration: 0.35,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        content,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0.15,
      )
      .to(
        l1,
        { rotation: 45, y: 6.5, duration: 0.25, ease: "power2.inOut" },
        0,
      )
      .to(
        l2,
        { scaleX: 0, duration: 0.15, ease: "power2.in" },
        0,
      )
      .to(
        l3,
        { rotation: -45, y: -6.5, duration: 0.25, ease: "power2.inOut" },
        0,
      );

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (isNavOpen) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [isNavOpen]);

  const glassBase = "border border-white/10 bg-black/20 shadow-[var(--glass-shadow)] backdrop-blur-md";

  return (
    <div
      ref={containerRef}
      className={`fixed top-5 right-5 z-50 overflow-hidden ${glassBase}`}
    >
      <div
        ref={contentRef}
        className="flex h-full items-center gap-4 pl-3 pr-12"
        style={{ width: "min(90vw, 600px)" }}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-[opacity] duration-[160ms] ease-out-expo hover:opacity-80 active:scale-[0.97]"
        >
          <BoltIcon className="h-[18px] w-[18px] text-[var(--color-accent)]" />
          <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            FlareField
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          <NavLink href="/" pathname={pathname} label="Mapa" />
          <NavLink href="/reports" pathname={pathname} label="Reportes" />
          <NavLink href="/glossary" pathname={pathname} label="Glosario" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-5">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="text-glass-label">{locationName}</span>
          </div>
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-chip)] border border-[var(--glass-border)] transition-[transform,background] duration-[160ms] ease-out-expo hover:bg-[rgba(255,255,255,0.04)] active:scale-[0.97]"
            aria-label="Alertas"
          >
            <Bell className="h-3.5 w-3.5 text-[var(--text-primary)]" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          </button>
        </div>
      </div>

      <button
        onClick={toggle}
        className="absolute top-0 right-0 z-10 flex h-11 w-11 items-center justify-center transition-[background] duration-[160ms] ease-out-expo hover:bg-[rgba(255,255,255,0.04)] active:scale-[0.97]"
        aria-label={isNavOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isNavOpen}
      >
        <span className="flex flex-col items-center justify-center gap-[5px]">
          <span ref={line1Ref} className="block h-[1.5px] w-4 rounded-full bg-[var(--text-primary)]" />
          <span ref={line2Ref} className="block h-[1.5px] w-4 rounded-full bg-[var(--text-primary)]" />
          <span ref={line3Ref} className="block h-[1.5px] w-4 rounded-full bg-[var(--text-primary)]" />
        </span>
      </button>
    </div>
  );
}
