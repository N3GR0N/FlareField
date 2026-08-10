"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Map } from "lucide-react";

const tabs = [
  { href: "/", label: "Mapa", icon: "map" },
  { href: "/reports", label: "Reportes", icon: "description" },
  { href: "/glossary", label: "Glosario", icon: "menu_book" },
];

const tabIcons: Record<string, typeof Map> = {
  map: Map,
  description: FileText,
  menu_book: BookOpen,
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "var(--bg-surface-2)",
        borderTop: "1px solid var(--border-subtle)",
      }}
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const TabIcon = tabIcons[tab.icon];
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
                  style={{ background: "var(--accent-bg)" }}
                />
              )}
              <TabIcon
                size={24}
                fill={isActive ? "currentColor" : "none"}
                className="relative z-10 transition-colors duration-200"
                style={{
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              />
              <span
                className="text-[12px] font-medium relative z-10 transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-mono-stat), sans-serif",
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
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
