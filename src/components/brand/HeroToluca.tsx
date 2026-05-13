/**
 * Cinematic Toluca background for the hero section.
 *
 * 4 photos crossfade on an 32s loop, each with its own Ken Burns
 * (slow zoom + pan) keyframe. Heavy dark gradient overlay ensures text
 * legibility regardless of which photo is active.
 *
 * Uses CSS background-image with AVIF (modern) and image-set fallback chain.
 * Each photo has 640/1280/1920 widths processed via scripts/process-brand-assets.js.
 *
 * Honors prefers-reduced-motion (in globals.css: animations off, layer-1 visible).
 */

const PHOTOS = [
  { slug: 'nevado-1', alt: 'Nevado de Toluca' },
  { slug: 'portales-1', alt: 'Portales de Toluca' },
  { slug: 'nevado-2', alt: 'Nevado de Toluca · vista alterna' },
  { slug: 'portales-2', alt: 'Portales de Toluca · vista alterna' },
];

function bgImageSet(slug: string): string {
  // Prefer AVIF, fall back to WebP. Browsers ignore unsupported entries.
  // 1920 is the master; smaller widths used implicitly by browser via the responsive
  // <picture> elsewhere — for a fixed full-bleed background we serve 1280 which is
  // the sweet spot for sharpness/weight across most viewports.
  return `image-set(
    url('/assets/toluca/${slug}-1920.avif') type('image/avif'),
    url('/assets/toluca/${slug}-1280.webp') type('image/webp')
  )`;
}

export function HeroToluca() {
  return (
    <div className="hero-toluca" aria-hidden="true">
      {PHOTOS.map((p, i) => (
        <div key={p.slug} className={`hero-toluca-layer layer-${i + 1}`}>
          <div style={{ backgroundImage: bgImageSet(p.slug) }} />
        </div>
      ))}
      <div className="hero-toluca-overlay" />
    </div>
  );
}
