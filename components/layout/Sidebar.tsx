"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Panorama" },
  { href: "/my-zone", label: "Mi Zona" },
  { href: "/my-reports", label: "Reportes" },
  { href: "/glossary", label: "Glosario" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-low)] p-3 md:block">
      <p className="mb-3 px-2 text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)] [font-family:var(--font-label)]">
        Navegación
      </p>

      <nav className="flex flex-col gap-1">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[var(--radius-btn)] px-3 py-2 text-sm",
                active
                  ? "bg-[var(--color-primary)] text-[#fff8f6]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-surface)]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}