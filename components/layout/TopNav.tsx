"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell } from "lucide-react";
import { BoltIcon } from "@/components/ui/Icons";

function NavLink({ href, pathname, label }: { href: string; pathname: string; label: string }) {
  const isActive = pathname === href;
  
  return (
    <Link href={href} className="relative">
      <motion.div
        className={`rounded-2xl border px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 ${
          isActive 
            ? 'border-[var(--primary)] bg-[#14161A]/90' 
            : 'border-white/8 bg-[#14161A]/90 hover:border-[rgba(201,162,39,0.18)]'
        }`}
      >
        <span
          className="text-xs font-bold uppercase tracking-[0.18em]"
          style={{
            color: isActive ? 'var(--primary)' : 'rgb(242 240 234 / 0.82)'
          }}
        >
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

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
      className="fixed left-1/2 top-3 z-50 w-[calc(100%-0.75rem)] max-w-fit -translate-x-1/2"
    >
      <div className="flex items-center gap-3">
        {/* Logo - burbuja separada */}
        <Link href="/" className="rounded-2xl border border-white/8 bg-[#14161A]/90 px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-[rgba(201,162,39,0.18)]">
          <div className="flex items-center gap-2.5">
            <BoltIcon className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text)]">FlareField</span>
          </div>
        </Link>

        {/* Links - burbujas separadas */}
        <div className="menu hidden items-center gap-2 md:flex">
          <NavLink href="/" pathname={pathname} label="Mapa" />
          <NavLink href="/reports" pathname={pathname} label="Reportes" />
          <NavLink href="/glossary" pathname={pathname} label="Glosario" />
        </div>

        {/* Ubicación + campana - burbujas separadas */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/8 bg-[#14161A]/90 px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <MapPin className="h-4 w-4 text-[var(--primary)]/80" />
            <span id="location-name" className="text-xs tracking-[0.12em] text-[var(--text)]/80">{locationName}</span>
          </div>
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-[#14161A]/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-[rgba(201,162,39,0.28)] hover:bg-[rgba(201,162,39,0.10)]"
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
