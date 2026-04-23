import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { Button } from '@/components/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post no encontrado' };

  return {
    title: `${post.title} | Blog HJ`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.published && p.tags.some(t => post.tags.includes(t)))
    .slice(0, 2);

  return (
    <article className="flex flex-col min-h-screen bg-white font-sans selection:bg-brand-orange/20 selection:text-brand-orange overflow-x-hidden">
      
      {/* 1. ARTICLE HERO */}
      <header className="relative pt-40 pb-20 overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center opacity-[0.05] pointer-events-none"></div>
        <div className="container relative mx-auto px-4 z-10 max-w-4xl">
           <div className="flex flex-wrap gap-4 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="bg-brand-blue/20 text-brand-blue text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-brand-blue/30">
                   {tag}
                </span>
              ))}
           </div>
           
           <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             {post.title}
           </h1>
           
           <div className="flex items-center gap-6 text-slate-400 font-black uppercase text-xs tracking-widest border-t border-white/10 pt-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-black">
                   {post.author.charAt(0)}
                 </div>
                 <span className="text-white">{post.author}</span>
              </div>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>{format(new Date(post.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
           </div>
        </div>
      </header>

      {/* 2. FEATURED IMAGE */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 max-w-5xl">
         <div className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <Image 
              src={post.coverImage || '/images/hero-illustration.png'} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
         </div>
      </div>

      {/* 3. CONTENT SECTION */}
      <section className="py-24 container mx-auto px-4 max-w-4xl relative">
        <div 
          className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-a:text-brand-blue prose-img:rounded-[2rem] prose-strong:text-brand-black"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* SHARE BUTTONS */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
           <div className="space-y-2 text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">¿Te gustó el artículo?</p>
              <h4 className="text-xl font-black text-brand-black uppercase tracking-tight">Compártelo con tu red</h4>
           </div>
           <div className="flex gap-4">
              <Button variant="outline" className="w-12 h-12 rounded-xl p-0 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all border-slate-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </Button>
              <Button variant="outline" className="w-12 h-12 rounded-xl p-0 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all border-slate-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Button>
           </div>
        </div>
      </section>

      {/* 4. RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-brand-slate">
          <div className="container mx-auto px-4 max-w-7xl">
            <h3 className="text-3xl font-black text-brand-black uppercase tracking-tighter mb-12 text-center">Artículos Relacionados</h3>
            <div className="grid md:grid-cols-2 gap-10">
               {relatedPosts.map(p => (
                 <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 p-6 flex flex-col sm:flex-row gap-8 items-center">
                       <div className="relative w-full sm:w-40 h-40 shrink-0 rounded-2xl overflow-hidden">
                          <Image src={p.coverImage} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                       </div>
                       <div className="space-y-4 text-left">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{p.tags[0]}</span>
                          <h4 className="text-xl font-black text-brand-black uppercase leading-tight group-hover:text-brand-blue transition-colors">{p.title}</h4>
                          <p className="text-slate-400 text-sm line-clamp-2">{p.excerpt}</p>
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. BACK TO BLOG */}
      <div className="py-20 flex justify-center">
         <Link href="/blog">
           <Button variant="secondary" size="lg" className="h-16 px-12 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-orange/40">
             Volver al blog
           </Button>
         </Link>
      </div>
    </article>
  );
}
