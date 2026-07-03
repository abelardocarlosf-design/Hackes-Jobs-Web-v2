import Image from 'next/image';

/**
 * Testimonios de clientes con atribución completa.
 *
 * [PENDIENTE Abelardo]: llenar `nombre`, `cargo` y `empresa` de cada
 * testimonio real (y opcionalmente `logo`, ruta bajo /assets/clientes/).
 * Mientras esos campos estén vacíos, la tarjeta muestra la atribución
 * anónima actual (`contexto` · `sector`) — NO se inventan nombres.
 */
type Testimonial = {
  quote: string;
  /** [PENDIENTE: testimonio real] Nombre de la persona. */
  nombre: string;
  /** [PENDIENTE: testimonio real] Cargo de la persona. */
  cargo: string;
  /** [PENDIENTE: testimonio real] Empresa. */
  empresa: string;
  /** Opcional: ruta del logo de la empresa, ej. /assets/clientes/racarsa.png */
  logo?: string;
  /** Fallback anónimo mientras no hay atribución real. */
  contexto: string;
  sector: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Reducimos el ciclo de evaluación de candidatos operativos de 5 días a 24 horas con la Suite Psicométrica automatizada.',
    nombre: '', // [PENDIENTE: testimonio real]
    cargo: '', // [PENDIENTE: testimonio real]
    empresa: '', // [PENDIENTE: testimonio real]
    contexto: 'Operación industrial · Toluca',
    sector: 'Manufactura Tier 2',
  },
  {
    quote:
      'El flujo n8n de prospección B2B nos generó pipeline calificado sin sumar headcount al equipo comercial.',
    nombre: '', // [PENDIENTE: testimonio real]
    cargo: '', // [PENDIENTE: testimonio real]
    empresa: '', // [PENDIENTE: testimonio real]
    contexto: 'Equipo de ventas · CDMX',
    sector: 'Servicios industriales',
  },
];

export function Testimonials() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {TESTIMONIALS.map((t, i) => (
        <div key={i} className="card-premium p-8 space-y-6">
          <p className="text-lg text-slate-200 font-medium leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
          <div className="flex items-center gap-4">
            {t.logo && (
              <Image
                src={t.logo}
                alt={`Logo de ${t.empresa}`}
                width={48}
                height={48}
                className="rounded-lg bg-white object-contain p-1"
              />
            )}
            <div>
              {t.nombre ? (
                <>
                  <div className="font-bold text-white text-sm">{t.nombre}</div>
                  <div className="text-slate-400 text-xs font-medium mt-0.5">
                    {t.cargo}
                    {t.cargo && t.empresa ? ' · ' : ''}
                    {t.empresa}
                  </div>
                </>
              ) : (
                <div className="font-bold text-white text-sm">{t.contexto}</div>
              )}
              <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.25em] mt-1">{t.sector}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
