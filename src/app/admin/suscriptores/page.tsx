"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Subscriber } from '@/lib/newsletter.types';
import { Download } from 'lucide-react';

// Extraído de la pestaña "Suscriptores" que vivía dentro de /admin/blog.
// Son dos cosas distintas y merecen dos URLs.
export default function AdminSuscriptoresPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/subscribers');
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error();
        setSubscribers(json.data);
      } catch {
        setError('No se pudieron cargar los suscriptores.');
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const exportarCsv = () => {
    const csv = 'Email,Fecha\n' + subscribers.map(s => `${s.email},${s.date}`).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'suscriptores_hackesjobs.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Suscriptores</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
            {subscribers.length} registrados desde el formulario del blog.
          </p>
        </div>
        {subscribers.length > 0 && (
          <Button onClick={exportarCsv} variant="outline" className="flex gap-4 h-16 px-10 rounded-2xl border-white/10 text-white bg-white/5 hover:bg-white/10 font-black text-[11px] uppercase tracking-widest">
            <Download size={20} /> Exportar CSV
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-[11px] font-black uppercase tracking-widest">
          {error}
        </div>
      )}

      <Card className="overflow-hidden bg-brand-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Email</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Fecha de alta</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map((s, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-10 py-8 font-black text-white group-hover:text-brand-blue transition-colors">{s.email}</td>
                  <td className="px-10 py-8 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    {new Date(s.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border border-emerald-500/20 backdrop-blur-md">Activo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!cargando && subscribers.length === 0 && (
          <div className="py-40 text-center text-slate-500 font-black uppercase tracking-[0.4em]">
            Aún no hay suscriptores.
          </div>
        )}
        {cargando && (
          <div className="py-40 text-center text-slate-500 font-black uppercase tracking-[0.4em]">Cargando…</div>
        )}
      </Card>
    </div>
  );
}
