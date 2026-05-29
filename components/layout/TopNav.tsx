import Link from "next/link";
import { MapPin, Bell } from "lucide-react";
import { BoltIcon } from "@/components/ui/Icons";

export default function TopNav({ locationName = "Detectando..." }: { locationName?: string }) {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 topnav-glass" style={{ width: 'fit-content', maxWidth: 'calc(100% - 32px)', height: '56px' }}>
      <div className="h-full flex items-center gap-6 px-5">
        <div className="flex items-center gap-5">
          <h1 className="text-base font-600 topnav-title flex items-center gap-2.5 tracking-tight">
            <BoltIcon className="h-5 w-5" />
            <span>FlareField</span>
          </h1>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="topnav-link transition-all duration-160 relative group text-xs uppercase font-600 tracking-wide">
              Mapa
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/reports" className="topnav-link transition-all duration-160 relative group text-xs uppercase font-600 tracking-wide">
              Reportes
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/glossary" className="topnav-link transition-all duration-160 relative group text-xs uppercase font-600 tracking-wide">
              Glosario
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 text-xs topnav-text transition-colors duration-160">
            <MapPin className="h-4 w-4 topnav-icon" />
            <span id="location-name" className="topnav-text font-500 tracking-tight">{locationName}</span>
          </div>
          <button
            className="topnav-bell relative flex items-center justify-center h-9 w-9 rounded-lg border border-white/20 bg-white/5 hover:bg-white/12 active:scale-95 transition-all duration-200"
            id="alert-bell"
            aria-label="Alertas"
          >
            <Bell className="h-4 w-4 topnav-icon" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-alert-red text-xs font-bold animate-pulse">
              •
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
