import type { Metadata } from 'next';
import { vacantesActivas, ubicacionesDisponibles } from '@/data/vacantes';
import { VacantesCatalog } from '@/components/vacantes/VacantesCatalog';

export const metadata: Metadata = {
  title: 'Vacantes activas · Industria y manufactura',
  description:
    'Catálogo de vacantes activas en el corredor industrial Toluca–Lerma–Metepec–CDMX. Posiciones operativas, técnicas, administrativas y gerenciales en plantas Tier 1 y Tier 2.',
  alternates: { canonical: '/vacantes' },
  openGraph: {
    title: 'Vacantes activas · Hacke\'s Jobs Technologies',
    description:
      'Posiciones operativas, técnicas, administrativas y gerenciales en empresas industriales del corredor mexiquense.',
    url: '/vacantes',
    type: 'website',
  },
};

export default function VacantesPage() {
  const activas = vacantesActivas();
  const ubicaciones = ubicacionesDisponibles();

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden pb-32">
      <div className="page-overlay" />
      <div className="page-dotgrid" />

      {/* HEADER */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 text-white relative z-10">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase">
            <span className="flex h-2 w-2 rounded-full bg-brand-orange" />
            Bolsa de trabajo · {activas.length} {activas.length === 1 ? 'vacante' : 'vacantes'} activas
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Encuentra tu próximo <span className="text-brand-orange">reto profesional</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Posiciones validadas en empresas industriales del corredor Toluca–Lerma–Metepec–CDMX. Procesos de selección transparentes y técnicos.
          </p>
        </div>
      </section>

      {/* CATALOG */}
      <section className="container relative mx-auto px-4 z-10">
        <VacantesCatalog vacantes={activas} ubicaciones={ubicaciones} />
      </section>
    </div>
  );
}
