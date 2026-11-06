import type { Metadata } from 'next';

// La página es 'use client' y no puede exportar metadata propia; este layout
// de segmento fija el title/description/og:url canónicos de /precios.
export const metadata: Metadata = {
  title: 'Precios de reclutamiento industrial en MXN',
  description:
    'Plan Growth de reclutamiento end-to-end: 3 posiciones, batería psicométrica completa por finalista y garantía de reposición de 10 días naturales. Precios en MXN con CFDI 4.0.',
  alternates: {
    canonical: '/precios',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/precios',
    title: "Precios de Reclutamiento Industrial | Hacke's Jobs",
    description:
      'Reclutamiento end-to-end con garantía de reposición de 10 días naturales. Precios transparentes en MXN, facturación CFDI 4.0.',
    siteName: "Hacke's Jobs Technologies",
  },
};

export default function PreciosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
