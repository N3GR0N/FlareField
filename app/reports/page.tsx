import TopNav from "@/components/layout/TopNav";

export default function ReportsPage() {
  return (
    <div className="page-shell relative min-h-screen bg-background text-[var(--text)]">
      <TopNav />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="glass-morphism section-entrance mx-auto w-full max-w-md space-y-6 p-8 text-center">
          <h1 className="font-display text-4xl tracking-[-0.04em] text-[var(--text)]">
            Mis Reportes
          </h1>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--text-muted)]/75">
            Próximamente
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-8 w-8 rounded-full border border-[rgba(201,162,39,0.45)] animate-pulse"></div>
            <div className="h-8 w-8 rounded-full border border-[rgba(201,162,39,0.45)] animate-pulse" style={{ animationDelay: "200ms" }}></div>
            <div className="h-8 w-8 rounded-full border border-[rgba(201,162,39,0.45)] animate-pulse" style={{ animationDelay: "400ms" }}></div>
          </div>
          <p className="mx-auto max-w-xs text-xs leading-6 text-[var(--text-muted)]/70">
            Aquí podrás ver y gestionar tus reportes de eventos espaciales observados en tu zona.
          </p>
        </div>
      </main>
    </div>
  );
}