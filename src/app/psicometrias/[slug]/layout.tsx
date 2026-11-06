import React from 'react';
import type { Metadata } from 'next';
import { testsConfig } from '@/lib/psicometriasConfig';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = testsConfig[params.slug];
  if (!t) return {};

  const precio = t.precio > 0 ? t.precioFormateado : 'gratis';
  return {
    title: `${t.nombre}: aplicación en línea`,
    description: `${t.descripcion} Duración: ${t.duracion}. Precio: ${precio}.`.slice(0, 160),
    alternates: { canonical: `/psicometrias/${t.slug}` },
    robots: { index: !t.comingSoon, follow: true },
  };
}

export default function PsicometriaLayout({
  children,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      {children}
    </>
  );
}
