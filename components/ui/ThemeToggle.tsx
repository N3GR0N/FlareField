"use client";

import { useCallback, useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("flarefield-theme") as "dark" | "light" | null;
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      return saved;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", initial);
    return initial;
  });

  useEffect(() => { setMounted(true); }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("flarefield-theme", next);
  }, [theme]);

  if (!mounted) {
    return (
      <button
        className="relative flex h-8 w-8 items-center justify-center rounded-full transition-[background] duration-200 ease-out-expo hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-[0.97]"
        aria-label="Toggle theme"
      />
    );
  }

  return (
    <button
      onClick={toggle}
      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-[background] duration-200 ease-out-expo hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-[0.97]"
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
    >
      <span
        className="material-symbols-outlined text-[18px] transition-transform duration-300"
        style={{
          color: "var(--md-sys-color-on-surface)",
          transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {theme === "dark" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
