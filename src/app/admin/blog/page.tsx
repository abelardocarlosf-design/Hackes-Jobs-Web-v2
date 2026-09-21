"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { BlogPost, generateSlug } from '@/lib/blog.types';
import { Plus, Edit2, Trash2, Save, Eye, FileText } from 'lucide-react';

// El acceso lo controlan src/app/admin/layout.tsx y el middleware. Esta página
// ya no tiene su propio formulario de login: antes pedía unas credenciales
// distintas a las del resto del sitio y el "logout" solo cambiaba un useState
// sin borrar ninguna cookie.
export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error();
      setPosts(await res.json());
    } catch {
      setError('No se pudieron cargar los artículos.');
    } finally {
      setCargando(false);
    }
  };

  const handleSave = async () => {
    if (!currentPost.title) return setError('El título es obligatorio.');
    setError('');

    const postToSave = {
      ...currentPost,
      slug: currentPost.slug || generateSlug(currentPost.title!),
      date: currentPost.date || new Date().toISOString(),
    } as BlogPost;

    const res = await fetch(`/api/blog/${postToSave.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postToSave)
    });

    if (res.ok) {
      setIsEditing(false);
      fetchPosts();
    } else {
      setError('No se pudo guardar el artículo.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('¿Seguro que deseas eliminar este artículo?')) return;
    const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
    if (res.ok) fetchPosts();
    else setError('No se pudo eliminar el artículo.');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Blog</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
            Artículos del sitio público.
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => {
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
            }}
            variant="secondary"
            className="flex gap-4 h-16 px-10 rounded-2xl text-[11px] font-black uppercase tracking-widest border-none"
          >
            <Plus size={20} /> Nuevo artículo
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-[11px] font-black uppercase tracking-widest">
          {error}
        </div>
      )}

      {isEditing ? (
        <Card className="p-12 space-y-10 animate-in fade-in zoom-in duration-500 bg-brand-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem]">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Título</label>
              <input
                type="text"
                className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-black text-2xl text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                value={currentPost.title}
                onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Imagen de portada (URL)</label>
              <input
                type="text"
                className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                value={currentPost.coverImage}
                onChange={e => setCurrentPost({ ...currentPost, coverImage: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Resumen (SEO)</label>
            <textarea
              className="w-full p-8 bg-white/5 border border-white/5 rounded-[2rem] font-medium text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner h-32 resize-none"
              value={currentPost.excerpt}
              onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Cuerpo del artículo</label>
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
              <RichTextEditor
                value={currentPost.content || ''}
                onChange={content => setCurrentPost({ ...currentPost, content })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-10 items-center pt-10 border-t border-white/5">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                className="w-8 h-8 rounded-xl border-2 border-white/10 bg-white/5 text-brand-orange focus:ring-brand-orange"
                checked={currentPost.published}
                onChange={e => setCurrentPost({ ...currentPost, published: e.target.checked })}
              />
              <span className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 group-hover:text-brand-orange transition-colors">Publicado</span>
            </label>

            <div className="flex-grow"></div>

            <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-slate-500 hover:text-white uppercase font-black text-[11px] tracking-widest">Descartar</Button>
            <Button onClick={handleSave} className="h-16 px-12 rounded-2xl flex gap-4 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
              <Save size={20} /> Guardar artículo
            </Button>
          </div>
        </Card>
      ) : cargando ? (
        <div className="py-40 text-center text-slate-500 font-black uppercase tracking-[0.4em]">Cargando…</div>
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
                    <Button variant="ghost" className="h-14 w-14 p-0 bg-white/5 text-slate-500 hover:text-brand-blue hover:bg-white/10 rounded-2xl" title="Vista previa"><Eye size={22} /></Button>
                  </Link>
                  <Button onClick={() => { setCurrentPost(post); setIsEditing(true); }} variant="ghost" className="h-14 w-14 p-0 bg-white/5 text-slate-500 hover:text-brand-blue hover:bg-white/10 rounded-2xl" title="Editar"><Edit2 size={22} /></Button>
                  <Button onClick={() => handleDelete(post.slug)} variant="ghost" className="h-14 w-14 p-0 bg-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl" title="Eliminar"><Trash2 size={22} /></Button>
                </div>
              </div>
            </Card>
          ))}
          {posts.length === 0 && (
            <div className="py-40 text-center text-slate-500 font-black uppercase tracking-[0.4em] bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 backdrop-blur-md">
              Aún no hay artículos.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
