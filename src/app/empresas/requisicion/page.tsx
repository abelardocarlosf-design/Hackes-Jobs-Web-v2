import { Metadata } from 'next';
import { RequisitionViews } from '@/components/QuickRequisitionForm';

export const metadata: Metadata = {
  title: 'Nueva Requisición de Talento | Hacke\'s Jobs Technologies',
  description: 'Inicia el proceso de reclutamiento compartiendo los detalles de tu vacante con nuestro equipo.',
};

export default function RequisicionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      {/* Background ambient overlays & tech dotgrid matching the B2B platform */}
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>
      
      <main className="flex-grow py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
        
        <div className="max-w-4xl mx-auto text-center mb-12 reveal-on-load">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[0.25em] uppercase mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse"></span>
            Reclutamiento inteligente & IA
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            Levanta tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue">Requisición Empresarial</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Déjanos los datos esenciales de tu vacante en menos de 2 minutos. El perfil completo lo levantamos contigo en una llamada de 30 minutos — respuesta en menos de 24 horas hábiles.
          </p>
        </div>

        <div className="reveal-on-load reveal-delay-200">
          <RequisitionViews />
        </div>
      </main>
    </div>
  );
}

