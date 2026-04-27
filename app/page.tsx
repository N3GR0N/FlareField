"use client";

import Link from "next/link";
import { useI18n } from "@/src/i18n/useI18n";

const featureItems = [
  {
    icon: "public",
    titleKey: "landing.feature.global_map.title",
    bodyKey: "landing.feature.global_map.body",
  },
  {
    icon: "monitoring",
    titleKey: "landing.feature.kp.title",
    bodyKey: "landing.feature.kp.body",
  },
  {
    icon: "description",
    titleKey: "landing.feature.reports.title",
    bodyKey: "landing.feature.reports.body",
  },
] as const;

const metrics = [
  { value: "Kp 5.1", labelKey: "landing.current_index" },
  { value: "67%", labelKey: "landing.storm_probability" },
  { value: "3", labelKey: "landing.active_regions" },
  { value: "24/7", labelKey: "landing.monitoring" },
] as const;

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <header className="border-b border-[var(--border-card)]">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8 py-4">
          <Link href="/" className="text-[1.5rem] italic [font-family:var(--font-display)] text-[#C4612A]">
            FlareField
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm [font-family:var(--font-display)]">
            <a href="#features" className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">{t("landing.features")}</a>
            <a href="#editorial" className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">{t("landing.research")}</a>
            <a href="#" className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">{t("landing.glossary")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="inline-flex h-10 items-center rounded-[var(--radius)] border border-[var(--outline)] px-4 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[var(--on-surface-variant)]">
              {t("landing.cta_enter")}
            </Link>
            <Link href="/dashboard" className="inline-flex h-10 items-center rounded-[var(--radius)] bg-[#C4612A] px-4 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[var(--on-primary)]">
              {t("landing.cta_start")}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8 py-[var(--space-xl)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-[48px] leading-[1.1] font-light [font-family:var(--font-display)]">
              {t("landing.hero_title_1")}
              <br />
              {t("landing.hero_title_2")}
              <br />
              <em className="italic text-[var(--primary)]">{t("landing.hero_title_3")}</em>
            </h1>
            <p className="max-w-[560px] text-[18px] leading-[1.6] [font-family:var(--font-body)] text-[var(--on-surface-variant)]">
              {t("landing.hero_body")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="inline-flex h-11 items-center rounded-[var(--radius)] bg-[#C4612A] px-5 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[var(--on-primary)]">
                {t("landing.cta_open")}
              </Link>
              <a href="#features" className="inline-flex h-11 items-center rounded-[var(--radius)] border border-[var(--outline)] px-5 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[var(--on-surface-variant)]">
                {t("landing.cta_explore")}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 border border-[var(--border-card)] rounded-[var(--radius-lg)] bg-[var(--surface-container-low)] p-5">
            <svg viewBox="0 0 520 360" className="w-full h-auto" role="img" aria-label="Solar orbital diagram">
              <circle cx="260" cy="180" r="118" fill="none" stroke="#231915" strokeWidth="1.2" opacity="0.5" />
              <circle cx="260" cy="180" r="86" fill="none" stroke="#C4612A" strokeWidth="1.2" opacity="0.6" />
              <ellipse cx="260" cy="180" rx="170" ry="88" fill="none" stroke="#231915" strokeWidth="1" opacity="0.35" />
              <path d="M95 190 C160 120, 360 120, 425 190" fill="none" stroke="#231915" strokeWidth="1" opacity="0.5" />
              <path d="M95 170 C160 240, 360 240, 425 170" fill="none" stroke="#C4612A" strokeWidth="1" opacity="0.5" />
              <circle cx="260" cy="180" r="16" fill="none" stroke="#C4612A" strokeWidth="1.4" />
              <circle cx="340" cy="116" r="5" fill="none" stroke="#231915" strokeWidth="1.2" />
              <circle cx="188" cy="248" r="4" fill="none" stroke="#231915" strokeWidth="1.2" />
              <circle cx="395" cy="174" r="3" fill="none" stroke="#C4612A" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-card)] bg-[var(--surface-container)]">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 md:grid-cols-4 px-4 md:px-6 lg:px-8">
          {metrics.map((metric, index) => (
            <div key={metric.label} className={`py-6 ${index < metrics.length - 1 ? "border-r border-[var(--border-card)]" : ""}`}>
              <p className="text-[26px] [font-family:var(--font-mono)] text-[var(--primary)]">{metric.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)] text-[var(--on-surface-variant)]">{t(metric.labelKey as never)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8 py-[var(--space-lg)] space-y-8">
        <h2 className="text-[32px] leading-[1.2] [font-family:var(--font-display)]">{t("landing.platform_features")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featureItems.map((feature) => (
            <article key={feature.titleKey} className="rounded-[var(--radius-lg)] border border-[var(--border-card)] bg-[var(--surface-container-low)] p-5">
              <span className="material-symbols-outlined text-[24px] text-[var(--primary)]">{feature.icon}</span>
              <h3 className="mt-4 text-[24px] leading-[1.3] [font-family:var(--font-display)]">{t(feature.titleKey as never)}</h3>
              <p className="mt-3 text-[16px] leading-[1.5] [font-family:var(--font-body)] text-[var(--on-surface-variant)]">{t(feature.bodyKey as never)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="editorial" className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8 py-[var(--space-lg)]">
        <div className="border-t border-[var(--border-card)] pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <blockquote className="lg:col-span-5 text-[32px] leading-[1.2] [font-family:var(--font-display)]">"{t("landing.editorial.quote")}"</blockquote>
          <div className="lg:col-span-7 space-y-4 text-[16px] leading-[1.6] [font-family:var(--font-body)] text-[var(--on-surface-variant)]">
            <p>{t("landing.editorial.p1")}</p>
            <p>{t("landing.editorial.p2")}</p>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 lg:px-8 py-8">
          <p className="text-[1.25rem] italic [font-family:var(--font-display)]">FlareField</p>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)]">
            <a href="#features">{t("landing.features")}</a>
            <a href="#editorial">{t("landing.research")}</a>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          <p className="text-xs uppercase tracking-[0.08em] [font-family:var(--font-label)]">{t("landing.footer_copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
