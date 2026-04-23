import { Card, CardContent } from '@/components/Card';
import { getAllPosts } from '@/lib/blog';
import { getAllJobs } from '@/lib/jobs';
import { getAllSubscribers } from '@/lib/newsletter';
import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const posts = await getAllPosts();
  const jobs = await getAllJobs();
  const subscribers = await getAllSubscribers();

  const stats = [
    { label: 'Vacantes Activas', value: jobs.filter(j => j.active).length, growth: '+2 este mes', icon: Briefcase, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'Blog Posts', value: posts.length, growth: '+12% vs semana pasada', icon: FileText, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
    { label: 'Suscriptores', value: subscribers.length, growth: 'Últimos 30 días', icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-black text-brand-black uppercase tracking-tighter">Bienvenido al Hub</h1>
         <p className="text-slate-400 font-medium">Gestiona el talento, el contenido y tu equipo desde un solo lugar.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-premium p-10 hover:translate-y-[-5px] transition-all duration-500">
             <div className="flex flex-col gap-6">
                <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}>
                   <s.icon size={28} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{s.label}</h3>
                   <div className="text-6xl font-black text-brand-black tracking-tighter">{s.value}</div>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                   <ArrowUpRight size={14} />
                   <span>{s.growth}</span>
                </div>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         {/* Recent Activity */}
         <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-brand-black uppercase tracking-tighter flex items-center gap-3">
                  <Clock size={20} className="text-brand-orange" />
                  Actividad Reciente
               </h3>
               <Link href="/dashboard/blog" className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">Ver todo</Link>
            </div>
            <div className="space-y-6">
               {posts.slice(0, 4).map((post, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                       <img src={post.coverImage} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                       <h4 className="text-sm font-black text-brand-black uppercase tracking-tight truncate">{post.title}</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Publicado por {post.author}</p>
                    </div>
                    <Link href={`/blog/${post.slug}`} target="_blank">
                       <ExternalLink size={14} className="text-slate-300 hover:text-brand-blue" />
                    </Link>
                 </div>
               ))}
            </div>
         </Card>

         {/* Quick Actions */}
         <Card className="p-8">
            <h3 className="text-xl font-black text-brand-black uppercase tracking-tighter mb-8 flex items-center gap-3">
               <TrendingUp size={20} className="text-brand-blue" />
               Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Publicar Vacante', href: '/dashboard/vacantes', color: 'bg-brand-blue', icon: Briefcase },
                 { label: 'Escribir Artículo', href: '/dashboard/blog', color: 'bg-brand-orange', icon: FileText },
                 { label: 'Gestionar Equipo', href: '/dashboard/usuarios', color: 'bg-brand-black', icon: Users },
                 { label: 'Ver Sitio Web', href: '/', color: 'bg-slate-100 text-brand-black', icon: ExternalLink },
               ].map((action, i) => (
                 <Link key={i} href={action.href}>
                    <div className={`${action.color} ${action.color.includes('slate') ? 'text-brand-black' : 'text-white'} p-6 rounded-[2rem] h-40 flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-lg`}>
                       <action.icon size={24} />
                       <span className="text-xs font-black uppercase tracking-widest leading-tight">{action.label}</span>
                    </div>
                 </Link>
               ))}
            </div>
         </Card>
      </div>
    </div>
  );
}
