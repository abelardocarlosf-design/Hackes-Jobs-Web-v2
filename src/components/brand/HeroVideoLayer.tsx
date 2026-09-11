'use client';

/**
 * Capa de video del hero — mejora progresiva, nunca un requisito.
 *
 * Sólo se monta si `npm run assets:hero` generó material en
 * `src/data/hero-media.ts`. Mientras `heroMedia.video` sea `null` (el estado
 * versionado), este componente no llega a renderizarse y el bundler puede
 * eliminarlo del bundle de cliente.
 *
 * El `<video>` NO lleva `autoPlay` en el markup: en Chrome `autoPlay` anula
 * `preload="none"` y el navegador descarga el archivo de todos modos, que es
 * justo lo que estas compuertas quieren evitar. Se arranca desde el efecto,
 * después de comprobar que vale la pena.
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { heroMedia } from '@/data/hero-media';

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export function HeroVideoLayer() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const video = heroMedia.video;

  useEffect(() => {
    const el = ref.current;
    if (!el || !video) return;

    // 1. Sin movimiento: se queda el poster fijo. Es un estado correcto, no roto.
    if (reduce) return;

    // 2. Ahorro de datos y redes lentas. `connection` sólo existe en Chromium;
    //    donde no existe se asume rápida, igual que el resto del sitio trata sus
    //    mejoras progresivas.
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (conn?.saveData === true) return;
    if (/(^|-)2g$/.test(conn?.effectiveType ?? '')) return;

    // 3. En móvil el motor se sostiene solo y no vale un MB en la peor conexión.
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    let cancelled = false;

    const start = () => {
      if (cancelled || !ref.current) return;
      const v = ref.current;
      // Las <source> se inyectan aquí, no en SSR, para que el HTML servido no
      // contenga ninguna URL que el navegador pueda decidir precargar.
      for (const s of video.sources) {
        const node = document.createElement('source');
        node.src = s.src;
        node.type = s.type;
        v.appendChild(node);
      }
      v.preload = 'auto';
      v.load();
      v.play().catch(() => {
        /* El navegador puede negarse (política de autoplay). Queda el poster. */
      });
    };

    // Arrancar en el hueco tras el primer pintado: el video no debe competir
    // con el LCP. `requestIdleCallback` viene en la librería DOM como siempre
    // presente, pero Safari no lo trae hasta 16.4, así que la comprobación es
    // real y se hace sobre el tipo, no sobre la veracidad de la función.
    const usesIdle = typeof window.requestIdleCallback === 'function';
    const handle: number = usesIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);

    // Fuera de vista o pestaña oculta, no gasta batería decodificando.
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = ref.current;
        if (!v || v.readyState === 0) return;
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0 }
    );
    io.observe(el);

    const onVisibility = () => {
      const v = ref.current;
      if (!v || v.readyState === 0) return;
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      if (usesIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce, video]);

  if (!video) return null;

  return (
    <video
      ref={ref}
      className="hero-video absolute inset-0 h-full w-full object-cover"
      poster={heroMedia.poster?.fallback}
      preload="none"
      muted
      loop
      playsInline
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
