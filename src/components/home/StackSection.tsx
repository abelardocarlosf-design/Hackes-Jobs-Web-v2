import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { GUTTER, STACK } from './home.data';

export function StackSection() {
  return (
    <section className="relative z-10 bg-brand-black py-24" aria-labelledby="stack-title">
      <div className={`container mx-auto max-w-6xl ${GUTTER}`}>
        <Reveal className="mb-14 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
            Infraestructura
          </span>
          <h2 id="stack-title" className="headline-editorial mt-4 text-4xl text-white sm:text-5xl">
            Tecnología que opera detrás de cada proceso.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            No vendemos software. Lo usamos. Tú recibes el resultado; nosotros operamos la
            infraestructura.
          </p>
        </Reveal>

        {/* Dos paneles en vez de un grid: así el divisor `.panel-row + .panel-row`
            sigue el orden visual y no le pinta borde superior al primero de la
            segunda columna. */}
        <div className="grid gap-6 md:grid-cols-2">
          {[STACK.slice(0, 3), STACK.slice(3)].map((group, gi) => (
            <RevealGroup key={gi} className="glass-panel rounded-2xl px-5 sm:px-6" stagger={0.07}>
              {group.map(({ icon: Icon, title, body }, i) => (
                <RevealItem key={title} className="panel-row">
                  <div className="flex gap-5 py-6">
                    <span className="pt-1 font-mono text-[11px] tracking-[0.15em] text-white/55">
                      {String(gi * 3 + i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2.5 text-base font-medium text-white sm:text-lg">
                        <Icon size={18} aria-hidden="true" className="text-white/45" />
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">{body}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          ))}
        </div>
      </div>
    </section>
  );
}
