import type { Metadata } from 'next';

// La página es 'use client' y no puede exportar metadata propia; este layout
// de segmento fija el title/description/og:url canónicos de /empresas.
export const metadata: Metadata = {
  title: 'Reclutamiento para Empresas en CDMX · Terna evaluada con garantía',
  description:
    'Servicio de reclutamiento para empresas en Ciudad de México y las principales plazas del país. Tú envías la vacante; entregamos terna evaluada con psicometrías en 7–10 días, con garantía de reposición de 10 días.',
  alternates: {
    canonical: 'https://hackesjobs.com.mx/empresas',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://hackesjobs.com.mx/empresas',
    title: "Reclutamiento para Empresas en CDMX | Hacke's Jobs Technologies",
    description:
      'Terna evaluada con psicometrías en 7–10 días y garantía de reposición de 10 días. Ciudad de México y principales plazas del país.',
    siteName: "Hacke's Jobs Technologies",
  },
};

export default function EmpresasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
