'use client';

/**
 * Fondo cinemático con scrub por scroll.
 *
 * El progreso de scroll dentro del bloque `targetRef` mapea a un índice de
 * fotograma sobre la secuencia de fotos del corredor Toluca–Lerma. El valor se
 * suaviza con lerp (0.12 por frame) para que el barrido se sienta continuo y no
 * escalonado, igual que un scrub de video — pero con los AVIF que ya sirve el
 * sitio, sin descargar un solo byte de video.
 *
 * Por qué imágenes y no <video>: la primera foto ya va con <link rel="preload">
 * en el layout, así que el LCP se mantiene intacto. Un video scrubbed exigiría
 * decodificar y cachear ~90 frames antes de poder dibujar nada.
 *
 * El layer completo se desvanece en el último 10% del recorrido para que las
 * secciones de abajo (fondos sólidos) entren limpias.
 *
 * Respeta prefers-reduced-motion: primer fotograma fijo, sin rAF.
 */

import { useEffect, useRef, type RefObject } from 'react';

const FRAMES = [
  { slug: 'nevado-1', alt: 'Nevado de Toluca' },
  { slug: 'portales-1', alt: 'Portales de Toluca' },
  { slug: 'nevado-2', alt: 'Nevado de Toluca · vista alterna' },
  { slug: 'portales-2', alt: 'Portales de Toluca · vista alterna' },
];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function ScrollSequence({ targetRef }: { targetRef: RefObject<HTMLElement> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const target = targetRef.current;
    if (!root || !stage || !target) return;

    const layers = layersRef.current;
    const last = FRAMES.length - 1;

    // Sin motion: primer fotograma visible y nada de rAF.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      layers.forEach((el, i) => {
        if (el) el.style.opacity = i === 0 ? '1' : '0';
      });
      root.style.opacity = '1';
      stage.style.transform = 'scale(1)';
      return;
    }

    let smoothed = 0;
    let raf = 0;

    const tick = () => {
      const rect = target.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const raw = travel > 0 ? clamp01(-rect.top / travel) : 0;

      smoothed += (raw - smoothed) * 0.12;

      // Crossfade: las capas ya recorridas quedan opacas debajo y sólo la
      // entrante se funde encima. Evita el "hueco" de dos capas al 50%.
      const pos = smoothed * last;
      const base = Math.floor(pos);
      const frac = pos - base;
      for (let i = 0; i <= last; i++) {
        const el = layers[i];
        if (!el) continue;
        el.style.opacity = i < base ? '1' : i === base ? '1' : i === base + 1 ? String(frac) : '0';
      }

      // Push-in sutil: la escena se acerca conforme avanzas.
      stage.style.transform = `scale(${(1.08 - smoothed * 0.08).toFixed(4)})`;

      // Salida atada a la geometría del bloque, no al progreso suavizado: el
      // lerp se acerca a 1 asintóticamente y nunca llega, así que una opacidad
      // derivada de él dejaba un fantasma de la foto (~0.04) sobre las secciones
      // transparentes de abajo. Con rect.bottom el corte sí llega a cero — y
      // ocurre tapado por la sección de KPIs, que tiene fondo sólido.
      const out = clamp01(rect.bottom / (window.innerHeight * 0.6));
      root.style.opacity = String(out);
      root.style.visibility = out <= 0.004 ? 'hidden' : 'visible';

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetRef]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07070f]"
    >
      <div ref={stageRef} className="absolute inset-0 will-change-transform">
        {FRAMES.map((f, i) => (
          <div
            key={f.slug}
            ref={(el) => {
              layersRef.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <picture className="absolute inset-0 h-full w-full">
              <source media="(max-width: 640px)" srcSet={`/assets/toluca/${f.slug}-640.avif`} type="image/avif" />
              <source media="(max-width: 1280px)" srcSet={`/assets/toluca/${f.slug}-1280.avif`} type="image/avif" />
              <source srcSet={`/assets/toluca/${f.slug}-1920.avif`} type="image/avif" />

              <source media="(max-width: 640px)" srcSet={`/assets/toluca/${f.slug}-640.webp`} type="image/webp" />
              <source media="(max-width: 1280px)" srcSet={`/assets/toluca/${f.slug}-1280.webp`} type="image/webp" />
              <source srcSet={`/assets/toluca/${f.slug}-1920.webp`} type="image/webp" />

              {/* Eager en todos los fotogramas: con `lazy` el navegador no
                  descarga las capas a opacity:0 y el scrub cruza a un cuadro en
                  negro. `fetchPriority=low` los deja detrás del LCP. */}
              <img
                src={`/assets/toluca/${f.slug}-1920.webp`}
                alt=""
                className="h-full w-full object-cover"
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Velo de legibilidad — el texto blanco vive encima de esto */}
      <div className="seq-veil absolute inset-0" />
    </div>
  );
}
