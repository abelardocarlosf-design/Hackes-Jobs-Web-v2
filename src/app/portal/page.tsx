import Link from 'next/link';
import { Card } from '@/components/Card';
import { prisma } from '@/lib/prisma';
import { getSesion } from '@/lib/crm-session';
import { vacantesActivas } from '@/data/vacantes';
import { Briefcase, BrainCircuit, FileUp, ArrowRight, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PortalPage() {
  const sesion = await getSesion();

  const candidato = sesion
    ? await prisma.candidate.findUnique({
        where: { userId: sesion.userId },
        include: { testResults: { orderBy: { createdAt: 'desc' }, take: 3, include: { test: true } } },
      })
    : null;

  const vacantes = vacantesActivas().slice(0, 3);
  const tieneCv = Boolean(candidato?.cvUrl);
  const psicometrias = candidato?.testResults ?? [];

  // Lista de pendientes concretos, no un porcentaje abstracto: le dice al
  // candidato exactamente qué le falta para estar considerable.
  const pendientes = [
    { hecho: tieneCv, texto: 'Sube tu CV', href: '/portal/perfil' },
    { hecho: Boolean(candidato?.phone), texto: 'Agrega tu teléfono de contacto', href: '/portal/perfil' },
    { hecho: psicometrias.length > 0, texto: 'Completa una evaluación psicométrica', href: '/psicometrias' },
  ];
  const faltantes = pendientes.filter(p => !p.hecho);

  return (
    <div className="space-y-14 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
          Hola, {sesion?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
          Tu perfil, tus evaluaciones y las vacantes abiertas.
        </p>
      </div>

      {/* Qué te falta */}
      <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">
          {faltantes.length === 0 ? 'Tu perfil está completo' : 'Para que te consideremos'}
        </h3>
        <div className="space-y-3">
          {pendientes.map(p => (
            <Link
              key={p.texto}
              href={p.href}
              className={`flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${p.hecho ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <span className="flex items-center gap-4">
                <CheckCircle2 size={20} className={p.hecho ? 'text-emerald-400' : 'text-slate-600'} />
                <span className={`text-[11px] font-black uppercase tracking-widest ${p.hecho ? 'text-emerald-400 line-through' : 'text-white'}`}>
                  {p.texto}
                </span>
              </span>
              {!p.hecho && <ArrowRight size={16} className="text-slate-500 shrink-0" />}
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Psicometrías */}
        <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <BrainCircuit size={24} className="text-brand-blue" />
              Mis psicometrías
            </h3>
            <Link href="/portal/psicometrias" className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] hover:text-brand-orange transition-colors">
              Ver todas
            </Link>
          </div>
          {psicometrias.length === 0 ? (
            <div className="py-10 text-center space-y-5">
              <p className="text-slate-400 font-medium">Aún no has presentado ninguna evaluación.</p>
              <Link href="/psicometrias" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                Ver catálogo <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {psicometrias.map(r => (
                <div key={r.id} className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="min-w-0">
                    <p className="text-[12px] font-black text-white uppercase tracking-tight truncate">{r.test.name}</p>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                      {r.createdAt.toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <span className="text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border bg-brand-blue/20 text-brand-blue border-brand-blue/30 shrink-0">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Vacantes */}
        <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <Briefcase size={24} className="text-brand-orange" />
              Vacantes abiertas
            </h3>
            <Link href="/vacantes" className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] hover:text-brand-orange transition-colors">
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            {vacantes.map(v => (
              <Link key={v.id} href={`/vacantes/${v.id}`} className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                <div className="min-w-0">
                  <p className="text-[12px] font-black text-white uppercase tracking-tight truncate group-hover:text-brand-orange transition-colors">{v.titulo}</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 truncate">{v.ubicacion}</p>
                </div>
                <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {!tieneCv && (
        <Link href="/portal/perfil" className="group block">
          <Card className="p-10 border-brand-orange/20 bg-gradient-to-br from-orange-500/10 to-transparent backdrop-blur-3xl hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                <FileUp size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Sube tu CV</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  Sin CV no podemos vincularte a ninguna vacante.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      )}
    </div>
  );
}
