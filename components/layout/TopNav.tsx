"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

function NavLink({
  href, pathname, label
}: {
  href: string; pathname: string; label: string
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider transition-[background,color] duration-200 ${
        isActive
          ? 'bg-[var(--primary-700)] dark:bg-[var(--primary-300)] text-[var(--primary-50)] dark:text-[var(--primary-950)]'
          : 'text-[var(--primary-300)] dark:text-[var(--primary-700)]'
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

interface TopNavProps {
  locationName?: string;
  isNavOpen?: boolean;
  setIsNavOpen?: (open: boolean) => void;
}

export default function TopNav({ locationName, isNavOpen: isNavOpenProp, setIsNavOpen: setIsNavOpenProp }: TopNavProps) {
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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCompact = isScrolled && !isNavOpen;

  return (
    <div className="fixed top-0 left-0 w-full z-[100]" style={{ height: 0 }}>
      <div className="absolute top-5 left-1/2 -translate-x-1/2">
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
            animate={{
              padding: isCompact
                ? '6px 20px 6px 20px'
                : '8px 24px 10px 24px',
            }}
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
                className="text-[var(--primary-200)] dark:text-[var(--primary-800)]"
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
            <div className="max-[900px]:hidden w-px h-4 shrink-0 bg-[var(--primary-300)]/30 dark:bg-[var(--primary-700)]/30" />

            {/* Nav links — desktop only */}
            <div className="max-[900px]:hidden flex items-center gap-1">
              <NavLink href="/" pathname={pathname} label="Mapa" />
              <NavLink href="/reports" pathname={pathname} label="Reportes" />
              <NavLink href="/glossary" pathname={pathname} label="Glosario" />
            </div>

            {/* Second separator — desktop only */}
            <div className="max-[900px]:hidden w-px h-4 shrink-0 bg-[var(--primary-300)]/30 dark:bg-[var(--primary-700)]/30" />

            {/* Mobile hamburger — centered in notch */}
            <button
              className="min-[901px]:hidden flex flex-1 items-center justify-center h-8 rounded-full transition-[background] duration-200 active:scale-[0.97] hover:bg-[var(--primary-800)] dark:hover:bg-[var(--primary-200)]"
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-label="Abrir menú"
            >
              <Menu size={18} className="text-[var(--primary-300)] dark:text-[var(--primary-700)]" />
            </button>

            {/* Right side */}
            <div className="flex items-center gap-1.5 ml-auto">
              <ThemeToggle />
              <button
                className="relative flex h-8 w-8 items-center justify-center rounded-full transition-[background] duration-200 active:scale-[0.97] hover:bg-[var(--primary-800)] dark:hover:bg-[var(--primary-200)]"
                aria-label="Alertas"
              >
                <Bell size={18} className="text-[var(--primary-300)] dark:text-[var(--primary-700)]" />
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
