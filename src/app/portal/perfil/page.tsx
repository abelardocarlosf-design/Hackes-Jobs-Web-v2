import Link from 'next/link';
import { Card } from '@/components/Card';
import { prisma } from '@/lib/prisma';
import { getSesion } from '@/lib/crm-session';
import { CambioContrasena } from '@/components/crm/CambioContrasena';
import { FileUp, CheckCircle2, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PortalPerfilPage() {
  const sesion = await getSesion();

  const [candidato, usuario] = await Promise.all([
    sesion ? prisma.candidate.findUnique({ where: { userId: sesion.userId } }) : null,
    sesion ? prisma.user.findUnique({ where: { id: sesion.userId }, select: { authProvider: true } }) : null,
  ]);

  const tieneCv = Boolean(candidato?.cvUrl);
  const esGoogle = usuario?.authProvider === 'google';

  const datos = [
    { etiqueta: 'Nombre', valor: sesion?.name },
    { etiqueta: 'Email', valor: sesion?.email },
    { etiqueta: 'Teléfono', valor: candidato?.phone },
    { etiqueta: 'Años de experiencia', valor: candidato?.experienceYears ? String(candidato.experienceYears) : null },
    { etiqueta: 'Formación', valor: candidato?.education },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Mi perfil</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
          Los datos que ve el reclutador cuando te considera para una vacante.
        </p>
      </div>

      {/* CV */}
      <Card className={`p-10 backdrop-blur-3xl ${tieneCv ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gradient-to-br from-orange-500/10 to-transparent border-brand-orange/20'}`}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 ${tieneCv ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-orange/20 text-brand-orange'}`}>
              {tieneCv ? <CheckCircle2 size={28} /> : <FileUp size={28} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                {tieneCv ? 'CV recibido' : 'Falta tu CV'}
              </h3>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {tieneCv
                  ? 'Ya lo tenemos. Puedes enviar una versión actualizada cuando quieras.'
                  : 'Sin CV no podemos vincularte a ninguna vacante.'}
              </p>
            </div>
          </div>
          <Link
            href="/candidatos#enviar-cv"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            {tieneCv ? 'Actualizar CV' : 'Subir CV'}
          </Link>
        </div>
      </Card>

      {/* Datos */}
      <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Mis datos</h3>
        <dl className="grid sm:grid-cols-2 gap-8">
          {datos.map(d => (
            <div key={d.etiqueta} className="space-y-2">
              <dt className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{d.etiqueta}</dt>
              <dd className={`font-bold ${d.valor ? 'text-white' : 'text-slate-600 flex items-center gap-2'}`}>
                {d.valor || (<><AlertCircle size={14} /> Sin capturar</>)}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-10 pt-8 border-t border-white/5">
          ¿Algún dato incorrecto? Escríbenos desde{' '}
          <Link href="/contacto" className="text-brand-blue hover:text-brand-orange transition-colors">contacto</Link>{' '}
          y lo corregimos.
        </p>
      </Card>

      {/* Contraseña: no aplica a cuentas de Google, que no tienen una. */}
      {!esGoogle && <CambioContrasena />}
    </div>
  );
}
