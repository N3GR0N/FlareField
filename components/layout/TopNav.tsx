"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-zone", label: "Mi Zona" },
  { href: "/my-reports", label: "Reportes" },
  { href: "/glossary", label: "Glosario" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-low)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-medium [font-family:var(--font-display)]">
          FlareField
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[var(--radius-btn)] px-3 py-2 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)]",
                  active
                    ? "bg-[var(--color-primary)] text-[#fff8f6]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}