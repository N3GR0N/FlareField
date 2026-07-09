"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, Bell } from "lucide-react";
import { BoltIcon } from "@/components/ui/Icons";

export default function TopNav({ locationName = "Detectando..." }: { locationName?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      data-scrolled={scrolled}
      className="topnav-shell fixed left-1/2 top-3 z-50 w-[calc(100%-0.75rem)] max-w-fit -translate-x-1/2"
    >
      <div className="topnav-glass flex items-center gap-3 px-1.5 py-1.5 md:gap-4 md:px-2 md:py-2">
        <Link href="/" className="topnav-brand-pill flex items-center gap-1.5 rounded-full px-2.5 py-1.5 md:px-3">
          <BoltIcon className="h-4 w-4 text-[var(--primary)]" />
          <span className="hidden text-[0.72rem] font-semibold uppercase tracking-[0.24em] md:inline">FlareField</span>
        </Link>

        <div className="menu hidden items-center gap-2 md:flex">
          <Link
            href="/"
            data-active={pathname === "/"}
            className="menu-item relative flex flex-col items-center rounded-full px-2.5 py-1.5 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--text)]/82 md:text-[13px]"
          >
            <span className="menu-item-label">Mapa</span>
          </Link>
          <Link
            href="/reports"
            data-active={pathname === "/reports"}
            className="menu-item relative flex flex-col items-center rounded-full px-2.5 py-1.5 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--text)]/82 md:text-[13px]"
          >
            <span className="menu-item-label">Reportes</span>
          </Link>
          <Link
            href="/glossary"
            data-active={pathname === "/glossary"}
            className="menu-item relative flex flex-col items-center rounded-full px-2.5 py-1.5 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--text)]/82 md:text-[13px]"
          >
            <span className="menu-item-label">Glosario</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--text)]/80">
            <MapPin className="h-4 w-4 text-[var(--primary)]/80" />
            <span id="location-name" className="tracking-[0.12em]">{locationName}</span>
          </div>
          <button
            className="topnav-bell relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-200 hover:border-[rgba(201,162,39,0.28)] hover:bg-[rgba(201,162,39,0.10)]"
            id="alert-bell"
            aria-label="Alertas"
          >
            <Bell className="h-4 w-4 text-[var(--text)]/85" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_0_3px_rgba(11,13,15,0.9)]" />
          </button>
        </div>
      </div>
    </nav>
  );
}
