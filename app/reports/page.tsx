import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";

export default function ReportsPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}>
      <TopNav />
      <BottomNav />
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 pb-20 md:pb-6">
        <div className="bubble-card bubble-enter mx-auto w-full max-w-md text-center">
          <div className="bubble-card-content space-y-6">
            <h1 className="text-title-large" style={{ color: "var(--text-primary)" }}>
              Mis Reportes
            </h1>
            <p className="text-kicker">
              Próximamente
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 rounded-full border" style={{ borderColor: "var(--border-subtle)" }} />
              <div className="h-5 w-5 rounded-full border" style={{ borderColor: "var(--border-subtle)" }} />
              <div className="h-5 w-5 rounded-full border" style={{ borderColor: "var(--border-subtle)" }} />
            </div>
            <p className="mx-auto max-w-xs text-body-medium" style={{ color: "var(--text-secondary)" }}>
              Aquí podrás ver y gestionar tus reportes de eventos espaciales observados en tu zona.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
