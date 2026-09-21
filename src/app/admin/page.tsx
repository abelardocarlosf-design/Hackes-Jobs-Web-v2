import Link from 'next/link';
import { Card } from '@/components/Card';
import { prisma } from '@/lib/prisma';
import { getAllPosts } from '@/lib/blog';
import { vacantesActivas } from '@/data/vacantes';
import { getAllSubscribers } from '@/lib/newsletter';
import { MENU_POR_ROL } from '@/lib/navegacion';
import { iconoDe } from '@/components/nav/iconos';
import {
  Briefcase,
  Users,
  FileText,
  Clock,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [posts, subscribers, candidatos, requisicionesAbiertas, seguimientosVencidos] =
    await Promise.all([
      getAllPosts(),
      getAllSubscribers(),
      prisma.candidato.count(),
      prisma.requisicion.count({ where: { estatus: { in: ['abierta', 'en_proceso'] } } }),
      prisma.seguimiento.count({
        where: { completado: false, fechaLimite: { lte: new Date() } },
      }),
    ]);

  // Todos los números salen de una fuente real. La versión anterior mezclaba
  // estos contadores con tres candidatos inventados ("Ana Martínez 94% match"),
  // y eso hacía imposible saber qué cifras del panel eran ciertas.
  const stats = [
    { label: 'Candidatos en el CRM', value: candidatos, icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/20', href: '/crm/candidatos' },
    { label: 'Requisiciones abiertas', value: requisicionesAbiertas, icon: FileText, color: 'text-brand-orange', bg: 'bg-brand-orange/20', href: '/crm/requisiciones' },
    { label: 'Seguimientos vencidos', value: seguimientosVencidos, icon: AlertTriangle, color: seguimientosVencidos > 0 ? 'text-red-400' : 'text-emerald-400', bg: seguimientosVencidos > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20', href: '/crm/seguimientos?estado=vencidos' },
    { label: 'Vacantes publicadas', value: vacantesActivas().length, icon: Briefcase, color: 'text-brand-blue', bg: 'bg-brand-blue/20', href: '/vacantes' },
    { label: 'Artículos del blog', value: posts.length, icon: FileText, color: 'text-brand-orange', bg: 'bg-brand-orange/20', href: '/admin/blog' },
    { label: 'Suscriptores', value: subscribers.length, icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/20', href: '/admin/suscriptores' },
  ];

  const accesos = MENU_POR_ROL.admin.filter(i => i.href !== '/admin');

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
          Panel de administración
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
          Estado del reclutamiento, el sitio y el equipo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="group">
            <Card className="border-white/10 bg-white/5 backdrop-blur-3xl p-10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/10 transition-colors duration-500"></div>
              <div className="flex flex-col gap-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                  <s.icon size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">{s.label}</h3>
                  <div className="text-6xl font-black text-white tracking-tighter group-hover:text-brand-orange transition-colors duration-500">{s.value}</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Accesos rápidos, generados desde el mismo menú del rol */}
        <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">
            Accesos
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {accesos.map(item => {
              const Icono = iconoDe(item.icono);
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="bg-white/5 text-white border border-white/10 p-8 rounded-[2rem] h-40 flex flex-col justify-between hover:scale-[1.03] hover:bg-white/10 active:scale-95 transition-all duration-300">
                    <Icono size={26} className="text-brand-orange group-hover:rotate-12 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight">{item.etiqueta}</span>
                  </div>
                </Link>
              );
            })}
            <Link href="/" className="group">
              <div className="bg-white/5 text-white border border-white/10 p-8 rounded-[2rem] h-40 flex flex-col justify-between hover:scale-[1.03] hover:bg-white/10 active:scale-95 transition-all duration-300">
                <ExternalLink size={26} className="text-brand-blue group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight">Ver sitio web</span>
              </div>
            </Link>
          </div>
        </Card>

        {/* Actividad de contenido */}
        <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <Clock size={24} className="text-brand-orange" />
              Últimos artículos
            </h3>
            <Link href="/admin/blog" className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] hover:text-brand-orange transition-colors">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {posts.slice(0, 4).map(post => (
              <div key={post.slug} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 border border-white/10 group-hover:rotate-3 transition-transform">
                  <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-[13px] font-black text-white uppercase tracking-tight truncate mb-1">{post.title}</h4>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Autor: <span className="text-slate-300">{post.author}</span></p>
                </div>
                <Link href={`/blog/${post.slug}`} target="_blank" className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-brand-blue hover:bg-white/10 transition-all shrink-0">
                  <ExternalLink size={18} />
                </Link>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] py-10 text-center">
                Aún no hay artículos.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
