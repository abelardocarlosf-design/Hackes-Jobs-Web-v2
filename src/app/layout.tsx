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
    default: "Infraestructura HR-Tech y Automatización B2B para Industria | Hacke's Jobs Technologies",
    template: "%s | Hacke's Jobs Technologies"
  },
  description: "Proveedor de infraestructura tecnológica para Recursos Humanos y ventas B2B. Plataforma de evaluaciones psicométricas y sistemas de prospección automatizada con n8n para empresas industriales Tier 1 y Tier 2 en Toluca, Lerma, Metepec y CDMX.",
  keywords: ["Infraestructura HR-Tech", "Evaluaciones psicométricas SaaS", "Automatización B2B", "n8n prospección", "Plataforma RRHH industrial", "Manufactura Tier 1", "Toluca", "Lerma", "Metepec", "CDMX", "Hacke's Jobs Technologies"],
  authors: [{ name: "Hacke's Jobs Technologies" }],
  creator: "Hacke's Jobs Technologies",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://hackesjobs.com.mx/",
    title: "Infraestructura HR-Tech y Automatización B2B para Industria | Hacke's Jobs Technologies",
    description: "Plataforma de evaluaciones psicométricas y sistemas de prospección B2B automatizada para empresas industriales en el corredor Toluca–Lerma–Metepec–CDMX.",
    siteName: "Hacke's Jobs Technologies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infraestructura HR-Tech y Automatización B2B | Hacke's Jobs Technologies",
    description: "Plataforma de psicometrías y prospección B2B automatizada para industria Tier 1 y Tier 2 en México.",
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
