"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { BlogPost, generateSlug } from '@/lib/blog.types';
import { Subscriber } from '@/lib/newsletter.types';
import { Plus, Edit2, Trash2, LogOut, Save, X, Eye, Users, FileText, Download } from 'lucide-react';

export default function AdminBlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'subscribers'>('posts');
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    author: 'Admin HJ',
    tags: [],
    published: false,
    coverImage: '/images/hero-illustration.png'
  });

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username: user, password: pass })
    });
    if (res.ok) {
      setIsLoggedIn(true);
      fetchPosts();
      fetchSubscribers();
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const fetchPosts = async () => {
    const res = await fetch('/api/blog');
    const data = await res.json();
    setPosts(data);
  };

  const fetchSubscribers = async () => {
    const res = await fetch('/api/admin/subscribers');
    const data = await res.json();
    setSubscribers(data);
  };

  const handleSave = async () => {
    if (!currentPost.title) return alert('Título requerido');
    
    const postToSave = {
      ...currentPost,
      slug: currentPost.slug || generateSlug(currentPost.title!),
      date: currentPost.date || new Date().toISOString(),
    } as BlogPost;

    const res = await fetch(`/api/blog/${postToSave.slug}`, {
      method: 'PUT',
      body: JSON.stringify(postToSave)
    });

    if (res.ok) {
      setIsEditing(false);
      fetchPosts();
      alert('Post guardado con éxito');
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm('¿Seguro que deseas eliminar este post?')) {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
    }
  };

  const exportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Fecha\n"
      + subscribers.map(s => `${s.email},${s.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "suscriptores_hackesjobs.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.gif')] bg-cover bg-center opacity-10 bg-fixed pointer-events-none"></div>
        <Card className="w-full max-w-lg p-12 bg-brand-black/60 backdrop-blur-3xl border-white/10 rounded-[3rem] shadow-2xl relative z-10">
           <div className="flex justify-center mb-10">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto drop-shadow-2xl" />
           </div>
           <h1 className="text-3xl font-black text-white mb-10 uppercase tracking-tighter text-center">Neural Blog Center</h1>
           <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Identificador de Acceso</label>
                 <input 
                   type="text" 
                   placeholder="Usuario" 
                   className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                   value={user}
                   onChange={e => setUser(e.target.value)}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Código de Seguridad</label>
                 <input 
                   type="password" 
                   placeholder="Contraseña" 
                   className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                   value={pass}
                   onChange={e => setPass(e.target.value)}
                 />
              </div>
              <Button type="submit" className="w-full h-16 uppercase tracking-[0.3em] font-black text-[11px] shadow-orange/40 rounded-2xl border-none">Sincronizar Nodo</Button>
           </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black p-8 pt-40 relative">
      <div className="absolute inset-0 bg-[url('/images/hero-bg.gif')] bg-cover bg-center opacity-[0.05] bg-fixed pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header & Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-brand-black/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
           <div className="flex items-center gap-6 bg-white/5 p-3 rounded-2xl border border-white/5">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`flex items-center gap-4 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'posts' ? 'bg-brand-orange text-white shadow-2xl shadow-brand-orange/20' : 'text-slate-500 hover:text-white'}`}
              >
                <FileText size={18} /> Artículos
              </button>
              <button 
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center gap-4 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'subscribers' ? 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/20' : 'text-slate-500 hover:text-white'}`}
              >
                <Users size={18} /> Suscriptores ({subscribers.length})
              </button>
           </div>

           <div className="flex gap-6">
              {activeTab === 'posts' ? (
                <Button onClick={() => {
                  setIsEditing(true);
                  setCurrentPost({
                    title: '',
                    content: '',
                    excerpt: '',
                    author: 'Admin HJ',
                    tags: [],
                    published: false,
                    coverImage: '/images/hero-illustration.png'
                  });
                }} variant="secondary" className="flex gap-4 h-16 px-10 rounded-2xl text-[11px] font-black uppercase tracking-widest border-none">
                  <Plus size={20} /> Nuevo Post
                </Button>
              ) : (
                <Button onClick={exportSubscribers} variant="outline" className="flex gap-4 h-16 px-10 rounded-2xl border-white/10 text-white bg-white/5 hover:bg-white/10 font-black text-[11px] uppercase tracking-widest">
                  <Download size={20} /> Exportar CSV
                </Button>
              )}
              <Button onClick={() => setIsLoggedIn(false)} variant="ghost" className="flex gap-4 h-16 px-8 text-red-400 hover:bg-red-500/10 font-black text-[11px] uppercase tracking-widest">
                <LogOut size={20} /> Desconexión
              </Button>
           </div>
        </div>

        {activeTab === 'posts' ? (
          isEditing ? (
            <Card className="p-12 space-y-10 animate-in fade-in zoom-in duration-500 bg-brand-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem]">
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Título de la Publicación</label>
                     <input 
                      type="text" 
                      className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-black text-2xl text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                      value={currentPost.title}
                      onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Imagen de Portada (URL)</label>
                     <input 
                      type="text" 
                      className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                      value={currentPost.coverImage}
                      onChange={e => setCurrentPost({...currentPost, coverImage: e.target.value})}
                     />
                  </div>
               </div>
               
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Resumen de Impacto (SEO)</label>
                  <textarea 
                    className="w-full p-8 bg-white/5 border border-white/5 rounded-[2rem] font-medium text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner h-32 resize-none"
                    value={currentPost.excerpt}
                    onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Cuerpo del Artículo</label>
                  <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
                    <RichTextEditor 
                      value={currentPost.content || ''}
                      onChange={content => setCurrentPost({...currentPost, content})}
                    />
                  </div>
               </div>

               <div className="flex flex-wrap gap-10 items-center pt-10 border-t border-white/5">
                  <label className="flex items-center gap-4 cursor-pointer group">
                     <input 
                      type="checkbox" 
                      className="w-8 h-8 rounded-xl border-2 border-white/10 bg-white/5 text-brand-orange focus:ring-brand-orange"
                      checked={currentPost.published}
                      onChange={e => setCurrentPost({...currentPost, published: e.target.checked})}
                     />
                     <span className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 group-hover:text-brand-orange transition-colors">Estado de Publicación</span>
                  </label>
                  
                  <div className="flex-grow"></div>
                  
                  <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-slate-500 hover:text-white uppercase font-black text-[11px] tracking-widest">Descartar</Button>
                  <Button onClick={handleSave} className="h-16 px-12 rounded-2xl flex gap-4 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
                    <Save size={20} /> Guardar Artículo
                  </Button>
               </div>
            </Card>
          ) : (
            <div className="grid gap-6">
               {posts.map(post => (
                 <Card key={post.slug} className="p-8 bg-white/5 backdrop-blur-3xl border-white/10 hover:border-brand-blue/50 transition-all duration-500 group relative overflow-hidden rounded-[2.5rem]">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-10 relative z-10">
                       <div className="flex gap-8 items-center flex-1">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 border border-white/10 group-hover:rotate-3 transition-transform">
                             <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-2">
                             <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand-blue transition-colors">{post.title}</h3>
                             <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><FileText size={14} className="text-brand-orange" /> {post.date.split('T')[0]}</span>
                                <span className={`px-4 py-1.5 rounded-full border ${post.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                   {post.published ? 'Publicado' : 'Borrador'}
                                </span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                             <Button variant="ghost" className="h-14 w-14 p-0 bg-white/5 text-slate-500 hover:text-brand-blue hover:bg-white/10 rounded-2xl" title="Vista Previa"><Eye size={22} /></Button>
                          </Link>
                          <Button onClick={() => {
                            setCurrentPost(post);
                            setIsEditing(true);
                          }} variant="ghost" className="h-14 w-14 p-0 bg-white/5 text-slate-500 hover:text-brand-blue hover:bg-white/10 rounded-2xl" title="Editar"><Edit2 size={22} /></Button>
                          <Button onClick={() => handleDelete(post.slug)} variant="ghost" className="h-14 w-14 p-0 bg-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl" title="Eliminar"><Trash2 size={22} /></Button>
                       </div>
                    </div>
                 </Card>
               ))}
               {posts.length === 0 && (
                 <div className="py-40 text-center text-slate-500 font-black uppercase tracking-[0.4em] bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 backdrop-blur-md">
                    El repositorio está vacío. Crea contenido de impacto.
                 </div>
               )}
            </div>
          )
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <Card className="overflow-hidden bg-brand-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                           <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Email del Suscriptor</th>
                           <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Nodo de Registro</th>
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
                {subscribers.length === 0 && (
                  <div className="py-40 text-center text-slate-500 font-black uppercase tracking-[0.4em]">
                     No hay conexiones registradas aún.
                  </div>
                )}
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
