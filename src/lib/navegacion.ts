/**
 * Fuente única de verdad de la navegación y de los permisos por rol.
 *
 * IMPORTANTE: este archivo lo importa `src/middleware.ts`, que corre en el
 * runtime Edge. No metas aquí React, `lucide-react`, `next/headers` ni nada de
 * Node: rompería el bundle del middleware. Los iconos se resuelven aparte, en
 * `src/components/nav/iconos.ts`, por nombre.
 *
 * Que los menús y las reglas de acceso salgan del mismo sitio es lo que impide
 * que vuelvan a divergir: antes el CRM existía pero no aparecía en ningún menú,
 * y el middleware protegía /dashboard/admin, una ruta que no existía.
 */

export type Rol = 'admin' | 'recruiter' | 'company' | 'candidate';

export interface EnlaceNav {
  href: string;
  etiqueta: string;
  /** Texto de apoyo en los desplegables del navbar público. */
  descripcion?: string;
  /** Clave para `src/components/nav/iconos.ts`. */
  icono?: string;
}

export const ROLES: Rol[] = ['admin', 'recruiter', 'company', 'candidate'];

export function esRol(valor: unknown): valor is Rol {
  return typeof valor === 'string' && (ROLES as string[]).includes(valor);
}

// ─── Navegación pública ────────────────────────────────────────────
// Contacto vive en el grupo de acciones de la derecha del navbar, no aquí:
// es una acción de conversión, no una sección de contenido.
export const NAV_PUBLICO: EnlaceNav[] = [
  { href: '/empresas', etiqueta: 'Empresas' },
  { href: '/psicometrias', etiqueta: 'Psicometrías' },
  { href: '/precios', etiqueta: 'Precios' },
  { href: '/nosotros', etiqueta: 'Nosotros' },
  { href: '/blog', etiqueta: 'Blog' },
];

export const NAV_CANDIDATO_PUBLICO: EnlaceNav[] = [
  {
    href: '/vacantes',
    etiqueta: 'Ver vacantes',
    descripcion: 'Todas las posiciones abiertas en el corredor Toluca–Lerma–Metepec.',
    icono: 'maletin',
  },
  {
    href: '/register',
    etiqueta: 'Registrar mi CV',
    descripcion: 'Sube tu CV para que te vinculemos a las vacantes compatibles.',
    icono: 'altaUsuario',
  },
  {
    href: '/candidatos',
    etiqueta: 'Cómo funciona',
    descripcion: 'Terna inteligente, evaluaciones psicométricas y preparación.',
    icono: 'usuario',
  },
  {
    href: '/psicometrias',
    etiqueta: 'Practicar psicometrías',
    descripcion: 'Conoce y practica las pruebas antes de tu proceso.',
    icono: 'cerebro',
  },
];

// ─── Zonas privadas: un prefijo por rol ────────────────────────────
// El middleware lee este mapa. Añadir una zona es añadir una línea aquí.
export const RUTAS_POR_ROL: Record<string, Rol[]> = {
  '/crm': ['admin', 'recruiter'],
  '/admin': ['admin'],
  // `/mi-empresa` y no `/empresa`: startsWith('/empresa') también capturaría
  // las páginas públicas /empresas y /empresas/requisicion.
  '/mi-empresa': ['company'],
  '/portal': ['candidate'],
};

/** Requiere sesión, pero cualquier rol puede entrar (redirige según el rol). */
export const RUTAS_SOLO_SESION = ['/dashboard'];

export const INICIO_POR_ROL: Record<Rol, string> = {
  admin: '/admin',
  recruiter: '/crm',
  company: '/mi-empresa',
  candidate: '/portal',
};

export const ETIQUETA_ROL: Record<Rol, string> = {
  admin: 'Administrador',
  recruiter: 'Reclutador',
  company: 'Empresa',
  candidate: 'Candidato',
};

