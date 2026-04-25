import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
    jetbrainsMono.variable,
  ].join(" ");

  return (
    <html lang="es" className={fontVars} data-scroll-behavior="smooth">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
