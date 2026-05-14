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

import Image from 'next/image';

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
            <Image
              src={`/assets/toluca/${p.slug}-1920.avif`}
              alt={p.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
      <div className="hero-toluca-overlay" />
    </div>
  );
}
