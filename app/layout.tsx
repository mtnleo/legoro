import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Space_Grotesk, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEGORO — Ingeniería Eléctrica y Electromecánica | Mar del Plata",
  description:
    "Mediciones eléctricas, instalaciones, termografía y energía solar en Mar del Plata, Buenos Aires. Presupuesto técnico en 24hs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    inter.variable,
    plusJakartaSans.variable,
    spaceGrotesk.variable,
    outfit.variable,
  ].join(" ");

  return (
    <html lang="es" className={fontVars} data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          as="image"
          href="/City_Background.avif"
          type="image/avif"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen">
        {children}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
