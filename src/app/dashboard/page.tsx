import { Card, CardContent } from '@/components/Card';
import { getAllPosts } from '@/lib/blog';
import { vacantesActivas } from '@/data/vacantes';
import { getAllSubscribers } from '@/lib/newsletter';
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Bot,
  BrainCircuit,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const posts = await getAllPosts();
  const subscribers = await getAllSubscribers();
  const vacantesCount = vacantesActivas().length;

  const stats = [
    { label: 'Vacantes Activas', value: vacantesCount, growth: 'Catálogo file-based', icon: Briefcase, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'Blog Posts', value: posts.length, growth: 'Total publicados', icon: FileText, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
    { label: 'Suscriptores', value: subscribers.length, growth: 'Últimos 30 días', icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col gap-4">
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] w-fit">
           <Bot size={14} className="animate-pulse" />
           SaaS AI Engine Active
         </div>
         <h1 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">Command Center</h1>
         <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Control total de talento, contenido y ecosistema digital.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-3xl p-12 hover:bg-white/10 hover:translate-y-[-8px] transition-all duration-500 group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/10 transition-colors duration-500"></div>
             <div className="flex flex-col gap-8 relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${s.bg.replace('bg-', 'bg-').replace('/10', '/20')} ${s.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                   <s.icon size={32} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">{s.label}</h3>
                   <div className="text-7xl font-black text-white tracking-tighter group-hover:text-brand-orange transition-colors duration-500">{s.value}</div>
                </div>
                <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full w-fit border border-emerald-500/20">
                   <ArrowUpRight size={14} />
                   <span>{s.growth}</span>
                </div>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
         {/* Recent Activity */}
         <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                  <Clock size={24} className="text-brand-orange" />
                  Actividad de Contenido
               </h3>
               <Link href="/dashboard/blog" className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] hover:text-brand-orange transition-colors">Audit log</Link>
            </div>
            <div className="space-y-4">
               {posts.slice(0, 4).map((post, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 border border-white/10 group-hover:rotate-3 transition-transform">
                       <img src={post.coverImage} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                       <h4 className="text-[13px] font-black text-white uppercase tracking-tight truncate mb-1">{post.title}</h4>
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Autor: <span className="text-slate-300">{post.author}</span></p>
                    </div>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-brand-blue hover:bg-white/10 transition-all">
                       <ExternalLink size={18} />
                    </Link>
                 </div>
               ))}
            </div>
         </Card>

         {/* Quick Actions */}
         <Card className="p-10 bg-brand-black/40 backdrop-blur-3xl border-white/10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
               <TrendingUp size={24} className="text-brand-blue" />
               Operaciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-6">
               {[
                 { label: 'Ver Vacantes', href: '/vacantes', color: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30', icon: Briefcase },
                 { label: 'Escribir Artículo', href: '/dashboard/blog', color: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30', icon: FileText },
                 { label: 'Gestionar Equipo', href: '/dashboard/usuarios', color: 'bg-white/5 text-white border-white/10', icon: Users },
                 { label: 'Ver Sitio Web', href: '/', color: 'bg-white/10 text-white border-white/20', icon: ExternalLink },
               ].map((action, i) => (
                 <Link key={i} href={action.href} className="group">
                    <div className={`${action.color} p-8 rounded-[2.5rem] h-44 flex flex-col justify-between border hover:scale-[1.05] hover:bg-white/20 active:scale-95 transition-all duration-300 shadow-xl group-hover:shadow-brand-blue/10`}>
                       <action.icon size={28} className="group-hover:rotate-12 transition-transform" />
                       <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight">{action.label}</span>
                    </div>
                 </Link>
               ))}
            </div>
         </Card>
      </div>

      {/* Candidatos Sugeridos (Match IA) */}
      <div className="pt-12">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <BrainCircuit size={32} className="text-brand-blue" />
              Top Intelligence Matches
            </h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Filtrado dinámico por algoritmos de redes neuronales.</p>
          </div>
          <div className="hidden sm:block text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] bg-brand-blue/10 px-6 py-3 rounded-full border border-brand-blue/20 animate-pulse">
            Neural Sync Active
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { name: "Ana Martínez", role: "Sr. Frontend Eng", match: 94, skills: ["React", "TypeScript", "Next.js"], color: "brand-blue" },
            { name: "Carlos Ruiz", role: "Backend Developer", match: 88, skills: ["Node.js", "Python", "AWS"], color: "brand-orange" },
            { name: "Sofía Gómez", role: "Product Manager", match: 85, skills: ["Agile", "Scrum", "Jira"], color: "brand-blue" }
          ].map((candidate, i) => (
            <Card key={i} className="p-10 bg-white/5 backdrop-blur-3xl border-white/10 hover:border-brand-blue/50 transition-all duration-500 group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${candidate.color === 'brand-blue' ? 'bg-brand-blue' : 'bg-brand-orange'} opacity-50`}></div>
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-xl font-black text-white tracking-tight uppercase">{candidate.name}</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">{candidate.role}</p>
                </div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${candidate.color === 'brand-blue' ? 'from-brand-blue to-blue-500' : 'from-brand-orange to-orange-500'} flex items-center justify-center text-white font-black text-xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  {candidate.match}%
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Bot size={16} className="text-brand-orange" /> Core Intelligence
                </div>
                <div className="flex flex-wrap gap-3">
                  {candidate.skills.map((skill, j) => (
                    <span key={j} className="text-[9px] font-black uppercase tracking-widest bg-white/5 text-white px-4 py-2 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <CheckCircle2 size={16} /> Entrevista IA
                </div>
                <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:text-brand-orange transition-colors">
                  Expediente
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
