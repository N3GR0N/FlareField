import Link from "next/link";
import { Menu, MapPin, Bell } from "lucide-react";
import { BoltIcon } from "@/components/ui/Icons";

export default function TopNav() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between px-4 z-50 topnav-custom" style={{ width: 'min(720px, calc(100% - 32px))', height: '48px' }}>
      <div className="flex items-center space-x-3">
        <Menu className="h-5 w-5 text-black/80" />
        <h1 className="text-base topnav-title flex items-center gap-2 topnav-text">
          <BoltIcon className="h-4 w-4 text-black/90" />
          FlareField
        </h1>
      </div>
      <div className="hidden md:flex items-center space-x-6 text-sm uppercase">
        <Link href="/" className="topnav-link hover:text-black/95 transition-colors">
          Mapa
        </Link>
        <Link href="/reports" className="topnav-link hover:text-black/95 transition-colors">
          Reportes
        </Link>
        <Link href="/glossary" className="topnav-link hover:text-black/95 transition-colors">
          Glosario
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-black/70" />
          <span id="location-name" className="topnav-text">Detectando...</span>
        </div>
        <button
          className="relative flex items-center justify-center h-9 w-9 rounded-full border border-black/10 bg-white/40 px-2 hover:bg-white/60 transition-colors"
          id="alert-bell"
          aria-label="Alertas"
        >
          <Bell className="h-5 w-5 text-black/80" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-alert-red text-xs font-bold">
            •
          </span>
        </button>
      </div>
    </nav>
  );
}