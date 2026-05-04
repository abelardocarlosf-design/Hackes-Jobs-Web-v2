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
    default: "Hacke's Jobs | Reclutamiento Inteligente y Atracción de Talento",
    template: "%s | Hacke's Jobs"
  },
  description: "Transformamos el reclutamiento con IA y psicometría avanzada. Encontramos al top 1% de talento para empresas que buscan escalar. Especialistas en Headhunting y Reclutamiento Masivo.",
  keywords: ["Reclutamiento", "Recursos Humanos", "Talento IT", "Headhunting México", "Psicometría DISC", "Atracción de Talento", "Hackes Jobs"],
  authors: [{ name: "Hacke's Jobs Team" }],
  creator: "Hacke's Jobs",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://hackesjobs.com.mx/",
    title: "Hacke's Jobs | Reclutamiento Inteligente",
    description: "Conectamos empresas con el mejor talento mediante tecnología y análisis profundo.",
    siteName: "Hacke's Jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hacke's Jobs | Reclutamiento Inteligente",
    description: "Encontramos al talento que tu empresa necesita para crecer.",
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
