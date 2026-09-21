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

// Solo clientes reales con asset en public/assets/clientes/.
// [PENDIENTE Abelardo]: agregar Truper, Sirga y Zorro cuando existan sus logos.
const CLIENTS: Client[] = [
  { slug: 'aura-academy', name: 'Aura Academy' },
  { slug: 'goncalves', name: 'Goncalves de México' },
  { slug: 'prisma-industrial', name: 'Prisma Industrial' },
  { slug: 'racarsa', name: 'Racarsa' },
];

function LogoCard({ slug, name }: Client) {
  return (
    <div className="client-card" aria-label={name}>
      <picture>
        <source srcSet={`/assets/clientes/${slug}.avif`} type="image/avif" />
        <source srcSet={`/assets/clientes/${slug}.webp`} type="image/webp" />
        <Image
          src={`/assets/clientes/${slug}.png`}
          alt={`Logo de ${name}, cliente de Hacke's Jobs`}
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
          <span className="hj-eyebrow">Casos reales</span>
          <h2 id="clientes-title" className="hj-display text-3xl text-white md:text-5xl">
            Empresas que confían en nosotros.
          </h2>
          <p className="text-base text-hj-muted md:text-lg">
            Manufactura, servicios y academias profesionales en México.
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
