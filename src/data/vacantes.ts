/**
 * Hacke's Jobs · Catálogo de Vacantes (fuente de verdad pública)
 * ───────────────────────────────────────────────────────────────
 * Para subir una nueva vacante:
 *   1. Copia un bloque existente del array `vacantes`.
 *   2. Cambia los campos. TypeScript te avisa si te equivocas en `categoria` o `modalidad`.
 *   3. Commit → push → deploy. La página /vacantes y /vacantes/[id] se regeneran solas.
 *
 * Para ocultar una vacante sin borrarla: pon `activa: false`.
 * Para destacarla en el listado: pon `destacada: true`.
 * Si `empresa` coincide con un slug de `public/assets/brand-manifest.json`,
 * el logo se renderiza automáticamente.
 *
 * El campo `id` se usa para la URL pública (`/vacantes/[id]`) y como
 * identificador en el webhook de postulación. Mantenlo kebab-case y único.
 */

export type CategoriaVacante =
  | 'Operativo'
  | 'Técnico'
  | 'Administrativo'
  | 'Gerencial'
  | 'Ventas'
  | 'Transporte y Logística'
  | 'Servicios'
  | 'Otro';

export type ModalidadVacante = 'Presencial' | 'Híbrido' | 'Remoto';

export interface Vacante {
  /** Slug kebab-case · único · URL pública y payload del webhook */
  id: string;
  titulo: string;
  empresa: string;
  categoria: CategoriaVacante;
  ubicacion: string;
  modalidad: ModalidadVacante;
  /** Opcional. Ej: "$8,000 MXN semanales" o "A negociar" */
  salario?: string;
  /** 2-3 párrafos. Es lo que ve el candidato en el card y el primer bloque del detalle. */
  descripcion: string;
  /** Lista de responsabilidades clave (opcional). */
  responsabilidades?: string[];
  /** Lista de requisitos clave (edad, licencia, experiencia, etc). */
  requisitos?: string[];
  /** Lo que ofrecemos: sueldo, bonos, prestaciones, transporte, etc. */
  ofrecemos?: string[];
  /** Pin arriba del catálogo. Default: false */
  destacada?: boolean;
  /** ISO date "YYYY-MM-DD". Default: hoy (orden cronológico) */
  fechaPublicacion?: string;
  /** false = oculta del listado público. Default: true */
  activa?: boolean;
}

