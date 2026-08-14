"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";

function NavLink({
  href, pathname, label
}: {
  href: string; pathname: string; label: string
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full px-3 min-h-11 text-xs font-semibold tracking-wider transition-[background,color] duration-200 ${
        isActive
          ? 'bg-[var(--accent-fill)] text-[var(--accent-fill-on)]'
          : 'text-[var(--text-secondary)]'
      }`}
      style={{
        fontFamily: "var(--font-mono-stat), sans-serif",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Mapa" },
  { href: "/reports", label: "Reportes" },
  { href: "/glossary", label: "Glosario" },
];

function DesktopNav({ pathname }: { pathname: string }) {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const activeHref =
    NAV_LINKS.find((link) =>
      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href),
    )?.href ?? null;

  const pillHref = hoveredHref ?? activeHref;

  return (
    <div
      className="max-[900px]:hidden flex items-center gap-1"
      onMouseLeave={() => setHoveredHref(null)}
    >
      {NAV_LINKS.map((link) => {
        const isActive = link.href === activeHref;
        const isPillTarget = pillHref === link.href;

        return (
          <div
            key={link.href}
            className="relative"
            onMouseEnter={() => setHoveredHref(link.href)}
          >
            {isPillTarget && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(255, 255, 255, 0.16)",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Link
              href={link.href}
              className={`relative z-10 inline-flex items-center rounded-full px-3 min-h-11 text-xs font-semibold tracking-wider transition-[color] duration-200 ${
                isPillTarget
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]"
              }`}
              style={{
                fontFamily: "var(--font-mono-stat), sans-serif",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

interface TopNavProps {
  locationName?: string;
  isNavOpen?: boolean;
  setIsNavOpen?: (open: boolean) => void;
}

export default function TopNav({ isNavOpen: isNavOpenProp, setIsNavOpen: setIsNavOpenProp }: TopNavProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [localNavOpen, setLocalNavOpen] = useState(false);
  const isNavOpen = isNavOpenProp ?? localNavOpen;
  const setIsNavOpen = setIsNavOpenProp ?? setLocalNavOpen;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[100]" style={{ height: 0 }}>
      <div className="absolute top-5 left-0 right-0 flex justify-center">
        <motion.nav
          className="notch-nav relative"
          style={{
            minWidth: isMobile ? 'auto' : '480px',
            width: 'min-content',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <motion.div
            className="relative flex items-center gap-3"
            initial={false}
            animate={{ padding: '6px 20px 6px 20px' }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
              mass: 0.9,
            }}
          >
            {/* FlareField wordmark — desktop only */}
            <Link href="/" className="max-[900px]:hidden flex items-center shrink-0">
              <span
                className="text-[var(--text-secondary)]"
                style={{
                  fontFamily: "var(--font-wordmark), 'Cormorant Garamond', Georgia, serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                FlareField
              </span>
            </Link>

            {/* Separator — desktop only */}
            <div className="max-[900px]:hidden w-px h-4 shrink-0 bg-[var(--border-strong)]" />

            {/* Nav links — desktop only */}
            <DesktopNav pathname={pathname} />

            {/* Second separator — desktop only */}
            <div className="max-[900px]:hidden w-px h-4 shrink-0 bg-[var(--border-strong)]" />

            {/* Mobile hamburger — centered in notch */}
            <button
              className="min-[901px]:hidden flex flex-1 items-center justify-center h-11 rounded-full transition-[background] duration-200 active:scale-[0.97] hover:bg-[var(--bg-surface-2)]"
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-label="Abrir menú"
            >
              <Menu size={18} className="text-[var(--text-secondary)]" />
            </button>

            {/* Right side */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                className="relative flex h-11 w-11 items-center justify-center rounded-full transition-[background] duration-200 active:scale-[0.97] hover:bg-[var(--bg-surface-2)]"
                aria-label="Alertas"
              >
                <Bell size={18} className="text-[var(--text-secondary)]" />
                <span
                  className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
                  style={{ background: 'var(--md-sys-color-error)' }}
                />
              </button>
            </div>
          </motion.div>

          {/* Mobile dropdown menu */}
          {isNavOpen && (
            <div className="min-[901px]:hidden mt-1 flex flex-col items-center gap-1 pb-3">
              <NavLink href="/" pathname={pathname} label="Mapa" />
              <NavLink href="/reports" pathname={pathname} label="Reportes" />
              <NavLink href="/glossary" pathname={pathname} label="Glosario" />
            </div>
          )}
        </motion.nav>
      </div>
    </div>
  );
}