export const MENU_POR_ROL: Record<Rol, EnlaceNav[]> = {
  admin: [
    { href: '/admin', etiqueta: 'Panel', icono: 'panel' },
    { href: '/crm', etiqueta: 'CRM de reclutamiento', icono: 'maletin' },
    { href: '/admin/blog', etiqueta: 'Blog', icono: 'documento' },
    { href: '/admin/suscriptores', etiqueta: 'Suscriptores', icono: 'usuarios' },
    { href: '/admin/equipo', etiqueta: 'Equipo', icono: 'usuarios' },
    { href: '/crm/perfil', etiqueta: 'Mi perfil', icono: 'usuario' },
  ],
  recruiter: [
    { href: '/crm', etiqueta: 'Panel del CRM', icono: 'panel' },
    { href: '/crm/candidatos', etiqueta: 'Candidatos', icono: 'usuarios' },
    { href: '/crm/requisiciones', etiqueta: 'Requisiciones', icono: 'documento' },
    { href: '/crm/seguimientos', etiqueta: 'Seguimientos', icono: 'reloj' },
    { href: '/crm/perfil', etiqueta: 'Mi perfil', icono: 'usuario' },
  ],
  company: [
    { href: '/mi-empresa', etiqueta: 'Mi panel', icono: 'panel' },
    { href: '/mi-empresa/requisiciones', etiqueta: 'Mis requisiciones', icono: 'documento' },
    { href: '/empresas/requisicion', etiqueta: 'Nueva requisición', icono: 'mas' },
  ],
  candidate: [
    { href: '/portal', etiqueta: 'Mi portal', icono: 'panel' },
    { href: '/portal/perfil', etiqueta: 'Mi perfil y CV', icono: 'usuario' },
    { href: '/portal/psicometrias', etiqueta: 'Mis psicometrías', icono: 'cerebro' },
    { href: '/vacantes', etiqueta: 'Ver vacantes', icono: 'maletin' },
  ],
};

/** Coincidencia por segmento: `/empresa` no debe capturar `/empresas`. */
export function rutaCoincide(pathname: string, prefijo: string): boolean {
  return pathname === prefijo || pathname.startsWith(prefijo + '/');
}

/** Prefijo privado que cubre esta ruta, o null si es pública. */
export function zonaDe(pathname: string): string | null {
  return Object.keys(RUTAS_POR_ROL).find(p => rutaCoincide(pathname, p)) ?? null;
}

export function puedeEntrar(rol: string | undefined, pathname: string): boolean {
  const zona = zonaDe(pathname);
  if (!zona) return true;
  return esRol(rol) && RUTAS_POR_ROL[zona].includes(rol);
}

export function menuDeUsuario(rol: string | undefined): EnlaceNav[] {
  return esRol(rol) ? MENU_POR_ROL[rol] : [];
}

/** A dónde mandar a alguien tras iniciar sesión, según su rol. */
export function inicioDe(rol: string | undefined): string {
  return esRol(rol) ? INICIO_POR_ROL[rol] : '/';
}

/** Etiqueta del CTA principal del navbar cuando hay sesión iniciada. */
export function ctaDeRol(rol: string | undefined): EnlaceNav | null {
  switch (rol) {
    case 'admin':
    case 'recruiter':
      return { href: '/crm', etiqueta: 'Ir al CRM' };
    case 'company':
      return { href: '/empresas/requisicion', etiqueta: 'Nueva requisición' };
    case 'candidate':
      return { href: '/vacantes', etiqueta: 'Ver vacantes' };
    default:
      return null;
  }
}

/**
 * Sanea el `?redirect=` del login.
 *
 * Sin esto, `/login?redirect=https://evil.com` navegaba fuera del sitio después
 * de autenticarse: un open redirect explotable en phishing. Solo se aceptan
 * rutas internas; `//host` se rechaza porque el navegador lo trata como
 * protocolo-relativo y sale del dominio igual.
 */
export function destinoSeguro(destino: string | null, porDefecto: string): string {
  if (!destino) return porDefecto;
  if (!destino.startsWith('/') || destino.startsWith('//')) return porDefecto;
  return destino;
}
