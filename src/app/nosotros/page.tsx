import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Factory, Cpu, ShieldCheck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nosotros · Infraestructura HR-Tech y B2B',
  description: 'Hacke\'s Jobs Technologies es proveedor de infraestructura tecnológica para Recursos Humanos y ventas B2B, especializado en empresas industriales Tier 1 y Tier 2 del corredor Toluca–Lerma–Metepec–CDMX.',
};

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white pb-32 relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      <section className="pt-32 pb-16 md:pt-40 md:pb-20 text-white relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange"></span>
              Sobre Hacke's Jobs Technologies
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Construimos la <span className="text-brand-orange">infraestructura</span> que opera detrás de los equipos de RRHH y ventas industriales.
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              No somos una agencia de reclutamiento ni una consultora de procesos. Somos una empresa de software que despliega y mantiene sistemas automatizados para evaluación de candidatos y prospección B2B en plantas Tier 1 y Tier 2 del corredor industrial Toluca–Lerma–Metepec–CDMX.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-premium p-8 space-y-4">
              <Factory className="text-brand-orange" size={28} />
              <h2 className="text-2xl font-black text-white tracking-tight">Por qué la industria</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Las plantas industriales tienen volúmenes, rotación y exigencias de compliance que ninguna plataforma genérica de RRHH atiende bien. Nosotros diseñamos para esa realidad: evaluaciones que escalan, flujos n8n que se conectan a la nómina y al ATS, reporting que las direcciones de operaciones realmente leen.
              </p>
            </div>

            <div className="card-premium p-8 space-y-4">
              <Cpu className="text-brand-blue" size={28} />
              <h2 className="text-2xl font-black text-white tracking-tight">Cómo trabajamos</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Cada despliegue empieza con un diagnóstico de procesos. No empujamos features que no se usan. Configuramos n8n, Stripe, Pinecone y los modelos de IA sobre el stack del cliente, y nos quedamos como operadores técnicos del sistema mientras dure el contrato.
              </p>
            </div>
          </div>

          <div className="card-premium p-10 md:p-14 space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Qué nos hace distintos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <MapPin className="text-brand-orange" size={22} />
                <h3 className="font-bold text-white">Foco geográfico</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Conocemos el corredor industrial mexiquense y CDMX porque operamos dentro de él, no remoto.</p>
              </div>
              <div className="space-y-3">
                <ShieldCheck className="text-brand-orange" size={22} />
                <h3 className="font-bold text-white">Compliance real</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Arquitectura multi-tenant, cifrado TLS 1.3 y AES-256, políticas LFPDPPP documentadas.</p>
              </div>
              <div className="space-y-3">
                <Cpu className="text-brand-orange" size={22} />
                <h3 className="font-bold text-white">Stack abierto</h3>
                <p className="text-slate-400 text-sm leading-relaxed">n8n, PostgreSQL, Pinecone, Next.js. Nada propietario opaco. Si quieres revisarlo, lo enseñamos.</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">¿Operas en la industria mexicana?</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">Conversemos. 30 minutos para entender tu operación y decir si te servimos o no.</p>
            <Link href="/contacto">
              <Button variant="secondary" size="xl">Hablar con el equipo</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
