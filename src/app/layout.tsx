import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { LayoutChrome } from "@/components/LayoutChrome";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Reclutamiento Toluca y Headhunting CDMX | Hacke's Jobs",
    template: "%s | Hacke's Jobs"
  },
  description: "Agencia de reclutamiento en Toluca y headhunting en CDMX. Usamos IA y psicometría avanzada para encontrar el top 1% de talento. ¡Contrata el mejor equipo hoy!",
  keywords: ["Reclutamiento Toluca", "Headhunting CDMX", "Psicometrias Toluca", "Agencia de reclutamiento", "Selección de personal", "Talento IT", "Recursos Humanos", "IA", "Psicometría avanzada", "Hacke's Jobs"],
  authors: [{ name: "Hacke's Jobs Team" }],
  creator: "Hacke's Jobs",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://hackesjobs.com.mx/",
    title: "Reclutamiento Toluca y Headhunting CDMX | Hacke's Jobs",
    description: "Encontramos al top 1% de talento en Toluca y CDMX con IA y psicometría avanzada. ¡Escala tu empresa hoy!",
    siteName: "Hacke's Jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reclutamiento Toluca y Headhunting CDMX | Hacke's Jobs",
    description: "Expertos en Headhunting CDMX y Reclutamiento Toluca. Top 1% de talento con IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable} ${jakarta.variable}`}>
      <body className="antialiased font-sans bg-brand-black text-white overflow-x-hidden">
        <Providers>
          <LayoutChrome>
            {children}
          </LayoutChrome>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
