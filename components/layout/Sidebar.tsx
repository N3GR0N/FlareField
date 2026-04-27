"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/src/i18n/useI18n";
import {
  BookOpen,
  Compass,
  FileText,
  LocateFixed,
  LogOut,
  Settings,
} from "lucide-react";
import type { TranslationKey } from "@/src/i18n/translations";

const links = [
  { href: "/dashboard", key: "nav.observatory", icon: Compass },
  { href: "/my-zone", key: "nav.my_zone", icon: LocateFixed },
  { href: "/my-reports", key: "nav.reports", icon: FileText },
  { href: "/glossary", key: "nav.glossary", icon: BookOpen },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-[var(--border-card)] bg-[var(--surface-container-low)] px-3 py-5 flex-col">
      <div className="mb-6 rounded-lg border border-[var(--border-card)] bg-[var(--surface-container)] p-4">
        <p className="text-xl leading-tight [font-family:var(--font-display)] text-[var(--on-surface)]">
          Aster Vega
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[#8A7E78]">
          Space Weather Analyst
        </p>
      </div>

      <p className="mb-3 px-3 text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium [font-family:var(--font-label)]">
        Observatory
      </p>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] transition-colors duration-200 border border-transparent",
                active
                  ? "text-[var(--primary)] border-l-4 border-l-[#C4612A] bg-[#EDE8DC]"
                  : "text-[var(--on-surface-variant)] hover:bg-[#F2EDE4]"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              <span className="font-semibold">{t(item.key as TranslationKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-border)]/30 pt-4 space-y-3">
        <button className="w-full px-3 py-2 text-xs uppercase tracking-[0.06em] rounded-lg text-[var(--color-text-muted)] border border-[var(--border-card)] bg-[var(--surface-container)] hover:text-[var(--color-text)] transition-colors [font-family:var(--font-label)] inline-flex items-center justify-center gap-2">
          <Settings className="h-3.5 w-3.5" strokeWidth={1.8} />
          {t("nav.settings")}
        </button>
        <button className="w-full px-3 py-2 text-xs uppercase tracking-[0.06em] rounded-lg text-[var(--color-text-muted)] border border-[var(--border-card)] bg-[var(--surface-container)] hover:text-[var(--color-text)] transition-colors [font-family:var(--font-label)] inline-flex items-center justify-center gap-2">
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
          {t("nav.sign_out")}
        </button>
      </div>
    </aside>
  );
}