// ──────────────────────────────────────────────────────────────────
// CATÁLOGO · 5 VACANTES REALES
// ──────────────────────────────────────────────────────────────────
export const vacantes: Vacante[] = [
  {
    id: 'operador-5ta-rueda-es-express',
    titulo: 'Operador de 5ta Rueda · Rutas Foráneas',
    empresa: 'ES Express',
    categoria: 'Transporte y Logística',
    ubicacion: 'Nuevo Laredo / Estado de México / Guadalajara',
    modalidad: 'Presencial',
    salario: '≈ $8,000 MXN semanales libres',
    descripcion:
      'Operador profesional para rutas foráneas de larga distancia entre Nuevo Laredo, Estado de México y Guadalajara. Posición estable de lunes a viernes con bonos por kilometraje y prestaciones de ley superiores.',
    requisitos: [
      'Edad: 25 a 60 años',
      'Licencia federal B o E con mínimo 3 años de antigüedad',
      'Apto médico vigente',
    ],
    ofrecemos: [
      'Sueldo aproximado de $8,000 semanales libres',
      'Bonos por kilometraje',
      'Prestaciones de ley',
      'Seguro de gastos médicos al 100%',
      'Seguro de vida',
      'Vales de despensa',
      'Horario lunes a viernes de 8:00 a 18:00',
    ],
    destacada: true,
    fechaPublicacion: '2025-11-12',
  },

  {
    id: 'operador-5ta-rueda-xpress-internacional',
    titulo: 'Operador de 5ta Rueda · Garantía Semanal',
    empresa: 'Xpress Internacional',
    categoria: 'Transporte y Logística',
    ubicacion: 'Nuevo Laredo / Monterrey / Centro del país',
    modalidad: 'Presencial',
    salario: 'Garantía $7,000 + promedio real $8,500 MXN semanales',
    descripcion:
      'Operación de 5ta rueda con sueldo garantizado y promedio real superior. Incluye bono de contratación, seguro de vida ampliado y vales de despensa. Ideal para operadores con experiencia probada que buscan estabilidad económica desde el primer día.',
    requisitos: [
      'Edad: 23 a 58 años',
      'Licencia federal B o E con mínimo 2 años de antigüedad',
      'Apto médico vigente',
    ],
    ofrecemos: [
      'Garantía de $7,000 semanales',
      'Promedio real de $8,500 semanales',
      'Bono de contratación de $9,000',
      'Prestaciones de ley',
      'Seguro de vida por $250,000',
      'Vales de despensa por $800',
    ],
    destacada: true,
    fechaPublicacion: '2025-11-12',
  },

  {
    id: 'auxiliar-comedor-industrial-prisma',
    titulo: 'Auxiliar de Comedor Industrial',
    empresa: 'Comedores Prisma',
    categoria: 'Servicios',
    ubicacion: 'CEDIS Zorro, Estado de México',
    modalidad: 'Presencial',
    salario: 'Sueldo competitivo según turno',
    descripcion:
      'Apoyo en el área de comedor industrial dentro de las instalaciones del CEDIS Zorro. Posición ideal para personas con disponibilidad para rolar turnos y formar parte de un equipo operativo sólido.',
    requisitos: [
      'Edad: 18 a 55 años',
      'Disponibilidad para rolar turnos (06:00-14:00, 14:00-22:00, 22:00-06:00)',
    ],
    ofrecemos: [
      'Sueldo competitivo',
      'Prestaciones de ley',
      'Alimentación incluida durante el turno',
    ],
    fechaPublicacion: '2025-11-11',
  },

  {
    id: 'ayudante-comedor-prisma-san-martin-obispo',
    titulo: 'Ayudante General de Comedor Industrial',
    empresa: 'Comedores Prisma',
    categoria: 'Servicios',
    ubicacion: 'San Martín Obispo · CEDIS Zorro',
    modalidad: 'Presencial',
    salario: '$2,200 (L-V) o $2,555 (L-S) MXN semanales',
    descripcion:
      'Apoyo general en comedor industrial dentro del CEDIS Zorro de San Martín Obispo. El candidato puede elegir entre el esquema de lunes a viernes o lunes a sábado, con prestaciones de ley y alimentación incluida durante el turno.',
    requisitos: [
      'Edad: 18 a 55 años',
      'Disponibilidad para rolar turnos (06:00-14:00, 14:00-22:00, 22:00-06:00)',
    ],
    ofrecemos: [
      '$2,200 semanales en esquema lunes a viernes',
      '$2,555 semanales en esquema lunes a sábado',
      'Prestaciones de ley',
      'Alimentación incluida durante el turno',
    ],
    fechaPublicacion: '2025-11-11',
  },

  {
    id: 'ayudante-general-prologis-park-grande',
    titulo: 'Ayudante General',
    empresa: 'Prologis Park Grande',
    categoria: 'Operativo',
    ubicacion: 'Prologis Park Grande, Estado de México',
    modalidad: 'Presencial',
    salario: '$1,900 netos semanales · $9,480 mensuales brutos',
    descripcion:
      'La jornada es de 4 días de trabajo x 3 días de descanso, son turnos de 12 horas.\nLos 4 días de trabajo son rolados (entre lunes a sábado).\nLos horarios son de 6:00 am a 6:30 pm o de 6:30 pm a 6:00 am, cada turno se va rolando un mes.',
    requisitos: [
      'La vacante es solo para personal masculino',
      'Disponibilidad para turno de 12 horas (06:00 am a 06:30 pm o 06:30 pm a 06:00 am)',
    ],
    ofrecemos: [
      '$1,900 netos libres semanales',
      '$9,480 Mensual bruto',
      'Tres días de descanso por semana',
      'Prestaciones superiores a las de ley',
      'Transporte gratuito desde Héroes Tecámac, Huehuetoca, Perinorte y otras zonas',
      'Comedor subsidiado a $22 por comida',
      'Fondo de ahorro',
    ],
    destacada: true,
    fechaPublicacion: '2025-11-10',
  },
];

// ──────────────────────────────────────────────────────────────────
// CATÁLOGOS DE FILTROS (la UI los consume directo)
// ──────────────────────────────────────────────────────────────────
export const CATEGORIAS: CategoriaVacante[] = [
  'Operativo',
  'Técnico',
  'Administrativo',
  'Gerencial',
  'Ventas',
  'Transporte y Logística',
  'Servicios',
  'Otro',
];

export const MODALIDADES: ModalidadVacante[] = ['Presencial', 'Híbrido', 'Remoto'];

// ──────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────

/** Vacantes activas, ordenadas: destacadas primero, luego por fecha desc. */
export function vacantesActivas(): Vacante[] {
  return [...vacantes]
    .filter((v) => v.activa !== false)
    .sort((a, b) => {
      const destacadaA = a.destacada ? 1 : 0;
      const destacadaB = b.destacada ? 1 : 0;
      if (destacadaA !== destacadaB) return destacadaB - destacadaA;
      return (b.fechaPublicacion ?? '').localeCompare(a.fechaPublicacion ?? '');
    });
}

/** Ubicaciones únicas derivadas del catálogo (alimenta el filtro). */
export function ubicacionesDisponibles(): string[] {
  return Array.from(new Set(vacantes.filter((v) => v.activa !== false).map((v) => v.ubicacion))).sort();
}

export function vacanteById(id: string): Vacante | undefined {
  return vacantes.find((v) => v.id === id);
}
