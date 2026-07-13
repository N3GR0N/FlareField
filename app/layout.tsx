import type { Metadata } from "next";
import "./globals.css";
import { Rethink_Sans, Playfair_Display, Space_Grotesk, Cormorant_Garamond, Work_Sans, DM_Mono } from 'next/font/google';

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--font-sans',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-mono-stat',
  display: 'swap'
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap'
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap'
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "FlareField",
  description: "Space weather alert app for rural workers in Argentina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${rethinkSans.variable} ${playfair.variable} ${spaceGrotesk.variable} ${cormorant.variable} ${workSans.variable} ${dmMono.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-text">{children}</body>
    </html>
  );
}
