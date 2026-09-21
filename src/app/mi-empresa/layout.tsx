import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSesion } from '@/lib/crm-session';
import { PanelShell } from '@/components/panel/PanelShell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Mi empresa · Hacke's Jobs",
  robots: { index: false, follow: false },
};

// El prefijo es /mi-empresa y no /empresa a propósito: startsWith('/empresa')
// también capturaría las páginas públicas /empresas y /empresas/requisicion.
export default async function MiEmpresaLayout({ children }: { children: React.ReactNode }) {
  const sesion = await getSesion();
  if (!sesion) redirect('/login?redirect=/mi-empresa');
  if (sesion.role !== 'company') redirect('/');

  return (
    <PanelShell rol="company" nombre={sesion.name} inicio="/mi-empresa">
      {children}
    </PanelShell>
  );
}
