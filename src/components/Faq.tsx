import { ChevronDown } from 'lucide-react';

/**
 * FAQ de conversión para /empresas. Respuestas redactadas únicamente con
 * datos ya publicados en el sitio (/precios, /empresas, home).
 */
const FAQS = [
  {
    q: '¿Cómo cobran?',
    a: 'Precio cerrado por proyecto, en MXN y sin letras chiquitas: el Plan Growth cuesta $9,799 MXN (IVA no incluido) e incluye hasta 3 posiciones trabajadas de forma simultánea o consecutiva. El detalle completo está en la página de precios.',
  },
  {
    q: '¿Qué incluye la garantía de 10 días?',
    a: 'Si el candidato contratado no se adapta o no continúa dentro de los primeros 10 días naturales, lo reemplazamos sin costo adicional. La garantía está escrita en el contrato — no depende de discusiones caso por caso.',
  },
  {
    q: '¿En cuánto tiempo entregan la terna?',
    a: 'Respondemos tu requisición en menos de 24 horas hábiles y cerramos el proceso completo en 7 a 10 días: te entregamos los 3 mejores candidatos con su reporte de compatibilidad técnica y conductual.',
  },
  {
    q: '¿Qué evaluaciones aplican a los candidatos?',
    a: 'Cada finalista pasa por una batería psicométrica completa con scoring algorítmico: DISC, 16PF, Moss y Zavic. Recibes un reporte ejecutivo claro en PDF por candidato, no un test crudo.',
  },
  {
    q: '¿Facturan CFDI 4.0?',
    a: 'Sí. Facturación electrónica CFDI 4.0 inmediata, en MXN, con pago seguro. Cero fricción para tu equipo de administración.',
  },
  {
    q: '¿Qué zonas cubren?',
    a: 'El corredor industrial Toluca–Lerma–Metepec–CDMX, con foco en plantas Tier 1 y Tier 2: volúmenes altos, rotación operativa y evaluaciones en piso.',
  },
];

export function Faq() {
  return (
    <section className="relative py-24 border-t border-white/5" aria-labelledby="faq-title">
      <div className="container relative mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">Preguntas frecuentes</span>
          <h2 id="faq-title" className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Lo que nos preguntan antes de contratar.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <details key={i} className="group card-premium rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between gap-4 cursor-pointer select-none list-none p-6 [&::-webkit-details-marker]:hidden">
                <span className="text-white font-bold text-base md:text-lg tracking-tight">{item.q}</span>
                <ChevronDown size={18} className="text-brand-orange shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 -mt-1">
                <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
