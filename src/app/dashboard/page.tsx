import { redirect } from 'next/navigation';
import { getSesion } from '@/lib/crm-session';
import { inicioDe } from '@/lib/navegacion';

export const dynamic = 'force-dynamic';

/**
 * /dashboard ya no es una pantalla: es un desvío.
 *
 * Antes era a la vez back-office de admin, aterrizaje de empresa y aterrizaje
 * de candidato, y esa ambigüedad era justo el problema. Ahora cada rol tiene su
 * prefijo (/admin, /crm, /mi-empresa, /portal) y esto se conserva para que los
 * marcadores guardados y los enlaces antiguos sigan llevando a algún sitio útil.
 */
export default async function DashboardRedirect() {
  const sesion = await getSesion();
  if (!sesion) redirect('/login?redirect=/dashboard');
  redirect(inicioDe(sesion.role));
}
