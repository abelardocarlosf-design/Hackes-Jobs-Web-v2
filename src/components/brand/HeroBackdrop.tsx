'use client';

/**
 * Fondo del hero: video opcional → motor de evaluación → velo de legibilidad.
 *
 * A diferencia del `ScrollSequence` que sustituye, este fondo es **local a la
 * sección**, no `fixed inset-0`. La sección padre lleva `relative isolate` y
 * esta capa `absolute inset-0 -z-10`: el `isolate` contiene el z-index negativo
 * dentro del hero, así que los overlays fijos de la página (`.page-overlay`,
 * `.page-dotgrid`, los `.mesh-orb` del layout) siguen pintando por detrás sin
 * que haya que orquestar nada.
 *
 * Eso elimina de raíz el desvanecido por geometría que `ScrollSequence`
 * necesitaba para no tapar las secciones de abajo: aquí el fondo simplemente
 * termina donde termina la sección.
 */

import { EvaluationEngine } from './EvaluationEngine';
import { HeroVideoLayer } from './HeroVideoLayer';
import { hasHeroVideo } from '@/data/hero-media';

export function HeroBackdrop() {
  return (
    <div className="hero-backdrop absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {hasHeroVideo && <HeroVideoLayer />}

      {/* El motor vive desplazado a la derecha: el titular ocupa la izquierda y
          el embudo necesita aire limpio para leerse. En móvil se centra y se
          atenúa, donde compite por el mismo ancho que el texto. */}
      <div className="absolute inset-y-0 right-0 w-full opacity-[0.4] sm:opacity-50 md:left-1/2 md:w-auto md:opacity-100 lg:left-[46%]">
        <EvaluationEngine />
      </div>

      <div className="hero-veil absolute inset-0" />
    </div>
  );
}
