import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Work_Sans,
  DM_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
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
        cormorant.variable,
        workSans.variable,
        dmMono.variable,
        spaceGrotesk.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0"
        />
      </head>
      <body className="relative min-h-full overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}