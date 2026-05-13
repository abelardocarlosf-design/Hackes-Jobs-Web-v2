/**
 * Infinite-scroll marquee of client logos.
 *
 * Renders a uniform white-card around each logo — works for both transparent
 * PNGs and white-background JPGs (per Hacke's Jobs spec: "containers uniformes
 * con fondo blanco" sobre fondo oscuro).
 *
 * The track contains the logo set twice; the keyframe translates -50%, so the
 * loop is seamless. Hover pauses the animation for inspection.
 */

import Image from 'next/image';

type Client = {
  slug: string;
  name: string;
};

const CLIENTS: Client[] = [
  { slug: 'aura-academy', name: 'Aura Academy' },
  { slug: 'goncalves', name: 'Goncalves de México' },
  { slug: 'prisma-industrial', name: 'Prisma Industrial' },
  { slug: 'racarsa', name: 'Racarsa' },
  { slug: 'sirga', name: 'Sirga' },
  { slug: 'truper', name: 'Truper' },
  { slug: 'zorro', name: 'Zorro' },
  { slug: 'nuevo-cliente-1', name: 'Nuevo Cliente 1' },
  { slug: 'nuevo-cliente-2', name: 'Nuevo Cliente 2' },
  { slug: 'nuevo-cliente-3', name: 'Nuevo Cliente 3' },
  { slug: 'nuevo-cliente-4', name: 'Nuevo Cliente 4' },
];

function LogoCard({ slug, name }: Client) {
  return (
    <div className="client-card" aria-label={name}>
      <picture>
        <source srcSet={`/assets/clientes/${slug}.avif`} type="image/avif" />
        <source srcSet={`/assets/clientes/${slug}.webp`} type="image/webp" />
        <Image
          src={`/assets/clientes/${slug}.png`}
          alt={name}
          width={140}
          height={56}
          loading="lazy"
          className="object-contain mix-blend-multiply"
        />
      </picture>
    </div>
  );
}

export function ClientsMarquee() {
  return (
    <section className="relative py-24 z-10" aria-labelledby="clientes-title">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-5">
          <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">
            Casos reales
          </span>
          <h2
            id="clientes-title"
            className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.05]"
          >
            Empresas que confían en nosotros.
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-medium">
            Operaciones reales en el corredor industrial mexicano y academias profesionales.
          </p>
        </div>

        <div className="marquee-viewport">
          <div className="marquee-track">
            {/* First pass */}
            <div className="marquee-set">
              {CLIENTS.map((c) => (
                <LogoCard key={`a-${c.slug}`} {...c} />
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="marquee-set">
              {CLIENTS.map((c) => (
                <LogoCard key={`b-${c.slug}`} {...c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
