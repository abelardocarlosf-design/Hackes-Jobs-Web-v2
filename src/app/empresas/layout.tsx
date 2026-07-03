import type { Metadata } from 'next';

// La página es 'use client' y no puede exportar metadata propia; este layout
// de segmento fija el title/description/og:url canónicos de /empresas.
export const metadata: Metadata = {
  title: 'Reclutamiento Industrial para Empresas · Terna evaluada con garantía',
  description:
    'Servicio de reclutamiento para plantas Tier 1 y Tier 2 del corredor Toluca–Lerma–Metepec–CDMX. Tú envías la vacante; entregamos terna evaluada con psicometrías en 7–10 días, con garantía de reposición de 10 días.',
  alternates: {
    canonical: 'https://hackesjobs.com.mx/empresas',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://hackesjobs.com.mx/empresas',
    title: "Reclutamiento Industrial para Empresas | Hacke's Jobs Technologies",
    description:
      'Terna evaluada con psicometrías en 7–10 días y garantía de reposición de 10 días. Corredor Toluca–Lerma–Metepec–CDMX.',
    siteName: "Hacke's Jobs Technologies",
  },
};

export default function EmpresasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
