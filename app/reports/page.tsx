import TopNav from "@/components/layout/TopNav";

export default function ReportsPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <TopNav />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="glass-morphism p-8 max-w-md w-full space-y-6 text-center">
          <h1 className="text-3xl font-display tracking-tighter text-white">
            Mis Reportes
          </h1>
          <p className="text-label font-label text-xs uppercase text-white/70">
            Próximamente
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-8 w-8 border-2 border-primary rounded-full animate-pulse"></div>
            <div className="h-8 w-8 border-2 border-primary rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
            <div className="h-8 w-8 border-2 border-primary rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
          </div>
          <p className="text-label font-label text-xs text-white/60 max-w-xs">
            Aquí podrás ver y gestionar tus reportes de eventos espaciales observados en tu zona.
          </p>
        </div>
      </main>
    </div>
  );
}