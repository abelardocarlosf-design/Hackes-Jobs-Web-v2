import type { Metadata } from 'next';

import { ScrollProgress } from '@/components/motion';
import { ClientsMarquee } from '@/components/brand/ClientsMarquee';
import { HeroSection } from '@/components/home/HeroSection';
import { ProcesoSection } from '@/components/home/ProcesoSection';
import { CoberturaSection } from '@/components/home/CoberturaSection';
import { KpisSection } from '@/components/home/KpisSection';
import { StackSection } from '@/components/home/StackSection';
import { CandidatosSection } from '@/components/home/CandidatosSection';
import { CierreSection } from '@/components/home/CierreSection';

/**
 * Home.
 *
 * Es un Server Component: no queda un solo hook en este nivel desde que el
 * fondo del hero dejó de necesitar un `ref` compartido entre secciones. Las
 * piezas interactivas (`Reveal`, `Magnetic`, `CountUp`, `TiltCard`, el motor
 * del hero, el mapa) son islas cliente con su propia directiva.
 *
 * A cambio, la ruta puede declarar su propia `metadata` — antes heredaba la del
 * layout raíz y no tenía canonical propio.
 *
 * Orden de secciones: la prueba (cobertura, cifras, clientes) va por delante de
 * la infraestructura. El prospecto que llega de campaña en frío necesita creer
 * antes de que le interese el stack.
 */

export const metadata: Metadata = {
  title: 'Agencia de Reclutamiento Especializado en CDMX | Hacke\'s Jobs Technologies',
  description:
    'Agencia de reclutamiento operada con tecnología propia para empresas en Ciudad de México y las principales plazas del país. Terna evaluada con psicometrías en 7–10 días y garantía de reposición de 10 días.',
  alternates: { canonical: '/' },
  openGraph: {
    url: 'https://hackesjobs.com.mx/',
    title: 'Agencia de Reclutamiento Especializado en CDMX | Hacke\'s Jobs Technologies',
    description:
      'Terna evaluada con psicometrías en 7–10 días y garantía de reposición de 10 días. Ciudad de México y principales plazas del país.',
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden font-sans selection:bg-brand-orange/40 selection:text-white">
      <ScrollProgress />

      {/* Overlays fijos de página. El hero ya no compite con ellos: su fondo
          vive dentro de la propia sección, bajo un `isolate`. */}
      <div className="page-overlay" />
      <div className="page-dotgrid" />

      <HeroSection />
      <ProcesoSection />
      <CoberturaSection />
      <KpisSection />
      <ClientsMarquee />
      <StackSection />
      <CandidatosSection />
      <CierreSection />
    </div>
  );
}
