import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSesion } from '@/lib/crm-session';
import { PanelShell } from '@/components/panel/PanelShell';

// Mismo patrón que src/app/crm/layout.tsx: el middleware ya filtró, pero este
// chequeo en servidor es la segunda línea de defensa si el token expira a mitad
// de navegación. Antes /admin/blog ni siquiera estaba en el matcher del
// middleware y se servía a cualquiera, con un gate solo de React en el cliente.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Administración · Hacke's Jobs",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sesion = await getSesion();
  if (!sesion) redirect('/login?redirect=/admin');
  if (sesion.role !== 'admin') redirect('/');

  return (
    <PanelShell rol="admin" nombre={sesion.name} inicio="/admin">
      {children}
    </PanelShell>
  );
}
