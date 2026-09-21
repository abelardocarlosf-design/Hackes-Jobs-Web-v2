import Link from 'next/link';
import { Card } from '@/components/Card';
import { prisma } from '@/lib/prisma';
import { getSesion } from '@/lib/crm-session';
import { FileText, Plus, Phone, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ETIQUETA_ESTATUS: Record<string, string> = {
  abierta: 'Abierta',
  en_proceso: 'En proceso',
  terna_entregada: 'Terna entregada',
  cerrada: 'Cerrada',
  cancelada: 'Cancelada',
};

export default async function MiEmpresaPage() {
  const sesion = await getSesion();

  // Las requisiciones cuelgan de Cliente (registro de agencia), no de User.
  // Cliente.userId es el vínculo opcional que conecta ambos mundos: mientras un
  // reclutador no lo asigne, esta empresa no tiene requisiciones que mostrar.
  const cliente = sesion
    ? await prisma.cliente.findUnique({
        where: { userId: sesion.userId },
        include: {
          requisiciones: { orderBy: { fechaSolicitud: 'desc' }, take: 5 },
        },
      })
    : null;

  const requisiciones = cliente?.requisiciones ?? [];
  const abiertas = requisiciones.filter(r => r.estatus === 'abierta' || r.estatus === 'en_proceso').length;

  return (
    <div className="space-y-14 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
          {cliente?.razonSocial ?? 'Mi empresa'}
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
          Tus procesos de reclutamiento con Hacke&apos;s Jobs.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <Card className="border-white/10 bg-white/5 backdrop-blur-3xl p-10">
          <div className="flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center border border-white/10">
              <FileText size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Requisiciones activas</h3>
              <div className="text-6xl font-black text-white tracking-tighter">{abiertas}</div>
            </div>
          </div>
        </Card>

        <Link href="/empresas/requisicion" className="group">
          <Card className="border-brand-orange/20 bg-gradient-to-br from-orange-500/10 to-transparent backdrop-blur-3xl p-10 h-full hover:-translate-y-2 transition-all duration-500">
            <div className="flex flex-col justify-between gap-6 h-full">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <Plus size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nueva requisición</h3>
                <p className="text-slate-400 text-sm font-medium">
                  Cuéntanos qué perfil necesitas y te contactamos en 24 h.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Requisiciones recientes</h3>
          {requisiciones.length > 0 && (
            <Link href="/mi-empresa/requisiciones" className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] hover:text-brand-orange transition-colors">
              Ver todas
            </Link>
          )}
        </div>

        {requisiciones.length === 0 ? (
          <div className="py-16 text-center space-y-6">
            <p className="text-slate-400 font-medium max-w-md mx-auto">
              Todavía no hay requisiciones asociadas a tu cuenta. En cuanto solicites
              talento, tu reclutador asignado la vinculará aquí y podrás seguir el avance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/empresas/requisicion" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-600 text-white text-[10px] font-black uppercase tracking-widest">
                Solicitar talento <ArrowRight size={14} />
              </Link>
              <Link href="/contacto" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                <Phone size={14} /> Hablar con un reclutador
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requisiciones.map(r => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-white/5 border border-white/5">
                <div className="min-w-0">
                  <h4 className="text-lg font-black text-white uppercase tracking-tight truncate">{r.puesto}</h4>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                    {r.zona || 'Sin zona'} · Solicitada el {r.fechaSolicitud.toLocaleDateString('es-MX')}
                  </p>
                </div>
                <span className="text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border bg-brand-blue/20 text-brand-blue border-brand-blue/30">
                  {ETIQUETA_ESTATUS[r.estatus] ?? r.estatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
