import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { NewsletterForm } from '@/components/NewsletterForm';
import { TypewriterHeading } from '@/components/TypewriterHeading';

export const metadata: Metadata = {
  title: 'Blog | Hacke\'s Jobs',
  description: 'Artículos, noticias y consejos sobre reclutamiento, tecnología y talento humano.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const publishedPosts = posts.filter(p => p.published);
  
  const featuredPost = publishedPosts[0];
  const remainingPosts = publishedPosts.slice(1);
  
  // Get unique tags for categories
  const allTags = Array.from(new Set(publishedPosts.flatMap(p => p.tags)));

  return (
    <div className="flex flex-col min-h-screen bg-brand-slate font-sans selection:bg-brand-orange/20 selection:text-brand-orange overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-brand-white bg-[url('/images/parallax-blog.png')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-brand-white/85 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
        
        <div className="container relative mx-auto px-4 z-10 text-center space-y-8">
           <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Conocimiento y Tendencias</span>
           <TypewriterHeading 
             text="Nuestro" 
             speed={80} 
             delay={300}
             headingClassName="text-6xl md:text-[7rem] font-black tracking-tighter text-brand-black leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000"
             afterContent={<span className="text-gradient-blue">Blog.</span>}
           />
           <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
             Explora artículos sobre el futuro del trabajo, reclutamiento inteligente y desarrollo profesional.
           </p>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      {allTags.length > 0 && (
        <section className="py-12 bg-white border-y border-slate-100 relative z-30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4">Categorías:</span>
              <Link href="/blog" className="px-6 py-2 rounded-full bg-brand-black text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-black/20">
                 Todo
              </Link>
              {allTags.map(tag => (
                <button key={tag} className="px-6 py-2 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all">
                   {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED POST */}
      {featuredPost && (
        <section className="py-24 bg-brand-slate">
           <div className="container mx-auto px-4">
              <Link href={`/blog/${featuredPost.slug}`}>
                 <div className="group relative bg-brand-black rounded-[3rem] overflow-hidden shadow-3xl flex flex-col lg:flex-row items-stretch min-h-[500px] transition-all duration-700 hover:shadow-orange/20">
                    <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
                       <Image 
                        src={featuredPost.coverImage} 
                        alt={featuredPost.title} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-gradient-to-r from-brand-black/60 to-transparent"></div>
                    </div>
                    <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center space-y-8 relative z-10">
                       <div className="flex items-center gap-4 text-[10px] font-black text-brand-orange uppercase tracking-[0.3em]">
                          <span className="bg-brand-orange/10 px-4 py-2 rounded-full">Destacado</span>
                          <span>{format(new Date(featuredPost.date), "dd MMMM, yyyy", { locale: es })}</span>
                       </div>
                       <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none group-hover:text-brand-orange transition-colors">
                          {featuredPost.title}
                       </h2>
                       <p className="text-slate-400 text-lg font-medium leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                       </p>
                       <div className="pt-4">
                          <Button variant="secondary" size="lg" className="h-16 px-12 rounded-2xl font-black uppercase text-xs tracking-widest">
                             Leer ahora
                          </Button>
                       </div>
                    </div>
                 </div>
              </Link>
           </div>
        </section>
      )}

      {/* 4. BLOG LIST */}
      <section className="py-24 bg-brand-slate relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16 max-w-7xl mx-auto">
             <h2 className="text-3xl font-black text-brand-black uppercase tracking-tighter">Más Artículos</h2>
             <div className="hidden md:block h-px flex-grow mx-10 bg-slate-200"></div>
          </div>

          {remainingPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {remainingPosts.map((post, i) => (
                <Card key={post.slug} className="group overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image 
                      src={post.coverImage || '/images/hero-illustration.png'} 
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-blue text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                        {post.tags[0] || 'Articulo'}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 flex flex-col flex-grow space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>{format(new Date(post.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                       <span className="w-1 h-1 bg-brand-orange rounded-full"></span>
                       <span>{post.author}</span>
                    </div>
                    
                    <h2 className="text-2xl font-black text-brand-black tracking-tighter uppercase leading-tight group-hover:text-brand-blue transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-500 font-medium line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" className="p-0 text-brand-orange hover:bg-transparent hover:translate-x-2 font-black uppercase text-xs tracking-widest transition-all">
                          Leer artículo <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !featuredPost ? (
            <div className="text-center py-40">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
               </div>
               <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest">Próximamente más contenido</h2>
               <p className="text-slate-400 font-medium mt-4">Estamos preparando los mejores artículos para ti.</p>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest">Más artículos en camino...</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="py-32 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-[0.05]"></div>
        <div className="container relative mx-auto px-4 z-10">
           <div className="max-w-5xl mx-auto bg-brand-blue rounded-[3rem] p-12 md:p-24 shadow-premium text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <span className="text-white/60 font-black tracking-[0.4em] uppercase text-xs block">Newsletter Exclusiva</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">Recibe lo mejor <br/> en tu bandeja.</h2>
              <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
                Únete a más de 5,000 profesionales que reciben consejos semanales sobre el mercado laboral y talento IT.
              </p>
              
              <NewsletterForm />
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Sin spam, solo valor. Cancela cuando quieras.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
