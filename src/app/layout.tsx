import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono, Unbounded, Manrope } from "next/font/google";
import { Providers } from "@/components/Providers";
import { LayoutChrome } from "@/components/LayoutChrome";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
// Mono real para los labels de dato (uppercase, tracking ancho): tomar prestada
// una sans para "parecer" mono aplana la jerarquía tipográfica.
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Pareja de la landing rediseñada: display ancho y geométrico para titulares,
// Manrope para el cuerpo. El resto del sitio sigue en Jakarta hasta migrar.
const display = Unbounded({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["300", "400", "500", "600"] });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#05060B",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Reclutamiento con IA y evaluación psicométrica | Hacke's Jobs Technologies",
    template: "%s | Hacke's Jobs Technologies"
  },
  description: "Agencia de reclutamiento en México operada con tecnología propia: filtrado con IA, evaluaciones psicométricas automatizadas, terna con evidencia y garantía de reposición de 10 días.",
  keywords: ["agencia de reclutamiento México", "reclutamiento con inteligencia artificial", "evaluaciones psicométricas", "reclutamiento industrial", "garantía de reposición", "reclutamiento automatizado", "Hacke's Jobs Technologies"],
  authors: [{ name: "Hacke's Jobs Technologies" }],
  creator: "Hacke's Jobs Technologies",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://hackesjobs.com.mx/",
    title: "Reclutamiento con IA y evaluación psicométrica | Hacke's Jobs Technologies",
    description: "Cubrimos vacantes en todo México con candidatos filtrados por IA y evaluados. Terna con evidencia y garantía de reposición de 10 días.",
    siteName: "Hacke's Jobs Technologies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reclutamiento con IA y evaluación psicométrica | Hacke's Jobs Technologies",
    description: "Cubrimos vacantes en todo México con candidatos filtrados por IA y evaluados. Terna con evidencia y garantía de reposición de 10 días.",
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
    <html lang="es" className={`scroll-smooth ${inter.variable} ${jakarta.variable} ${mono.variable} ${display.variable} ${body.variable}`} suppressHydrationWarning>
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
