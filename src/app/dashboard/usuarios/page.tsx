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
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-brand-black uppercase tracking-tighter">Equipo de Trabajo</h1>
            <p className="text-slate-400 font-medium">Gestiona los accesos y roles de tus colaboradores.</p>
         </div>
         {!isAdding && (
           <Button onClick={() => setIsAdding(true)} variant="secondary" className="flex gap-2 h-14 px-8 rounded-2xl shadow-orange/20">
             <UserPlus size={18} /> Invitar Miembro
           </Button>
         )}
      </div>

      {isAdding ? (
        <Card className="p-10 space-y-8 animate-in fade-in zoom-in duration-500 max-w-4xl">
           <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <h2 className="text-2xl font-black text-brand-black uppercase tracking-tighter">Nuevo Colaborador</h2>
              <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-brand-black">
                 <X size={24} />
              </Button>
           </div>

           <form onSubmit={handleCreateUser} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Juan Pérez"
                      className="w-full h-14 bg-slate-50 border-none rounded-xl px-6 font-bold text-brand-black focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario / Email</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                        type="text" 
                        required
                        placeholder="ejemplo@hackesjobs.com"
                        className="w-full h-14 bg-slate-50 border-none rounded-xl pl-12 pr-6 font-bold text-brand-black focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        value={newUser.username}
                        onChange={e => setNewUser({...newUser, username: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contraseña Temporal</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                        type="password" 
                        required
                        className="w-full h-14 bg-slate-50 border-none rounded-xl pl-12 pr-6 font-bold text-brand-black focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        value={newUser.passwordHash}
                        onChange={e => setNewUser({...newUser, passwordHash: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nivel de Acceso</label>
                    <select 
                      className="w-full h-14 bg-slate-50 border-none rounded-xl px-6 font-bold text-brand-black focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all appearance-none cursor-pointer"
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                    >
                       <option value="EDITOR">EDITOR (Sólo Contenido)</option>
                       <option value="ADMIN">ADMIN (Acceso Total)</option>
                    </select>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex justify-end gap-4">
                 <Button variant="ghost" type="button" onClick={() => setIsAdding(false)}>Cancelar</Button>
                 <Button type="submit" className="h-14 px-10 rounded-xl flex gap-3">
                    <Save size={18} /> Crear Usuario
                 </Button>
              </div>
           </form>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
               <Loader2 className="animate-spin text-brand-blue" size={40} />
            </div>
          ) : users.map((u) => (
            <Card key={u.id} className="p-8 hover:border-brand-blue transition-all group relative overflow-hidden shadow-premium">
               {/* Background detail */}
               <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-brand-blue/5 transition-colors"></div>
               
               <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-transparent group-hover:border-brand-blue/20 transition-all group-hover:bg-white group-hover:rotate-6">
                        <UserIcon size={40} className="group-hover:text-brand-blue transition-colors" />
                     </div>
                     <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full ${u.role === 'ADMIN' ? 'bg-brand-orange' : 'bg-brand-blue'} text-white flex items-center justify-center border-4 border-white shadow-lg`}>
                        {u.role === 'ADMIN' ? <Shield size={16} /> : <UserIcon size={16} />}
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <h3 className="text-xl font-black text-brand-black uppercase tracking-tight">{u.name}</h3>
                     <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                        <Mail size={12} className="text-brand-blue" />
                        {u.username.includes('@') ? u.username : `${u.username}@hackesjobs.com`}
                     </div>
                  </div>

                  <div className="w-full pt-8 flex items-center justify-between">
                     <span className={`${u.role === 'ADMIN' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'} text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border`}>
                        {u.role}
                     </span>
                     {u.username !== 'admin' && (
                       <Button 
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        variant="ghost" 
                        className="h-10 w-10 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                       >
                          <Trash2 size={18} />
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
