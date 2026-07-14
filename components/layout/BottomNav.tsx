"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Mapa", icon: "map" },
  { href: "/reports", label: "Reportes", icon: "description" },
  { href: "/glossary", label: "Glosario", icon: "menu_book" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "var(--md-sys-color-surface-container)",
        borderTop: "1px solid var(--md-sys-color-outline-variant)",
      }}
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[48px] h-full relative"
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span
                  className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-6 rounded-full"
                  style={{ background: "var(--md-sys-color-secondary-container)" }}
                />
              )}
              <span
                className="material-symbols-outlined text-[24px] relative z-10 transition-colors duration-200"
                style={{
                  color: isActive
                    ? "var(--md-sys-color-on-surface)"
                    : "var(--md-sys-color-on-surface-variant)",
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[12px] font-medium relative z-10 transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-mono-stat), sans-serif",
                  color: isActive
                    ? "var(--md-sys-color-on-surface)"
                    : "var(--md-sys-color-on-surface-variant)",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
