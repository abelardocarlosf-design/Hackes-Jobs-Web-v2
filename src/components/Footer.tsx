import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-32 pb-16 overflow-hidden relative border-t border-white/5">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none opacity-50"></div>
      
      <div className="container relative mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 z-10">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3">
             <img src="/logo.png" alt="Hacke's Jobs" className="h-12 w-auto drop-shadow-2xl" />
          </Link>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xs font-medium">
            Redefiniendo el futuro del trabajo con Inteligencia Artificial y un enfoque humano inquebrantable.
          </p>
        </div>
        
        <div>
          <h4 className="font-black uppercase tracking-[0.4em] text-[10px] text-brand-orange mb-10">Soluciones</h4>
          <ul className="space-y-5 text-[14px] font-black uppercase tracking-widest text-slate-300">
            <li><Link href="/empresas" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Para Empresas</Link></li>
            <li><Link href="/candidatos" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Para Candidatos</Link></li>
            <li><Link href="/psicometrias" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Psicometrías</Link></li>
            <li><Link href="/vacantes" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Bolsa de Trabajo</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-black uppercase tracking-[0.4em] text-[10px] text-brand-orange mb-10">Compañía</h4>
          <ul className="space-y-5 text-[14px] font-black uppercase tracking-widest text-slate-300">
            <li><Link href="#" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Sobre Nosotros</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Contacto</Link></li>
            <li><Link href="/privacidad" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Privacidad</Link></li>
            <li><Link href="/terminos" className="hover:text-brand-orange transition-all hover:translate-x-2 inline-block">Términos</Link></li>
          </ul>
        </div>
        
        <div className="space-y-10">
          <div>
            <h4 className="font-black uppercase tracking-[0.4em] text-[10px] text-brand-orange mb-8">Nuestras Redes</h4>
            <div className="flex gap-5">
               <a 
                 href="https://www.linkedin.com/in/abelardo-carlos-flores/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all group"
                 title="LinkedIn"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
               </a>
               <a 
                 href="https://www.facebook.com/profile.php?id=61571979869242" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all group"
                 title="Facebook"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
               </a>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">¿Dudas? Escríbenos:</p>
            <a href="mailto:abelardo.carlos@hackesjobs.com.mx" className="block text-white font-black text-lg hover:text-brand-orange transition-colors truncate max-w-full tracking-tight">
              soporte@hackesjobs.com.mx
            </a>
          </div>
        </div>
      </div>
      
      <div className="container relative mx-auto px-4 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">
        <p>&copy; {new Date().getFullYear()} Hacke&apos;s Jobs Platform. All Rights Reserved.</p>
        <div className="flex gap-8 items-center">
           <span className="hidden sm:inline">Ciudad de México, MX</span>
           <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
           <span className="text-brand-orange animate-pulse">Engineering Excellence</span>
        </div>
      </div>
    </footer>
  );
}
