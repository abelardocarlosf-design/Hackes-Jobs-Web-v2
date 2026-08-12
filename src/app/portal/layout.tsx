import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSesion } from '@/lib/crm-session';
import { PanelShell } from '@/components/panel/PanelShell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Mi portal · Hacke's Jobs",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const sesion = await getSesion();
  if (!sesion) redirect('/login?redirect=/portal');
  if (sesion.role !== 'candidate') redirect('/');

  return (
    <PanelShell rol="candidate" nombre={sesion.name} inicio="/portal">
      {children}
    </PanelShell>
  );
}
