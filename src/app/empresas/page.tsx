'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  ArrowRight,
  Workflow,
  Brain,
  Database,
  Plug,
  ShieldCheck,
  Factory,
  Clock,
  LineChart,
} from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function EmpresasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      <main className="flex-grow relative z-10">
        {/* 1. HERO */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase">
                <span className="flex h-2 w-2 rounded-full bg-brand-blue"></span>
                Para empresas industriales
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                Reclutamos por ti. <span className="text-brand-orange">Tú no tienes que aprender ningún software.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
                Hacke's Jobs Technologies es una agencia de reclutamiento que opera con tecnología propietaria. Tú nos entregas la requisición; nosotros entregamos la terna evaluada. Toda la automatización, los workflows y las integraciones corren de nuestro lado — no del tuyo.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/empresas/requisicion" className="w-full sm:w-auto">
                  <Button variant="primary" size="xl" className="w-full sm:w-auto btn-elev h-14 rounded-xl px-8 font-bold uppercase tracking-widest text-xs">
                    Solicitar reclutamiento
                  </Button>
                </Link>
                <WhatsAppButton 
                  label="Hablar con un consultor" 
                  variant="outline" 
                  className="w-full sm:w-auto border-white/20 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5 btn-elev h-14 rounded-xl px-8 font-bold uppercase tracking-widest text-xs" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. LA DIFERENCIA (Tabla comparativa) */}
        <section className="relative py-24 text-white border-y border-white/5 bg-[#0d1422]">
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
              <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">La diferencia</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Lo que una agencia normal hace en 3 semanas, nosotros lo hacemos en días.</h2>
              <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                La mayoría de las agencias de reclutamiento operan con hojas de cálculo, correos y procesos manuales. Eso explica los tiempos largos, la falta de visibilidad y los reportes inconsistentes. Nosotros construimos infraestructura interna para resolver exactamente eso — y tú recibes el beneficio sin tocar una sola interfaz.
              </p>
            </div>

            <div className="max-w-5xl mx-auto card-premium p-1 overflow-hidden">
              <div className="grid md:grid-cols-2 rounded-[1.4rem] overflow-hidden">
                <div className="bg-brand-black p-8 md:p-12 space-y-8">
                  <h3 className="font-bold text-slate-400 text-sm uppercase tracking-widest border-b border-white/10 pb-4">Lo que pasa en una agencia tradicional</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-red-500/50 mt-1.5 shrink-0" /><p className="text-slate-300 text-sm leading-relaxed">Filtrado manual de currículums durante días.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-red-500/50 mt-1.5 shrink-0" /><p className="text-slate-300 text-sm leading-relaxed">Psicometrías aplicadas en papel o por correo.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-red-500/50 mt-1.5 shrink-0" /><p className="text-slate-300 text-sm leading-relaxed">Seguimiento por WhatsApp manual y disperso.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-red-500/50 mt-1.5 shrink-0" /><p className="text-slate-300 text-sm leading-relaxed">Reporte final entregado como un PDF genérico.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-red-500/50 mt-1.5 shrink-0" /><p className="text-slate-300 text-sm leading-relaxed">Garantías ambiguas, "lo veremos caso por caso".</p></li>
                  </ul>
                </div>
                <div className="bg-brand-blue/10 p-8 md:p-12 space-y-8 border-t md:border-t-0 md:border-l border-white/5 relative">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-blue/20 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>
                  <h3 className="font-bold text-brand-blue text-sm uppercase tracking-widest border-b border-brand-blue/20 pb-4 relative z-10">Lo que pasa en Hacke's Jobs</h3>
                  <ul className="space-y-6 relative z-10">
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0 shadow-[0_0_8px_rgba(30,64,175,0.8)]" /><p className="text-white text-sm leading-relaxed font-medium">Filtrado automatizado con IA en horas.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0 shadow-[0_0_8px_rgba(30,64,175,0.8)]" /><p className="text-white text-sm leading-relaxed font-medium">Baterías digitales con scoring y reporte automático.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0 shadow-[0_0_8px_rgba(30,64,175,0.8)]" /><p className="text-white text-sm leading-relaxed font-medium">Flujos automatizados con trazabilidad completa.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0 shadow-[0_0_8px_rgba(30,64,175,0.8)]" /><p className="text-white text-sm leading-relaxed font-medium">Reporte ejecutivo de compatibilidad por candidato.</p></li>
                    <li className="flex items-start gap-4"><div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0 shadow-[0_0_8px_rgba(30,64,175,0.8)]" /><p className="text-white text-sm leading-relaxed font-medium">Garantía contractual de reposición en 10 días.</p></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SOLUCIÓN - PROCESO */}
        <section id="proceso" className="relative py-24">
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
              <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">Proceso visible</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Cuatro pasos. <span className="text-brand-orange">Todos los hacemos nosotros.</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                Tú participas donde aportas valor: definir el perfil y entrevistar finalistas. El resto lo orquestamos nosotros.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { step: "01", title: "Requisición", desc: "Levantamos contigo el perfil real del puesto: responsabilidades, indicadores de éxito, cultura del equipo. 30 minutos, una sola reunión." },
                { step: "02", title: "Atracción y filtrado", desc: "Activamos canales y aplicamos filtrado con IA contra el perfil definido. Tú no ves currículums irrelevantes." },
                { step: "03", title: "Evaluación psicométrica", desc: "A cada candidato preseleccionado le aplicamos la batería correspondiente. Los resultados se procesan automáticamente." },
                { step: "04", title: "Terna y entrevista", desc: "Te entregamos los 3 mejores candidatos con su reporte completo. Tú entrevistas, eliges y contratas. Damos seguimiento y honramos garantía." }
              ].map((p, i) => (
                <div key={i} className="card-premium p-6 space-y-3">
                  <div className="text-3xl font-black text-brand-orange/50 tracking-tight">{p.step}</div>
                  <h4 className="text-lg font-black text-white tracking-tight">{p.title}</h4>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. WORKFLOWS INTERNOS */}
        <section className="relative py-24 bg-brand-black border-y border-white/5">
          <div className="container relative mx-auto px-4">
            <div className="text-center mb-16 space-y-4 max-w-4xl mx-auto">
              <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">El motor detrás del servicio</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Workflows internos. Resultados externos. <span className="text-brand-blue">Tú no operas nada.</span></h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Cuando un cliente nos contrata, no le entregamos accesos, ni dashboards, ni manuales. Le entregamos candidatos. La infraestructura la operamos nosotros.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="card-premium p-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                  <Workflow size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Velocidad sin sacrificar rigor</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                  Procesos que tradicionalmente tardan 3 semanas los cerramos en 7–10 días. No porque saltemos pasos, sino porque los pasos están automatizados internamente.
                </p>
              </Card>

              <Card className="card-premium p-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                  <Brain size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Cero curva de aprendizaje</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                  Tu gerente de RH no tiene que aprender un nuevo software ni capacitar a su equipo. Recibe los reportes en PDF y el seguimiento por los canales que ya usa.
                </p>
              </Card>

              <Card className="card-premium p-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                  <LineChart size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Mejora continua que tú no pagas</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                  Cada vez que invertimos en una mejora interna — un modelo de IA más preciso, una batería actualizada — todos nuestros clientes la reciben automáticamente.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 5. FOCO INDUSTRIAL */}
        <section className="relative py-24">
          <div className="container relative mx-auto px-4 max-w-6xl">
            <div className="card-premium p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Factory className="text-brand-orange" size={36} />
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  Diseñado para plantas <span className="text-brand-orange">Tier 1 y Tier 2</span>.
                </h2>
                <p className="text-slate-300 text-lg font-medium leading-relaxed">
                  Nuestros flujos se ajustan a la realidad operativa del corredor industrial Toluca–Lerma–Metepec–CDMX: volúmenes altos, rotación operativa, evaluaciones en piso y compliance LFPDPPP.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Toluca', 'Lerma', 'Metepec', 'CDMX'].map((z) => (
                    <span key={z} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold">{z}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, t: 'Compliance', d: 'LFPDPPP · AES-256' },
                  { icon: Plug, t: 'Integración', d: 'CRM · ATS · Nómina' },
                  { icon: Database, t: 'Multi-tenant', d: 'Aislamiento por cliente' },
                  { icon: Clock, t: 'SLA', d: '7 días de despliegue' },
                ].map((b, i) => (
                  <div key={i} className="card-premium p-5 space-y-2">
                    <b.icon className="text-brand-blue" size={20} />
                    <div className="text-white font-bold text-sm">{b.t}</div>
                    <div className="text-slate-500 text-xs font-medium">{b.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. CASOS REALES */}
        <section className="relative py-24">
          <div className="container relative mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 space-y-4">
                <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">Casos de uso</span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Resultados medibles, no aspiracionales.</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { q: "Reducimos el ciclo de evaluación de candidatos operativos de 5 días a 24 horas con la Suite Psicométrica automatizada.", n: "Operación industrial · Toluca", p: "Manufactura Tier 2" },
                  { q: "El flujo n8n de prospección B2B nos generó pipeline calificado sin sumar headcount al equipo comercial.", n: "Equipo de ventas · CDMX", p: "Servicios industriales" }
                ].map((t, i) => (
                  <div key={i} className="card-premium p-8 space-y-6">
                    <p className="text-lg text-slate-200 font-medium leading-relaxed">"{t.q}"</p>
                    <div>
                      <div className="font-bold text-white text-sm">{t.n}</div>
                      <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.25em] mt-1">{t.p}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA */}
        <section className="relative py-28">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="container relative mx-auto px-4 max-w-4xl text-center space-y-8 z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">
              30 minutos para conocer tu operación.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
              Sin presentación de PowerPoint. Sin compromiso. Nos cuentas qué necesitas contratar y en qué tiempo; te decimos si podemos ayudarte, cómo y cuánto cuesta. Si no encajamos, te lo decimos en la misma llamada.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link href="/empresas/requisicion" className="w-full sm:w-auto">
                <Button variant="primary" size="xl" className="w-full sm:w-auto h-14 rounded-xl px-10 font-bold uppercase tracking-widest text-xs btn-elev shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  Agendar diagnóstico
                </Button>
              </Link>
              <Link href="/contacto" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5 h-14 rounded-xl px-10 font-bold uppercase tracking-widest text-xs btn-elev">
                  Hablar con un consultor
                </Button>
              </Link>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 pt-6">
              Cumplimiento LFPDPPP · Datos cifrados · Garantía de reposición de 10 días · Facturación CFDI 4.0 en MXN.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
