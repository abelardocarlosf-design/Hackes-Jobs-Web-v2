import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { waUrl } from '@/lib/contact';

function LinkedinIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: 'Contacto · Hablemos de tu operación',
  description: 'Contacta a Hacke\'s Jobs Technologies para agendar un diagnóstico técnico de tus flujos de RRHH y ventas B2B. Atendemos el corredor industrial Toluca–Lerma–Metepec–CDMX.',
};

export default function ContactoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white pb-32 relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      <section className="pt-32 pb-16 md:pt-40 md:pb-20 text-white relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange"></span>
              Contacto
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Hablemos sobre tu <span className="text-brand-orange">operación</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              30 minutos para mapear tus flujos de RRHH y ventas, y decir qué se automatiza primero. Sin compromiso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="mailto:abelardo.carlos@hackesjobs.com.mx"
              className="card-premium p-8 space-y-4 group"
            >
              <Mail className="text-brand-orange" size={28} />
              <h2 className="text-xl font-black text-white tracking-tight">Correo directo</h2>
              <p className="text-slate-400 font-medium text-sm">
                Para propuestas comerciales, RFPs y diagnósticos técnicos.
              </p>
              <p className="text-white font-bold group-hover:text-brand-orange transition-colors break-all">
                abelardo.carlos@hackesjobs.com.mx
              </p>
            </a>

            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="card-premium p-8 space-y-4 group"
            >
              <MessageCircle className="text-brand-orange" size={28} />
              <h2 className="text-xl font-black text-white tracking-tight">WhatsApp comercial</h2>
              <p className="text-slate-400 font-medium text-sm">
                Para consultas rápidas sobre productos y demos.
              </p>
              <p className="text-white font-bold group-hover:text-brand-orange transition-colors">
                Iniciar conversación →
              </p>
            </a>

            <a
              href="https://www.linkedin.com/in/abelardo-carlos-flores/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-premium card-premium-blue p-8 space-y-4 group"
            >
              <LinkedinIcon className="text-brand-blue" size={28} />
              <h2 className="text-xl font-black text-white tracking-tight">LinkedIn</h2>
              <p className="text-slate-400 font-medium text-sm">
                Conecta con el equipo fundador.
              </p>
              <p className="text-white font-bold group-hover:text-brand-blue transition-colors">
                Ver perfil →
              </p>
            </a>

            <div className="card-premium p-8 space-y-4">
              <MapPin className="text-brand-blue" size={28} />
              <h2 className="text-xl font-black text-white tracking-tight">Cobertura</h2>
              <p className="text-slate-400 font-medium text-sm">
                Atendemos presencialmente el corredor industrial:
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Toluca', 'Lerma', 'Metepec', 'CDMX'].map((z) => (
                  <span key={z} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold">{z}</span>
                ))}
              </div>
              <p className="text-slate-500 text-xs">
                Onboarding remoto disponible para el resto del país.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/empresas/requisicion"
              className="inline-flex items-center text-brand-orange font-bold hover:underline underline-offset-4 transition-colors"
            >
              ¿Prefieres empezar con una requisición? Crea una aquí →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
