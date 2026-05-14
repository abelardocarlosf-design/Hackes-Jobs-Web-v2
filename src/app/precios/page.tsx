'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CheckCircle2, ShieldAlert, Brain, Workflow, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PreciosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setIsLoading(planId);
    setError(null);
    setIsSuccess(null);

    try {
      if (planId === 'starter') {
        const res = await fetch('https://hackesjobs-n8n.3hrktu.easypanel.host/webhook/checkout-growth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Top-level fields for n8n workflow subject line
            nombre_paciente: 'Cliente Interesado',
            plan: 'Plan Growth',
            action: 'CHECKOUT_START',
            timestamp: new Date().toISOString(),
            source: 'pricing_page',
            // Sub-object for CRM data consistency
            datos_plan: {
              plan_id: 'starter',
              plan_nombre: 'Plan Growth',
              precio_mxn: 9799,
              moneda: 'MXN'
            }
          })
        });

        if (res.ok) {
          setIsSuccess('starter');
          setTimeout(() => router.push('/exito'), 1000);
        } else {
          throw new Error('Error al conectar con el servicio de activación.');
        }
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, isCredits: false })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Error al iniciar el pago');
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de pago');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de conexión con la pasarela de pagos.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden pt-32 pb-24">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      <div className="container relative mx-auto px-4 max-w-7xl z-10">

        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">Modelo comercial</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Precios transparentes. <span className="text-brand-orange">En MXN.</span> Sin letras chiquitas.
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Tenemos un servicio principal de reclutamiento, y una suite de pruebas psicométricas individuales para quien solo necesita aplicar un test puntual. Lo separamos así para que sepas exactamente qué estás comprando.
          </p>
        </div>

        {error && (
          <div className="mb-12 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-4 max-w-2xl mx-auto">
            <ShieldAlert size={24} />
            <p className="font-bold text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* BLOQUE PRINCIPAL — SERVICIO DE RECLUTAMIENTO */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-brand-blue text-white text-[11px] font-bold uppercase tracking-[0.25em] rounded-full whitespace-nowrap z-10 shadow-[0_4px_20px_rgba(30,64,175,0.5)]">
              NUESTRO SERVICIO INSIGNIA
            </div>
            
            <Card className="card-premium p-10 md:p-14 flex flex-col relative border-2 border-brand-blue bg-brand-blue/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">Plan Growth</h2>
                  <p className="text-lg text-brand-blue font-bold">Reclutamiento end-to-end para posiciones operativas, técnicas y administrativas.</p>
                  <div className="text-6xl md:text-7xl font-black text-white tracking-tight mt-8 mb-2">
                    $9,799<span className="text-xl md:text-2xl text-slate-400 font-medium ml-2">MXN</span>
                  </div>
                  <p className="text-sm text-slate-400">Proyecto completo · IVA no incluido · CFDI 4.0 disponible</p>
                </div>

                <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-6 mb-10 flex gap-4 items-start">
                  <ShieldAlert className="text-brand-orange shrink-0 mt-1" size={28} />
                  <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
                    <strong className="text-white">Garantía de reposición en 10 días naturales.</strong> Si el candidato contratado no se adapta o no continúa dentro de los primeros 10 días, lo reemplazamos sin costo adicional. La garantía está escrita en el contrato. No depende de discusiones.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-white text-lg border-b border-white/10 pb-3">Qué incluye:</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-200">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> <span><strong className="text-white">3 posiciones</strong> trabajadas de forma simultánea o consecutiva (operativas, técnicas o administrativas).</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> <span>Atracción activa y filtrado en bolsas de empleo, redes profesionales y nuestra base interna.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> <span><strong className="text-white">Batería psicométrica completa</strong> por candidato finalista: DISC, 16PF, Moss y Zavic.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> <span><strong className="text-white">Terna ejecutiva:</strong> 3 candidatos finales con reporte de compatibilidad técnica y conductual.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> <span>Acompañamiento humano: un responsable de cuenta asignado a tu proceso, no un chatbot.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> <span>Trazabilidad completa: cada etapa registrada, auditable y entregable como reporte final.</span></li>
                  </ul>
                </div>

                <div className="mt-10 bg-white/5 rounded-2xl p-6 text-center">
                  <p className="text-sm text-slate-300 font-medium">
                    <strong className="text-white">Ideal para:</strong> PYMEs industriales, plantas en arranque, equipos de RH que necesitan cubrir vacantes críticas con respaldo técnico — sin contratar headcount adicional ni gestionar múltiples proveedores.
                  </p>
                </div>

                <div className="mt-10 text-center space-y-4">
                  <Button
                    variant="primary"
                    className={`w-full max-w-md mx-auto h-16 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] ${isSuccess === 'starter' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-none' : ''}`}
                    disabled={isLoading !== null || isSuccess === 'starter'}
                    onClick={() => handleCheckout('starter')}
                  >
                    {isLoading === 'starter' ? 'Procesando...' : isSuccess === 'starter' ? '¡Solicitud enviada!' : 'Activar Plan Growth'}
                  </Button>
                  
                  <div className="block">
                    <Link href="/contacto" className="text-xs text-slate-400 hover:text-white underline underline-offset-4 font-medium transition-colors">
                      ¿Volumen mayor o necesidades específicas? Cotiza un proceso a medida →
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* SEPARADOR */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-20"></div>

        {/* BLOQUE COMPLEMENTARIO — SUITE PSICOMÉTRICA */}
        <section className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange flex items-center justify-center">
              <Brain size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Suite Psicométrica — Pago por test</h2>
            <p className="text-slate-400 font-medium leading-relaxed text-lg">
              Para psicólogos independientes, consultores de RH o empresas que ya tienen su proceso y solo necesitan aplicar una prueba específica. Cobro inmediato vía Stripe, resultado y reporte PDF al cierre. No es nuestro servicio principal — es un complemento de autoservicio sobre la misma infraestructura técnica.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="card-premium p-8 flex flex-col">
              <h3 className="text-xl font-black text-white tracking-tight mb-4">Tests operativos</h3>
              <div className="text-5xl font-black text-white tracking-tight mb-2">$349<span className="text-base text-slate-400 font-medium ml-2">MXN</span></div>
              <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Por test</p>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Moss (Habilidades Gerenciales)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Zavic (Valores e Intereses)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Reporte PDF automático</li>
              </ul>
            </Card>

            <Card className="card-premium p-8 flex flex-col">
              <h3 className="text-xl font-black text-white tracking-tight mb-4">Tests cognitivos</h3>
              <div className="text-5xl font-black text-white tracking-tight mb-2">$519<span className="text-base text-slate-400 font-medium ml-2">MXN</span></div>
              <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Por test</p>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Terman-Merrill (Inteligencia)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Raven (Razonamiento abstracto)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Kostick (Personalidad laboral)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Reporte ejecutivo PDF</li>
              </ul>
            </Card>

            <Card className="card-premium p-8 flex flex-col border border-brand-orange/20 bg-brand-orange/5">
              <h3 className="text-xl font-black text-white tracking-tight mb-4">Tests clínicos</h3>
              <div className="text-5xl font-black text-brand-orange tracking-tight mb-2">$867<span className="text-base text-slate-400 font-medium ml-2">MXN</span></div>
              <p className="text-xs text-brand-orange/60 mb-8 font-bold uppercase tracking-widest">Por test</p>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> MMPI-2 (567 ítems clínicos)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> 16PF (Cattell)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Análisis profundo con supervisión</li>
              </ul>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto mt-8 text-center space-y-6">
            <p className="text-xs text-slate-400 bg-white/5 border border-white/10 p-4 rounded-xl inline-block">
              <strong>Nota ética:</strong> Las pruebas de nivel clínico (MMPI-2 y 16PF) se entregan con interpretación validada por psicólogo titulado. Cumplimiento ético conforme a estándares profesionales mexicanos.
            </p>
            <div>
              <Link href="/psicometrias">
                <Button variant="outline" className="border-white/20 text-white hover:border-brand-orange hover:text-brand-orange h-12 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5 px-8">
                  Ver catálogo completo de tests
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* BANDA FINAL (FOOTER CTA) */}
        <section className="mt-20">
          <div className="max-w-4xl mx-auto bg-brand-blue/10 border border-brand-blue/20 rounded-3xl p-10 md:p-14 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">¿No sabes cuál opción te corresponde?</h3>
            <p className="text-slate-300 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
              Si necesitas cubrir vacantes con respaldo de agencia y garantía, es <strong className="text-white">Plan Growth</strong>. Si solo necesitas aplicar tests sueltos, es la <strong className="text-white">suite individual</strong>. Si tienes dudas, agenda 20 minutos con nosotros — sin compromiso.
            </p>
            <Link href="/empresas#proceso">
              <Button variant="primary" size="xl" className="h-14 rounded-xl px-10 font-bold uppercase tracking-widest text-xs btn-elev">
                Agendar diagnóstico
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
