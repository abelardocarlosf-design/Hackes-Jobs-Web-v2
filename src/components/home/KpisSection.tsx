import { Reveal, RevealGroup, RevealItem, CountUp } from '@/components/motion';
import { GUTTER, KPIS } from './home.data';

export function KpisSection() {
  return (
    <section
      className="relative z-10 border-b border-white/10 bg-[#0d1422] py-24"
      aria-labelledby="kpis-title"
    >
      <div className={`container mx-auto ${GUTTER}`}>
        <Reveal className="mb-12 max-w-2xl">
          {/* El eyebrow deja de ser naranja: el acento se reserva para el CTA
              primario y para los marcadores de dato. Repetido en cada eyebrow
              dejaba de señalar nada. */}
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
            Números de operación
          </span>
          <h2 id="kpis-title" className="headline-editorial mt-4 text-4xl text-white sm:text-5xl">
            Lo que ya pasó por aquí.
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
          {KPIS.map((s) => (
            <RevealItem
              key={s.label}
              className="group bg-[#0d1422] px-6 py-10 transition-colors duration-500 hover:bg-white/[0.03]"
            >
              <div className="kpi-num text-4xl font-semibold text-white transition-colors duration-500 group-hover:text-brand-orange md:text-5xl">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/55">
                {s.label}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
