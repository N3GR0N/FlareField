import TopNav from "@/components/layout/TopNav";

export default function ReportsPage() {
  return (
    <div className="relative min-h-screen text-[var(--text-primary)]">
      <TopNav />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="glass-card section-entrance mx-auto w-full max-w-md space-y-6 p-8 text-center">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            Mis Reportes
          </h1>
          <p className="text-glass-kicker">
            Próximamente
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 rounded-full border border-[var(--glass-border)]" />
            <div className="h-5 w-5 rounded-full border border-[var(--glass-border)]" />
            <div className="h-5 w-5 rounded-full border border-[var(--glass-border)]" />
          </div>
          <p className="mx-auto max-w-xs text-glass-body">
            Aquí podrás ver y gestionar tus reportes de eventos espaciales observados en tu zona.
          </p>
        </div>
      </main>
    </div>
  );
}
