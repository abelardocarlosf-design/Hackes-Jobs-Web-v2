import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { LayoutChrome } from "@/components/LayoutChrome";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
// Mono real para los labels de dato (uppercase, tracking ancho): tomar prestada
// una sans para "parecer" mono aplana la jerarquía tipográfica.
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Agencia de Reclutamiento Especializado en CDMX | Hacke's Jobs Technologies",
    template: "%s | Hacke's Jobs Technologies"
  },
  description: "Agencia de reclutamiento operada con tecnología propietaria para empresas en Ciudad de México y las principales plazas del país. Evaluaciones psicométricas automatizadas, terna evaluada en 7-10 días y garantía de reposición de 10 días.",
  keywords: ["agencia de reclutamiento CDMX", "reclutamiento especializado México", "evaluaciones psicométricas", "reclutamiento industrial", "headhunting México", "garantía de reposición", "reclutamiento con inteligencia artificial", "Hacke's Jobs Technologies"],
  authors: [{ name: "Hacke's Jobs Technologies" }],
  creator: "Hacke's Jobs Technologies",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://hackesjobs.com.mx/",
    title: "Agencia de Reclutamiento Especializado en CDMX | Hacke's Jobs Technologies",
    description: "Reclutamiento operado con tecnología propia para empresas en Ciudad de México y las principales plazas del país. Terna evaluada y garantía de reposición.",
    siteName: "Hacke's Jobs Technologies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agencia de Reclutamiento Especializado en CDMX | Hacke's Jobs Technologies",
    description: "Reclutamiento operado con tecnología propia para empresas en Ciudad de México y las principales plazas del país. Terna evaluada y garantía de reposición.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable} ${jakarta.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Sin JS, framer-motion nunca dispara su animación de entrada y los
            bloques se quedan en el opacity:0 que el SSR ya serializó — la página
            se vería vacía. Esto los devuelve a su estado final. */}
        {/* dangerouslySetInnerHTML y no un hijo de texto: React escaparía las
            comillas a &quot; y <style> es raw text — el selector quedaría roto. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: '[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}',
            }}
          />
        </noscript>
      </head>
      <body className="antialiased font-sans bg-brand-black text-slate-200 overflow-x-hidden transition-colors duration-300">
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
