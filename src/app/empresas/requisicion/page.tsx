import { Metadata } from 'next';
import { RequisitionWizard } from '@/components/RequisitionWizard';

export const metadata: Metadata = {
  title: 'Nueva Requisición de Talento | Hacke\'s Jobs',
  description: 'Inicia el proceso de reclutamiento compartiendo los detalles de tu vacante con nuestro equipo.',
};

export default function RequisicionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      <main className="flex-grow py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-slate-200/50 to-transparent -z-10 rounded-b-[100px]"></div>
        
        <div className="max-w-4xl mx-auto text-center mb-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-brand-black tracking-tight mb-4">
            Inicia tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Búsqueda de Talento</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Completa este formulario para que nuestros especialistas entiendan exactamente qué perfil necesitas y comiencen la búsqueda de inmediato.
          </p>
        </div>

        <div className="animate-in zoom-in-95 fade-in duration-700 delay-150">
          <RequisitionWizard />
        </div>
      </main>
    </div>
  );
}
