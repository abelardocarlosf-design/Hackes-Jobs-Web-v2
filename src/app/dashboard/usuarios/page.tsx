"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { User, UserRole } from '@/lib/auth.types';
import { Plus, UserPlus, Shield, User as UserIcon, Trash2, Mail, X, Save, Lock, Loader2 } from 'lucide-react';

export default function DashboardUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    passwordHash: '',
    role: 'EDITOR' as UserRole
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setIsAdding(false);
        setNewUser({ username: '', name: '', passwordHash: '', role: 'EDITOR' });
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al crear usuario');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar a ${name}? Perderá el acceso de inmediato.`)) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
         <div className="space-y-2">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Equipo de Élite</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Control de accesos y protocolos de seguridad del sistema.</p>
         </div>
         {!isAdding && (
           <Button onClick={() => setIsAdding(true)} variant="secondary" className="flex gap-4 h-16 px-10 rounded-2xl shadow-orange/20 text-[11px] font-black uppercase tracking-widest border-none">
             <UserPlus size={20} /> Invitar Operador
           </Button>
         )}
      </div>

      {isAdding ? (
        <Card className="p-12 space-y-10 animate-in fade-in zoom-in duration-500 max-w-4xl bg-brand-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem]">
           <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Nuevo Perfil</h2>
              <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors">
                 <X size={28} />
              </Button>
           </div>

           <form onSubmit={handleCreateUser} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Juan Pérez"
                      className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Identificador / Email</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                       <input 
                        type="text" 
                        required
                        placeholder="ejemplo@hackesjobs.com"
                        className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                        value={newUser.username}
                        onChange={e => setNewUser({...newUser, username: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Contraseña de Seguridad</label>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                       <input 
                        type="password" 
                        required
                        className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                        value={newUser.passwordHash}
                        onChange={e => setNewUser({...newUser, passwordHash: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Privilegios de Acceso</label>
                    <select 
                      className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none cursor-pointer"
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                    >
                       <option value="EDITOR" className="bg-brand-black">EDITOR (Sólo Contenido)</option>
                       <option value="ADMIN" className="bg-brand-black">ADMIN (Control Total)</option>
                    </select>
                 </div>
              </div>

              <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
                 <Button variant="ghost" type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white uppercase font-black text-[11px] tracking-widest">Descartar</Button>
                 <Button type="submit" className="h-16 px-12 rounded-2xl flex gap-4 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand-blue/20">
                    <Save size={20} /> Autorizar Usuario
                 </Button>
              </div>
           </form>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full py-40 flex flex-col items-center gap-6">
               <Loader2 className="animate-spin text-brand-blue" size={60} />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Sincronizando Base de Datos...</p>
            </div>
          ) : users.map((u) => (
            <Card key={u.id} className="p-10 bg-white/5 backdrop-blur-3xl border-white/10 hover:border-brand-blue/50 transition-all duration-500 group relative overflow-hidden rounded-[2.5rem]">
               {/* Decorative Gradient */}
               <div className={`absolute top-0 right-0 w-32 h-32 ${u.role === 'ADMIN' ? 'bg-brand-orange/10' : 'bg-brand-blue/10'} rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
               
               <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                  <div className="relative">
                     <div className="w-28 h-28 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-slate-500 border border-white/10 group-hover:border-brand-blue/40 transition-all duration-500 group-hover:bg-white/10 group-hover:rotate-6">
                        <UserIcon size={48} className="group-hover:text-brand-blue transition-colors" />
                     </div>
                     <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl ${u.role === 'ADMIN' ? 'bg-brand-orange' : 'bg-brand-blue'} text-white flex items-center justify-center border-4 border-brand-black shadow-2xl transform group-hover:scale-110 transition-transform`}>
                        {u.role === 'ADMIN' ? <Shield size={20} /> : <UserIcon size={20} />}
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand-blue transition-colors">{u.name}</h3>
                     <div className="flex items-center justify-center gap-3 text-slate-500 font-black uppercase text-[9px] tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <Mail size={14} className="text-brand-blue" />
                        {u.username.includes('@') ? u.username : `${u.username}@hackesjobs.com`}
                     </div>
                  </div>

                  <div className="w-full pt-8 border-t border-white/5 flex items-center justify-between">
                     <span className={`${u.role === 'ADMIN' ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/30' : 'bg-brand-blue/20 text-brand-blue border-brand-blue/30'} text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border backdrop-blur-md`}>
                        {u.role}
                     </span>
                     {u.username !== 'admin' && (
                       <Button 
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        variant="ghost" 
                        className="h-12 w-12 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                       >
                          <Trash2 size={22} />
                       </Button>
                     )}
                  </div>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
