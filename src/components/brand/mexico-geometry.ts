/**
 * Geometría del mapa de cobertura.
 *
 * El contorno viene de Natural Earth (dominio público) vía
 * johan/world.geo.json, proyectado y simplificado una única vez en tiempo de
 * autoría con Douglas–Peucker: 170 puntos → 147, 1.7 KB de string. Se hornea
 * aquí a propósito — así el mapa no arrastra d3-geo ni topojson (40 KB+ de
 * bundle) para resolver una proyección que cabe en ocho líneas, ni hace una
 * sola petición de red en runtime.
 *
 * La proyección es equirectangular con la x comprimida por cos(latitud central).
 * Sin esa compresión México sale estirado a lo ancho.
 */

export const MAP_VB = { w: 1000, h: 631 } as const;

const LON_MIN = -118.5;
const LAT_MAX = 32.8;
/** cos(latitud central) · escala — precalculado para no repetirlo por punto. */
const KX = 26.316;
const KY = 31.234;

/** Grados → coordenadas del viewBox. */
export function project(lon: number, lat: number): { x: number; y: number } {
  return {
    x: (lon - LON_MIN) * KX,
    y: (LAT_MAX - lat) * KY,
  };
}

export const MEXICO_OUTLINE_D =
  'M667.5 236.2L655.4 266.2L649.9 290.7L644.6 353.0L650.0 371.6L659.7 388.2L666.0 414.7L686.7 440.1L694.0 459.5L706.2 476.3L739.4 485.3L752.3 499.6L779.7 490.1L803.6 486.6L846.6 474.7L866.5 460.7L874.0 440.9L876.5 412.2L881.9 402.3L903.1 393.3L936.1 385.4L963.8 386.6L982.8 383.7L990.3 391.0L989.2 407.4L972.4 427.6L965.0 448.4L970.7 454.3L958.2 495.7L950.3 486.9L937.8 487.9L926.6 508.5L920.9 504.5L917.2 506.0L917.4 511.1L859.3 510.7L859.3 529.9L845.2 530.0L868.4 549.3L871.8 556.7L876.9 558.7L876.1 570.3L836.0 570.4L821.0 598.2L825.4 604.6L821.8 612.6L821.0 622.5L785.6 585.8L769.5 574.7L744.0 565.8L726.6 568.3L701.5 581.2L685.7 584.5L640.2 569.0L611.0 553.4L587.6 548.6L552.2 532.8L526.1 516.5L518.2 507.4L500.7 505.3L468.7 494.6L455.7 479.0L422.1 459.7L406.5 438.2L399.0 421.5L409.4 418.2L406.2 408.5L413.4 399.7L413.6 387.9L403.0 372.6L400.2 359.0L389.7 341.8L362.2 307.9L330.8 281.3L315.6 260.0L288.7 246.1L283.0 237.8L287.8 216.7L271.8 208.8L253.4 192.2L245.6 168.4L228.8 165.6L196.0 131.1L194.6 120.4L177.8 94.7L166.8 68.6L167.2 55.5L144.6 42.0L134.2 43.5L116.4 34.1L111.4 47.9L116.5 64.3L119.6 89.9L158.6 135.5L163.4 137.9L167.5 149.6L173.1 149.1L179.3 171.1L188.8 179.8L195.5 191.9L215.1 209.2L225.5 240.9L243.4 271.8L245.2 289.8L260.2 290.9L284.1 321.6L283.3 327.7L270.2 340.3L264.6 340.1L256.4 319.4L236.0 300.0L197.4 274.8L198.5 249.9L193.7 231.4L157.4 205.6L153.2 210.0L145.3 201.1L126.1 192.9L107.7 173.1L109.9 170.5L122.8 172.4L134.4 159.7L135.6 144.3L111.5 120.0L93.2 110.6L55.6 39.7L42.9 9.0L118.1 2.7L115.2 9.4L233.6 50.0L320.6 49.7L320.6 35.6L374.8 35.6L386.2 47.7L420.7 73.5L438.8 110.0L455.0 120.3L480.9 130.6L500.6 103.6L526.2 103.0L548.2 116.6L574.7 159.9L593.1 179.3L600.0 203.2L608.8 219.2L655.3 237.3L667.5 236.2Z';

/**
 * `hub` — la plaza principal.
 * `directa` — operación propia, presencial.
 * `coordinada` — búsquedas que se coordinan desde el Valle de México.
 *
 * La distinción es deliberada: el resto del sitio se vende sobre evidencia, así
 * que el mapa no puede afirmar una presencia física que no existe.
 */
export type PlazaTier = 'hub' | 'directa' | 'coordinada';

export type Plaza = {
  nombre: string;
  lon: number;
  lat: number;
  tier: PlazaTier;
  /** Lado al que sale la etiqueta desde el nodo. */
  anchor?: 'left' | 'right';
  /**
   * Desplazamiento vertical de la etiqueta, en unidades del viewBox.
   *
   * El centro del país concentra cinco plazas en un radio muy corto —CDMX y
   * Toluca–Lerma quedan a 14 unidades— así que sin separarlas a mano los
   * nombres se pisan. Los valores están calibrados contra el render, no
   * derivados de la geometría.
   */
  labelDy?: number;
};

export const PLAZAS: Plaza[] = [
  { nombre: 'Ciudad de México', lon: -99.1332, lat: 19.4326, tier: 'hub', anchor: 'right', labelDy: -6 },
  { nombre: 'Toluca–Lerma', lon: -99.6557, lat: 19.2826, tier: 'directa', anchor: 'left', labelDy: 14 },
  { nombre: 'Querétaro', lon: -100.3899, lat: 20.5888, tier: 'directa', anchor: 'left', labelDy: 6 },
  { nombre: 'Guadalajara', lon: -103.3496, lat: 20.6597, tier: 'coordinada', anchor: 'left', labelDy: -4 },
  { nombre: 'Monterrey', lon: -100.3161, lat: 25.6866, tier: 'coordinada', anchor: 'right' },
  { nombre: 'Bajío', lon: -101.6833, lat: 21.1219, tier: 'coordinada', anchor: 'right', labelDy: -22 },
  { nombre: 'Puebla', lon: -98.2063, lat: 19.0414, tier: 'coordinada', anchor: 'right', labelDy: 22 },
  { nombre: 'Saltillo', lon: -101.0053, lat: 25.4232, tier: 'coordinada', anchor: 'left' },
];

export const HUB = PLAZAS[0];
