'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Brain, Star, ArrowUpRight, ShieldCheck, Mail, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

// Interfaz Mock del resultado del backend de Python
interface MatchResult {
  id: string;
  score: number;
  metadata: {
    name: string;
    skills: string[];
    experience: number;
  };
}

export default function VacanteMatchPage({ params }: { params: { jobId: string } }) {
  const [candidates, setCandidates] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular llamada al endpoint /api/v1/match-candidates de Python FastAPI
    const fetchMatches = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 1500)); // Simulando latencia del LLM
      
      setCandidates([
        { id: 'cand_1', score: 0.94, metadata: { name: 'Carlos Fernández', skills: ['React', 'Next.js', 'Python'], experience: 5 } },
        { id: 'cand_2', score: 0.88, metadata: { name: 'Ana Gómez', skills: ['React', 'TypeScript', 'Node.js'], experience: 3 } },
        { id: 'cand_3', score: 0.72, metadata: { name: 'Luis Martínez', skills: ['Vue', 'Python'], experience: 2 } },
      ]);
      setIsLoading(false);
    };
    
    fetchMatches();
  }, [params.jobId]);

  return (
    <div className="space-y-12 max-w-6xl mx-auto font-sans selection:bg-brand-blue/20">
      {/* ─── HEADER VACANTE ────────────────────────── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] rounded-full">Activa</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">ID: {params.jobId}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-brand-black tracking-tighter">Senior Full-Stack Developer</h1>
          
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <MapPin size={16} /> Remoto, México
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <Briefcase size={16} /> Tiempo Completo
            </div>
          </div>
        </div>

        <button className="h-14 px-8 bg-brand-blue text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-blue/90 hover:-translate-y-1 transition-all shadow-lg shadow-brand-blue/20 flex items-center gap-3">
          <Brain size={18} />
          Reprocesar Match IA
        </button>
      </div>

      {/* ─── RESULTADOS SEMÁNTICOS (RANKING) ─────────── */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center">
            <Star size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-brand-black uppercase tracking-tight">Ranking Semántico</h2>
            <p className="text-slate-400 font-medium text-sm">Candidatos ordenados por afinidad vectorial (Pinecone)</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Vectorizando perfiles...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {candidates.map((cand, i) => (
              <motion.div 
                key={cand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-8 hover:shadow-premium transition-shadow border-2 border-transparent ${i === 0 ? 'border-emerald-500/20 bg-emerald-50/30' : ''}`}>
                  
                  {/* Score Circular */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-100" />
                      <circle 
                        cx="48" cy="48" r="40" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - cand.score)}`}
                        className={`${cand.score > 0.9 ? 'text-emerald-500' : cand.score > 0.8 ? 'text-brand-blue' : 'text-brand-orange'} transition-all duration-1000 ease-out`} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-brand-black tracking-tighter">
                        {Math.round(cand.score * 100)}%
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Match</span>
                    </div>
                  </div>

                  {/* Info Candidato */}
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-brand-black tracking-tight">{cand.metadata.name}</h3>
                      {cand.score > 0.9 && (
                         <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-widest">
                           <ShieldCheck size={12} /> Top Match
                         </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {cand.metadata.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                      <Briefcase size={14} className="text-slate-400" />
                      {cand.metadata.experience} años de experiencia comprobada
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex lg:flex-col gap-3">
                    <button className="flex-1 lg:flex-none h-12 px-6 bg-brand-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      Ver Perfil
                    </button>
                    <button className="flex-1 lg:flex-none h-12 px-6 bg-white border-2 border-slate-200 text-brand-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-colors flex items-center justify-center gap-2">
                      <Mail size={16} /> Contactar
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
