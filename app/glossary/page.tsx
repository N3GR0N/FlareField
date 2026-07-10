import TopNav from "@/components/layout/TopNav";

export default function GlossaryPage() {
  return (
    <div className="page-shell relative min-h-screen text-[var(--color-primary)]">
      <TopNav />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="glass-morphism section-entrance mx-auto w-full max-w-md space-y-6 p-8 text-center">
          <h1 className="text-lg font-semibold text-[var(--color-primary)]">
            Glosario
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-muted)]">
            Próximamente
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 rounded-full border border-[var(--color-border)]" />
            <div className="h-5 w-5 rounded-full border border-[var(--color-border)]" />
            <div className="h-5 w-5 rounded-full border border-[var(--color-border)]" />
          </div>
          <p className="mx-auto max-w-xs text-[11px] leading-relaxed text-[var(--color-muted)]">
            Aquí encontrarás definiciones de términos relacionados con el clima espacial y la tecnología afectada.
          </p>
        </div>
      </main>
    </div>
  );
}
