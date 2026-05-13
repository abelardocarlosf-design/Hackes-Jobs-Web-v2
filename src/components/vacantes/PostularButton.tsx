'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

/**
 * CTA "Postularme" — ejecuta un POST a un webhook (n8n) con la info de la vacante.
 *
 * Comportamiento:
 *  - Loading state mientras la petición está en vuelo.
 *  - Si n8n devuelve `{ redirect: "https://wa.me/..." }`, el navegador navega a esa URL
 *    (caso de uso: derivar al candidato a WhatsApp o Telegram desde el flujo).
 *  - Si no, muestra estado "success" con mensaje de confirmación.
 *
 * Configuración:
 *  - URL del webhook: `NEXT_PUBLIC_VACANTES_WEBHOOK_URL` o el default abajo.
 */

const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_VACANTES_WEBHOOK_URL ||
  'https://hackesjobs-n8n.3hrktu.easypanel.host/webhook/postulacion-vacante';

interface Props {
  vacanteId: string;
  vacanteTitulo: string;
  vacanteEmpresa: string;
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export function PostularButton({ vacanteId, vacanteTitulo, vacanteEmpresa }: Props) {
  const [state, setState] = useState<State>({ kind: 'idle' });

  const handleClick = async () => {
    if (state.kind === 'loading') return;
    setState({ kind: 'loading' });

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vacante_id: vacanteId,
          vacante_titulo: vacanteTitulo,
          vacante_empresa: vacanteEmpresa,
          source: 'vacante_detail_page',
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);

      const data = await res.json().catch(() => null);

      // Si n8n devuelve una URL de redirección (ej. WhatsApp), llévalo allá.
      if (data && typeof data.redirect === 'string' && /^https?:\/\//.test(data.redirect)) {
        window.location.href = data.redirect;
        return;
      }

      setState({
        kind: 'success',
        message: data?.message || 'Tu interés fue registrado. Te contactaremos por correo o WhatsApp en las próximas horas.',
      });
    } catch (err) {
      console.error('[PostularButton]', err);
      setState({
        kind: 'error',
        message: 'No pudimos enviar tu interés. Intenta de nuevo o escríbenos directamente.',
      });
    }
  };

  if (state.kind === 'success') {
    return (
      <div className="space-y-4">
        <div className="card-premium p-6 flex gap-4 items-start border-emerald-500/20 bg-emerald-500/5">
          <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={22} />
          <div className="space-y-1">
            <p className="text-emerald-300 font-bold text-sm">¡Postulación registrada!</p>
            <p className="text-slate-300 text-sm leading-relaxed">{state.message}</p>
          </div>
        </div>
        <a
          href="https://wa.me/525650405218"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white/10 transition-colors"
        >
          <MessageCircle size={14} /> Hablar con un asesor por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={state.kind === 'loading'}
        className="w-full h-14 rounded-xl bg-brand-orange text-white text-[11px] font-black uppercase tracking-[0.3em] inline-flex items-center justify-center gap-2.5 btn-elev disabled:opacity-70 disabled:cursor-wait disabled:transform-none"
        aria-busy={state.kind === 'loading'}
      >
        {state.kind === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            Me interesa esta vacante <ArrowRight size={14} />
          </>
        )}
      </button>

      {state.kind === 'error' && (
        <div className="card-premium p-4 flex gap-3 items-start border-red-500/20 bg-red-500/5">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p className="text-red-300 text-xs leading-relaxed">{state.message}</p>
        </div>
      )}

      <p className="text-[10px] text-slate-500 leading-relaxed text-center">
        Al postularte, registramos tu interés y nuestro equipo te contactará por correo o WhatsApp.
      </p>
    </div>
  );
}
