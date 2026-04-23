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
      <div className="min-h-screen flex items-center justify-center bg-brand-slate px-4">
        <Card className="w-full max-w-md p-10">
           <div className="flex justify-center mb-8">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
           </div>
           <h1 className="text-2xl font-black text-brand-black mb-8 uppercase tracking-tighter text-center">Panel de Control</h1>
           <form onSubmit={handleLogin} className="space-y-6">
              <input 
                type="text" 
                placeholder="Usuario" 
                className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-brand-blue font-bold"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Contraseña" 
                className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-brand-blue font-bold"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
              <Button type="submit" className="w-full h-14 uppercase tracking-widest text-xs shadow-orange/40">Entrar al sistema</Button>
           </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-slate p-8 pt-40">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header & Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white p-6 rounded-[2.5rem] shadow-premium">
           <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'posts' ? 'bg-brand-black text-white shadow-xl' : 'text-slate-400 hover:text-brand-black'}`}
              >
                <FileText size={16} /> Blog Posts
              </button>
              <button 
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'subscribers' ? 'bg-brand-black text-white shadow-xl' : 'text-slate-400 hover:text-brand-black'}`}
              >
                <Users size={16} /> Suscriptores ({subscribers.length})
              </button>
           </div>

           <div className="flex gap-4">
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
                }} variant="secondary" className="flex gap-2 h-12">
                  <Plus size={18} /> Nuevo Post
                </Button>
              ) : (
                <Button onClick={exportSubscribers} variant="outline" className="flex gap-2 h-12 border-slate-200">
                  <Download size={18} /> Exportar CSV
                </Button>
              )}
              <Button onClick={() => setIsLoggedIn(false)} variant="ghost" className="flex gap-2 h-12 text-red-500 hover:bg-red-50">
                <LogOut size={18} /> Salir
              </Button>
           </div>
        </div>

        {activeTab === 'posts' ? (
          isEditing ? (
            <Card className="p-10 space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Título del Post</label>
                     <input 
                      type="text" 
                      className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-black text-xl"
                      value={currentPost.title}
                      onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Imagen de Portada (URL)</label>
                     <input 
                      type="text" 
                      className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold"
                      value={currentPost.coverImage}
                      onChange={e => setCurrentPost({...currentPost, coverImage: e.target.value})}
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Resumen (SEO)</label>
                  <textarea 
                    className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-medium h-24"
                    value={currentPost.excerpt}
                    onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Contenido Enriquecido</label>
                  <RichTextEditor 
                    value={currentPost.content || ''}
                    onChange={content => setCurrentPost({...currentPost, content})}
                  />
               </div>

               <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <input 
                      type="checkbox" 
                      className="w-6 h-6 rounded-lg border-2 border-slate-200 text-brand-blue focus:ring-brand-blue"
                      checked={currentPost.published}
                      onChange={e => setCurrentPost({...currentPost, published: e.target.checked})}
                     />
                     <span className="font-black uppercase tracking-widest text-xs group-hover:text-brand-blue">Publicado</span>
                  </label>
                  
                  <div className="flex-grow"></div>
                  
                  <Button onClick={() => setIsEditing(false)} variant="outline">Cancelar</Button>
                  <Button onClick={handleSave} className="flex gap-2"><Save size={18} /> Guardar Post</Button>
               </div>
            </Card>
          ) : (
            <div className="grid gap-6">
               {posts.map(post => (
                 <Card key={post.slug} className="p-8 group hover:border-brand-blue transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                       <div className="flex gap-6 items-center flex-1">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0">
                             <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                             <h3 className="text-xl font-black text-brand-black uppercase tracking-tighter">{post.title}</h3>
                             <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>{post.date.split('T')[0]}</span>
                                <span className={`px-2 py-0.5 rounded-full ${post.published ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                   {post.published ? 'Publicado' : 'Borrador'}
                                </span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                             <Button variant="ghost" size="sm" className="h-10 w-10 p-0" title="Ver post"><Eye size={18} /></Button>
                          </Link>
                          <Button onClick={() => {
                            setCurrentPost(post);
                            setIsEditing(true);
                          }} variant="outline" size="sm" className="h-10 w-10 p-0 text-brand-blue border-brand-blue/20" title="Editar"><Edit2 size={18} /></Button>
                          <Button onClick={() => handleDelete(post.slug)} variant="outline" size="sm" className="h-10 w-10 p-0 text-red-500 border-red-100" title="Eliminar"><Trash2 size={18} /></Button>
                       </div>
                    </div>
                 </Card>
               ))}
               {posts.length === 0 && (
                 <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-white rounded-[2rem] border border-dashed border-slate-200">
                    No hay artículos registrados aún.
                 </div>
               )}
            </div>
          )
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Email del Suscriptor</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Registro</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Estado</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {subscribers.map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 font-black text-brand-black">{s.email}</td>
                           <td className="px-8 py-6 text-slate-500 font-medium">
                              {new Date(s.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className="bg-emerald-50 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Activo</span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
                {subscribers.length === 0 && (
                  <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                     Aún no hay suscriptores registrados.
                  </div>
                )}
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
