import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCrmUser } from '@/lib/crm-session';
import { CrmShell } from '@/components/crm/CrmShell';

export const metadata = {
  title: 'CRM de Reclutamiento | Hacke\'s Jobs',
  robots: { index: false, follow: false },
};

// Datos personales de candidatos: nunca cacheado ni prerenderizado.
export const dynamic = 'force-dynamic';

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const user = await getCrmUser();

  // El middleware ya filtra, pero si el token expiró entre la navegación y el
  // render no queremos pintar el CRM a medias.
  if (!user) redirect('/login?redirect=/crm');

  const pendientes = await prisma.seguimiento.count({
    where: { completado: false, fechaLimite: { lte: new Date() } },
  });

  return (
    <CrmShell nombre={user.name} email={user.email} rol={user.role} pendientes={pendientes}>
      {children}
    </CrmShell>
  );
}
