/**
 * Manifiesto de material audiovisual del hero.
 *
 * ESTE ARCHIVO SE GENERA. No lo edites a mano: lo reescribe
 * `scripts/process-hero-media.js` (`npm run assets:hero`) a partir de lo que
 * haya en `media-src/hero/`.
 *
 * Se versiona con los campos en `null` a propósito. Así un clon limpio compila
 * y el hero se renderiza completo sin un solo byte de video — la capa de video
 * es una mejora progresiva, no un requisito. Y como `hasHeroVideo` queda como
 * constante conocida en build, el bundler puede eliminar la rama del `<video>`
 * del bundle de cliente mientras no haya material.
 *
 * Es `.ts` y no `.json` para que lleve sus propios tipos: el manifiesto de
 * marca (`public/assets/brand-manifest.json`) obliga a sus consumidores a un
 * `as` porque JSON no tipa (ver `src/components/vacantes/EmpresaLogo.tsx:13`).
 */

export type HeroVideoSource = {
  /** Ruta pública, ya servible. */
  src: string;
  /** MIME completo con el codec, para que el navegador descarte sin descargar. */
  type: string;
  width: number;
};

export type HeroPoster = {
  /** Ancho en px → ruta pública. Sólo contiene los anchos realmente emitidos. */
  avif: Record<number, string>;
  webp: Record<number, string>;
  /** JPEG de último recurso para navegadores sin AVIF ni WebP. */
  fallback: string;
  width: number;
  height: number;
};

export type HeroMedia = {
  poster: HeroPoster | null;
  video: { sources: HeroVideoSource[]; durationSec: number; bytes: number } | null;
};

export const heroMedia: HeroMedia = {
  poster: null,
  video: null,
};

/** Constante de build: con `video: null` el `<video>` ni siquiera se empaqueta. */
export const hasHeroVideo = heroMedia.video !== null;
