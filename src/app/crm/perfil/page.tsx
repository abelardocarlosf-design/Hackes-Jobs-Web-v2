import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCrmUser } from '@/lib/crm-session';
import { formatoFecha } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { CambioContrasena } from '@/components/crm/CambioContrasena';
import { Mail, Shield, CalendarDays } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PerfilPage() {
  const sesion = await getCrmUser();
  if (!sesion) redirect('/login?redirect=/crm/perfil');

  const usuario = await prisma.user.findUnique({
    where: { id: sesion.userId },
    select: { name: true, email: true, role: true, createdAt: true },
  });

  // El admin del blog usa un token sintético sin fila en `users`.
  const datos = usuario ?? {
    name: sesion.name,
    email: sesion.email,
    role: sesion.role,
    createdAt: null as Date | null,
  };

  const [candidatos, procesos, seguimientos] = await Promise.all([
    prisma.candidato.count(),
    prisma.proceso.count(),
    prisma.seguimiento.count({ where: { completado: false } }),
  ]);

  return (
    <>
      <CrmHeader titulo="Mi perfil" subtitulo="Información de tu cuenta de reclutador." />

      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center font-black text-2xl shrink-0">
                {datos.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-white font-black text-2xl truncate">{datos.name}</h2>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
                  {datos.role === 'admin' ? 'Administrador' : 'Reclutador'}
                </p>
              </div>
            </div>

            <dl className="space-y-5">
              {[
                { icono: Mail, label: 'Correo', valor: datos.email },
                { icono: Shield, label: 'Rol', valor: datos.role === 'admin' ? 'Administrador' : 'Reclutador' },
                {
                  icono: CalendarDays,
                  label: 'Miembro desde',
                  valor: datos.createdAt ? formatoFecha(datos.createdAt) : '—',
                },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-4 border-b border-white/5 pb-5 last:border-0 last:pb-0">
                  <d.icono size={17} className="text-slate-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{d.label}</dt>
                    <dd className="text-white font-bold truncate">{d.valor}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">
              Cambio de contraseña
            </h2>
            <CambioContrasena />
          </section>
        </div>

        <aside>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">
              Estado del CRM
            </h2>
            <dl className="space-y-5">
              {[
                ['Candidatos en cartera', candidatos],
                ['Procesos activos', procesos],
                ['Seguimientos pendientes', seguimientos],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-slate-500 text-xs font-medium">{k}</dt>
                  <dd className="text-white font-black text-3xl mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </>
  );
}
