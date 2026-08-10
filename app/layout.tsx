import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Cormorant_Garamond } from 'next/font/google';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-wordmark',
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
      data-theme="dark"
      className={`h-full antialiased ${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
