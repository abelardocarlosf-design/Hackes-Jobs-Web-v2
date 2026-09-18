"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuth } from '@/lib/auth-context';
import { ETIQUETA_ROL, type Rol } from '@/lib/navegacion';
import { UserPlus, Shield, User as UserIcon, Trash2, Mail, X, Save, Lock, Loader2, Briefcase } from 'lucide-react';

interface UsuarioEquipo {
  id: string;
  name: string;
  email: string;
  role: Rol;
  authProvider: string;
  createdAt: string;
}

// Los reclutadores son empleados: se dan de alta aquí, no en el registro
// público. /api/auth/register sigue aceptando solo `company` y `candidate`
// justamente para que nadie pueda auto-asignarse acceso al CRM.
const ROLES: { valor: Rol; texto: string }[] = [
  { valor: 'recruiter', texto: 'Reclutador — acceso al CRM' },
  { valor: 'admin', texto: 'Administrador — control total' },
  { valor: 'company', texto: 'Empresa cliente' },
  { valor: 'candidate', texto: 'Candidato' },
];

export default function AdminEquipoPage() {
  // Sabemos quiénes somos para no ofrecer el botón de borrarnos a nosotros
  // mismos (el API también lo rechaza, esto solo evita el clic inútil).
  const { user: yo } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioEquipo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [nuevo, setNuevo] = useState({
    name: '',
    email: '',
    password: '',
    role: 'recruiter' as Rol,
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setUsuarios(json.data);
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  };

  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      // Se envía la contraseña en claro sobre HTTPS; el servidor la hashea con
      // bcrypt. El cliente nunca calcula ni envía un hash.
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || 'No se pudo crear el usuario.');
        return;
      }
      setIsAdding(false);
      setNuevo({ name: '', email: '', password: '', role: 'recruiter' });
      cargarUsuarios();
    } catch {
      setError('Error de conexión.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Perderá el acceso de inmediato.`)) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || 'No se pudo eliminar.');
        return;
      }
      cargarUsuarios();
    } catch {
      setError('Error de conexión.');
    }
  };

  const colorDeRol = (rol: Rol) =>
    rol === 'admin'
      ? { texto: 'text-brand-orange', fondo: 'bg-brand-orange', chip: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30' }
      : rol === 'recruiter'
      ? { texto: 'text-emerald-400', fondo: 'bg-emerald-500', chip: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
      : { texto: 'text-brand-blue', fondo: 'bg-brand-blue', chip: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30' };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Equipo</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
            Cuentas con acceso a la plataforma.
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="secondary" className="flex gap-4 h-16 px-10 rounded-2xl shadow-orange/20 text-[11px] font-black uppercase tracking-widest border-none">
            <UserPlus size={20} /> Nuevo usuario
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-[11px] font-black uppercase tracking-widest">
          {error}
        </div>
      )}

      {isAdding ? (
        <Card className="p-12 space-y-10 animate-in fade-in zoom-in duration-500 max-w-4xl bg-brand-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem]">
          <div className="flex items-center justify-between border-b border-white/5 pb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Nuevo usuario</h2>
            <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={28} />
            </Button>
          </div>

          <form onSubmit={crearUsuario} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Nombre completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                  value={nuevo.name}
                  onChange={e => setNuevo({ ...nuevo, name: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="nombre@hackesjobs.com.mx"
                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                    value={nuevo.email}
                    onChange={e => setNuevo({ ...nuevo, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Contraseña (mínimo 8)</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                    value={nuevo.password}
                    onChange={e => setNuevo({ ...nuevo, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Rol</label>
                <select
                  className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none cursor-pointer"
                  value={nuevo.role}
                  onChange={e => setNuevo({ ...nuevo, role: e.target.value as Rol })}
                >
                  {ROLES.map(r => (
                    <option key={r.valor} value={r.valor} className="bg-brand-black">{r.texto}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
              <Button variant="ghost" type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white uppercase font-black text-[11px] tracking-widest">Cancelar</Button>
              <Button type="submit" disabled={guardando} className="h-16 px-12 rounded-2xl flex gap-4 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand-blue/20">
                <Save size={20} /> {guardando ? 'Creando…' : 'Crear usuario'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cargando ? (
            <div className="col-span-full py-40 flex flex-col items-center gap-6">
              <Loader2 className="animate-spin text-brand-blue" size={60} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Cargando…</p>
            </div>
          ) : usuarios.map(u => {
            const c = colorDeRol(u.role);
            return (
              <Card key={u.id} className="p-10 bg-white/5 backdrop-blur-3xl border-white/10 hover:border-brand-blue/50 transition-all duration-500 group relative overflow-hidden rounded-[2.5rem]">
                <div className={`absolute top-0 right-0 w-32 h-32 ${c.fondo}/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>

                <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-slate-500 border border-white/10 group-hover:border-brand-blue/40 transition-all duration-500 group-hover:bg-white/10 group-hover:rotate-6">
                      <UserIcon size={48} className="group-hover:text-brand-blue transition-colors" />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl ${c.fondo} text-white flex items-center justify-center border-4 border-brand-black shadow-2xl transform group-hover:scale-110 transition-transform`}>
                      {u.role === 'admin' ? <Shield size={20} /> : u.role === 'recruiter' ? <Briefcase size={20} /> : <UserIcon size={20} />}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand-blue transition-colors">{u.name}</h3>
                    <div className="flex items-center justify-center gap-3 text-slate-500 font-black uppercase text-[9px] tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5 break-all">
                      <Mail size={14} className="text-brand-blue shrink-0" />
                      {u.email}
                    </div>
                    {u.authProvider === 'google' && (
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Inicia sesión con Google</div>
                    )}
                  </div>

                  <div className="w-full pt-8 border-t border-white/5 flex items-center justify-between gap-4">
                    <span className={`${c.chip} text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border backdrop-blur-md`}>
                      {ETIQUETA_ROL[u.role] ?? u.role}
                    </span>
                    {u.id !== yo?.userId && (
                      <Button
                        onClick={() => eliminarUsuario(u.id, u.name)}
                        variant="ghost"
                        className="h-12 w-12 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all shrink-0"
                        title="Eliminar"
                      >
                        <Trash2 size={22} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
