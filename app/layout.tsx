import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
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
      className={`h-full antialiased ${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-text">{children}</body>
    </html>
  );
}
