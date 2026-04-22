import type { Metadata } from "next";
import {
  Newsreader,
  Work_Sans,
  DM_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-label",
});

export const metadata: Metadata = {
  title: "FlareField",
  description: "Monitoreo editorial de clima espacial y actividad solar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={[
        newsreader.variable,
        workSans.variable,
        dmMono.variable,
        spaceGrotesk.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}