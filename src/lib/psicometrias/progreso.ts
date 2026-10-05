'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Avance guardado de una psicometría en este navegador.
 *
 * Antes se guardaba en `hj_test_<slug>` sin más, y ese avance se le mostraba a
 * cualquiera que abriera la misma prueba en el mismo equipo: el candidato
 * siguiente (o el mismo candidato después de un cambio de preguntas) entraba y
 * veía respuestas que no eran suyas. Ahora el avance lleva dueño (el correo del
 * formulario), versión del banco de preguntas y fecha, y se descarta si
 * cualquiera de los tres no coincide.
 */

const CADUCIDAD_MS = 3 * 24 * 60 * 60 * 1000; // 3 días

interface AvanceGuardado<T> {
  v: string;
  dueno: string;
  guardado: number;
  datos: T;
}

const claveAvance = (slug: string) => `hj_test_${slug}`;

/** Correo del candidato que llenó el formulario de esta prueba en la sesión actual. */
export function duenoActual(slug: string): string {
  try {
    const lead = JSON.parse(sessionStorage.getItem(`hj_lead_${slug}`) || 'null');
    return String(lead?.email || '').trim().toLowerCase();
  } catch {
    return '';
  }
}

export function borrarAvance(slug: string) {
  try {
    localStorage.removeItem(claveAvance(slug));
  } catch {}
}

function leerAvance<T>(slug: string, version: string): T | null {
  try {
    const raw = localStorage.getItem(claveAvance(slug));
    if (!raw) return null;
    const avance = JSON.parse(raw) as Partial<AvanceGuardado<T>>;
    const dueno = duenoActual(slug);
    const valido =
      avance &&
      avance.v === version &&
      !!dueno &&
      avance.dueno === dueno &&
      typeof avance.guardado === 'number' &&
      Date.now() - avance.guardado < CADUCIDAD_MS &&
      avance.datos !== undefined;
    if (!valido) {
      // Formato viejo, otra persona, otra versión del banco o caducado: fuera.
      localStorage.removeItem(claveAvance(slug));
      return null;
    }
    return avance.datos as T;
  } catch {
    return null;
  }
}

function escribirAvance<T>(slug: string, version: string, datos: T) {
  try {
    const avance: AvanceGuardado<T> = { v: version, dueno: duenoActual(slug), guardado: Date.now(), datos };
    localStorage.setItem(claveAvance(slug), JSON.stringify(avance));
  } catch {}
}

/**
 * Estado de una prueba con autoguardado. `listo` es false hasta que se leyó el
 * avance, para no pintar la prueba vacía y luego saltar a otra pregunta.
 */
export function useAvancePrueba<T>(slug: string, version: string, inicial: () => T) {
  const inicialRef = useRef(inicial);
  const [estado, setEstadoInterno] = useState<T>(() => inicialRef.current());
  const [listo, setListo] = useState(false);
  const [reanudado, setReanudado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const previo = leerAvance<T>(slug, version);
    if (previo) {
      setEstadoInterno({ ...inicialRef.current(), ...previo });
      setReanudado(true);
    }
    setListo(true);
  }, [slug, version]);

  const setEstado = useCallback(
    (cambio: T | ((prev: T) => T)) => {
      setEstadoInterno(prev => {
        const siguiente = typeof cambio === 'function' ? (cambio as (p: T) => T)(prev) : cambio;
        escribirAvance(slug, version, siguiente);
        return siguiente;
      });
      setGuardando(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setGuardando(false), 500);
    },
    [slug, version]
  );

  const reiniciar = useCallback(() => {
    borrarAvance(slug);
    setEstadoInterno(inicialRef.current());
    setReanudado(false);
  }, [slug]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { estado, setEstado, listo, reanudado, guardando, reiniciar };
}
