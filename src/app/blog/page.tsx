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
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-brand-black text-white bg-[url('/images/hero-bg.gif')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-brand-black/70 pointer-events-none"></div>
        
        <div className="container relative mx-auto px-4 z-10 text-center space-y-8">
           <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Conocimiento y Tendencias</span>
           <TypewriterHeading 
             text="Nuestro" 
             speed={80} 
             delay={300}
             headingClassName="text-6xl md:text-[7rem] font-black tracking-tighter text-white leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000"
             afterContent={<span className="text-brand-blue">Blog.</span>}
           />
           <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
             Explora artículos sobre el futuro del trabajo, reclutamiento inteligente y desarrollo profesional.
           </p>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      {allTags.length > 0 && (
        <section className="relative py-12 bg-brand-black border-y border-white/10 z-30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-4">Categorías:</span>
              <Link href="/blog" className="px-8 py-3 rounded-full bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-orange/20 transition-all hover:scale-105">
                 Todo
              </Link>
              {allTags.map(tag => (
                <button key={tag} className="px-8 py-3 rounded-full bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-brand-blue hover:text-white transition-all hover:scale-105">
                   {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED POST */}
      {featuredPost && (
        <section className="relative py-24 bg-brand-black overflow-hidden">
           <div className="absolute inset-0 bg-[url('/images/psicometrias-bg.gif')] bg-cover bg-center opacity-10 bg-fixed"></div>
           <div className="container relative mx-auto px-4 z-10">
              <Link href={`/blog/${featuredPost.slug}`}>
                 <div className="group relative bg-brand-black/40 backdrop-blur-xl rounded-[4rem] overflow-hidden border border-white/10 shadow-3xl flex flex-col lg:flex-row items-stretch min-h-[600px] transition-all duration-700 hover:shadow-orange/20 hover:scale-[1.01]">
                    <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
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
                          <span className="bg-brand-orange/20 px-4 py-2 rounded-full border border-brand-orange/20">Destacado</span>
                          <span className="text-slate-400">{format(new Date(featuredPost.date), "dd MMMM, yyyy", { locale: es })}</span>
                       </div>
                       <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] group-hover:text-brand-orange transition-colors">
                          {featuredPost.title}
                       </h2>
                       <p className="text-slate-300 text-xl font-medium leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                       </p>
                       <div className="pt-4">
                          <Button variant="secondary" size="xl" className="h-20 px-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-orange/40">
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
      <section className="relative py-24 bg-brand-black z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/candidatos-bg.gif')] bg-cover bg-center opacity-10 bg-fixed"></div>
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex items-center justify-between mb-16 max-w-7xl mx-auto">
             <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Más Artículos</h2>
             <div className="hidden md:block h-px flex-grow mx-10 bg-white/10"></div>
          </div>

          {remainingPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {remainingPosts.map((post, i) => (
                <Card key={post.slug} className="group glass-card overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 hover:bg-white/10 transition-all border-none" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image 
                      src={post.coverImage || '/images/hero-illustration.png'} 
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-brand-blue text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl">
                        {post.tags[0] || 'Articulo'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-10 flex flex-col flex-grow space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span>{format(new Date(post.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                       <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
                       <span>{post.author}</span>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight group-hover:text-brand-orange transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-400 font-medium line-clamp-3 flex-grow leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="pt-6 border-t border-white/5">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" className="p-0 text-brand-orange hover:bg-transparent hover:translate-x-3 font-black uppercase text-xs tracking-widest transition-all">
                          Leer artículo <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : !featuredPost ? (
            <div className="text-center py-40">
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-700 border border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
               </div>
               <h2 className="text-3xl font-black text-white uppercase tracking-widest">Próximamente más contenido</h2>
               <p className="text-slate-500 font-medium mt-4">Estamos preparando los mejores artículos para ti.</p>
            </div>
          ) : (
            <div className="text-center py-20 glass-card border-dashed">
               <p className="text-slate-500 font-black uppercase tracking-widest">Más artículos en camino...</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="relative py-32 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/empresas-bg.gif')] bg-cover bg-center opacity-20 bg-fixed"></div>
        <div className="container relative mx-auto px-4 z-10">
           <div className="max-w-5xl mx-auto glass-card-blue rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden border-none">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
              
              <span className="text-white/60 font-black tracking-[0.4em] uppercase text-xs block">Newsletter Exclusiva</span>
              <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase drop-shadow-xl">Recibe lo mejor <br/> en tu bandeja.</h2>
              <p className="text-white/90 text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                Únete a más de 5,000 profesionales que reciben consejos semanales sobre el mercado laboral y talento IT.
              </p>
              
              <div className="max-w-xl mx-auto">
                <NewsletterForm />
              </div>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Sin spam, solo valor. Cancela cuando quieras.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
