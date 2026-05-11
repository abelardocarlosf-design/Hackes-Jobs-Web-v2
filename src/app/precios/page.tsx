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
            Precios transparentes. <span className="text-brand-orange">En MXN.</span>
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Dos líneas de producto independientes: tests psicométricos individuales y suscripciones a la plataforma con automatización B2B incluida.
          </p>
        </div>

        {error && (
          <div className="mb-12 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-4 max-w-2xl mx-auto">
            <ShieldAlert size={24} />
            <p className="font-bold text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* PRODUCTO A — SUITE PSICOMÉTRICA */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange flex items-center justify-center">
              <Brain size={22} />
            </div>
            <div>
              <span className="text-brand-orange font-bold tracking-[0.25em] uppercase text-[10px]">Producto A</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Suite Psicométrica · Pago por test</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-premium p-8 flex flex-col">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-3">Nivel Intermedio</p>
              <h3 className="text-xl font-black text-white tracking-tight mb-4">Tests operativos</h3>
              <div className="text-5xl font-black text-white tracking-tight mb-2">$349<span className="text-base text-slate-400 font-medium ml-2">MXN</span></div>
              <p className="text-xs text-slate-500 mb-8">Por test individual</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Moss (Habilidades Gerenciales)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Zavic (Valores e Intereses)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Reporte PDF al cierre</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Cobro inmediato vía Stripe</li>
              </ul>
              <Link href="/psicometrias">
                <Button variant="outline" className="w-full border-white/20 text-white hover:border-brand-orange hover:text-brand-orange h-12 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5">
                  Ver tests intermedios
                </Button>
              </Link>
            </Card>

            <Card className="card-premium p-8 flex flex-col">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-3">Nivel Avanzado</p>
              <h3 className="text-xl font-black text-white tracking-tight mb-4">Tests cognitivos</h3>
              <div className="text-5xl font-black text-white tracking-tight mb-2">$519<span className="text-base text-slate-400 font-medium ml-2">MXN</span></div>
              <p className="text-xs text-slate-500 mb-8">Por test individual</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Terman-Merrill (Inteligencia)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Raven (Razonamiento abstracto)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Kostick (Personalidad laboral)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Reporte ejecutivo PDF</li>
              </ul>
              <Link href="/psicometrias">
                <Button variant="outline" className="w-full border-white/20 text-white hover:border-brand-orange hover:text-brand-orange h-12 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5">
                  Ver tests avanzados
                </Button>
              </Link>
            </Card>

            <Card className="card-premium p-8 flex flex-col">
              <p className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.25em] mb-3">Nivel Clínico</p>
              <h3 className="text-xl font-black text-white tracking-tight mb-4">Tests premium</h3>
              <div className="text-5xl font-black text-white tracking-tight mb-2">$867<span className="text-base text-slate-400 font-medium ml-2">MXN</span></div>
              <p className="text-xs text-slate-500 mb-8">Por test individual</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> MMPI (567 ítems clínicos)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> 16PF (Cattell)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Análisis clínico profundo</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Recomendado para puestos críticos</li>
              </ul>
              <Link href="/psicometrias">
                <Button variant="outline" className="w-full border-white/20 text-white hover:border-brand-orange hover:text-brand-orange h-12 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5">
                  Ver tests premium
                </Button>
              </Link>
            </Card>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Tests del Nivel Básico (DISC, Lüscher, Allport) disponibles sin costo en el <Link href="/psicometrias" className="text-brand-orange hover:underline">catálogo</Link>.
          </p>
        </section>

        {/* PRODUCTO B — PLATAFORMA + AUTOMATIZACIÓN B2B */}
        <section>
          <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center justify-center">
              <Workflow size={22} />
            </div>
            <div>
              <span className="text-brand-blue font-bold tracking-[0.25em] uppercase text-[10px]">Producto B</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Plataforma · Suscripción mensual con n8n</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            <Card className="card-premium p-10 flex flex-col relative border-2 border-brand-blue bg-brand-blue/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-[0.25em] rounded-full whitespace-nowrap">
                Recomendado
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-1 mt-2">Plan Growth</h3>
              <p className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.25em] mb-6">Pymes · Posiciones operativas y técnicas</p>
              <div className="text-5xl font-black text-white tracking-tight mb-2">
                $9,799<span className="text-base text-slate-300 font-medium ml-2">MXN</span>
              </div>
              <p className="text-xs text-slate-400 mb-8">Proyecto completo · IVA no incluido</p>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-white">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> Proceso End-to-End para 3 candidatos (Operativos, Técnicos o Administrativos)</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> Publicación activa en bolsas de empleo especializadas</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" /> Garantía de Continuidad Operativa (Reposición de 10 días naturales)</li>
              </ul>
              <Button
                variant="primary"
                className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${isSuccess === 'starter' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : ''}`}
                disabled={isLoading !== null || isSuccess === 'starter'}
                onClick={() => handleCheckout('starter')}
              >
                {isLoading === 'starter' ? 'Procesando...' : isSuccess === 'starter' ? '¡Solicitud enviada!' : 'Activar Plan Growth'}
              </Button>
            </Card>

            <Card className="card-premium p-10 flex flex-col">
              <h3 className="text-2xl font-black text-white tracking-tight mb-1">Enterprise</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-6">Operaciones industriales Tier 1</p>
              <div className="text-5xl font-black text-white tracking-tight mb-2">A medida</div>
              <p className="text-xs text-slate-500 mb-8">Contrato anual + SLA</p>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" /> Todo lo del Plan Growth</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" /> Workflows n8n ilimitados</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" /> SSO SAML 2.0 + API access</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" /> Infraestructura dedicada</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" /> Key Account Manager</li>
              </ul>
              <Link href="/contacto">
                <Button variant="secondary" className="w-full h-14 rounded-xl font-bold uppercase tracking-widest text-xs">
                  Hablar con ventas <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </Card>
          </div>

          <p className="text-center text-xs text-slate-500 mt-10 max-w-2xl mx-auto">
            El Plan Growth se factura en MXN con CFDI 4.0 disponible. La suscripción Enterprise se procesa en USD por nuestra pasarela. Para facturación en MXN con CFDI 4.0, contáctanos en el plan Enterprise.
          </p>
        </section>
      </div>
    </div>
  );
}
