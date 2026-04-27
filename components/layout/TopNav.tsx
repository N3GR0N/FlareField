"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/src/i18n/useI18n";

export default function TopNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const localizedLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/dashboard", label: t("nav.observatory") },
    { href: "/my-zone", label: t("nav.my_zone") },
    { href: "/my-reports", label: t("nav.reports") },
    { href: "/glossary", label: t("nav.glossary") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[var(--border-card)] bg-[var(--surface)]">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="text-[1.4rem] italic font-normal [font-family:var(--font-display)] text-[var(--primary)]">
          FlareField
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {localizedLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-2 py-1 text-sm [font-family:var(--font-display)] transition-colors duration-200",
                  active
                    ? "text-[var(--primary)] font-semibold"
                    : "text-[#8A7E78] hover:text-[var(--color-text)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-[var(--on-surface-variant)]">
          <button aria-label={t("nav.notifications")} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--surface-container-low)] hover:text-[var(--primary)]">
            <span className="material-symbols-outlined text-[18px] font-normal">notifications</span>
          </button>
          <button aria-label={t("nav.settings")} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--surface-container-low)] hover:text-[var(--primary)]">
            <span className="material-symbols-outlined text-[18px] font-normal">settings</span>
          </button>
          <button aria-label={t("nav.profile")} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--surface-container-low)] hover:text-[var(--primary)]">
            <span className="material-symbols-outlined text-[18px] font-normal">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}