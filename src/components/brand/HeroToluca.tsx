/**
 * Cinematic Toluca background for the hero section.
 *
 * 4 photos crossfade on an 32s loop, each with its own Ken Burns
 * (slow zoom + pan) keyframe. Heavy dark gradient overlay ensures text
 * legibility regardless of which photo is active.
 *
 * Uses native HTML <picture> to completely bypass Next.js image optimization endpoint,
 * serving pre-optimized AVIF/WebP assets instantly in milliseconds.
 *
 * Employs responsive media queries to load lightweight resolutions (640/1280/1920)
 * depending on viewport size, saving bandwidth and optimizing LCP/FCP.
 *
 * Honors prefers-reduced-motion (in globals.css: animations off, layer-1 visible).
 */

const PHOTOS = [
  { slug: 'nevado-1', alt: 'Nevado de Toluca' },
  { slug: 'portales-1', alt: 'Portales de Toluca' },
  { slug: 'nevado-2', alt: 'Nevado de Toluca · vista alterna' },
  { slug: 'portales-2', alt: 'Portales de Toluca · vista alterna' },
];

export function HeroToluca() {
  return (
    <div className="hero-toluca" aria-hidden="true">
      {PHOTOS.map((p, i) => (
        <div key={p.slug} className={`hero-toluca-layer layer-${i + 1}`}>
          <div className="relative w-full h-full">
            <picture className="absolute inset-0 w-full h-full">
              {/* AVIF variants (highest modern compression) */}
              <source media="(max-width: 640px)" srcSet={`/assets/toluca/${p.slug}-640.avif`} type="image/avif" />
              <source media="(max-width: 1280px)" srcSet={`/assets/toluca/${p.slug}-1280.avif`} type="image/avif" />
              <source srcSet={`/assets/toluca/${p.slug}-1920.avif`} type="image/avif" />

              {/* WebP fallback */}
              <source media="(max-width: 640px)" srcSet={`/assets/toluca/${p.slug}-640.webp`} type="image/webp" />
              <source media="(max-width: 1280px)" srcSet={`/assets/toluca/${p.slug}-1280.webp`} type="image/webp" />
              <source srcSet={`/assets/toluca/${p.slug}-1920.webp`} type="image/webp" />

              <img
                src={`/assets/toluca/${p.slug}-1920.webp`}
                alt={p.alt}
                className="object-cover w-full h-full"
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </picture>
          </div>
        </div>
      ))}
      <div className="hero-toluca-overlay" />
    </div>
  );
}
