import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
             <img src="/logo.png" alt="Hacke's Jobs" className="h-10 w-auto invert brightness-0" />
          </Link>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
            Transformando el reclutamiento con inteligencia y pasión por el talento humano.
          </p>
        </div>
        
        <div>
          <h4 className="font-black uppercase tracking-widest text-xs text-brand-orange mb-8">Soluciones</h4>
          <ul className="space-y-4 text-base text-slate-300">
            <li><Link href="/empresas" className="hover:text-white transition-colors">Para Empresas</Link></li>
            <li><Link href="/candidatos" className="hover:text-white transition-colors">Para Candidatos</Link></li>
            <li><Link href="/psicometrias" className="hover:text-white transition-colors">Psicometrías</Link></li>
            <li><Link href="/vacantes" className="hover:text-white transition-colors">Bolsa de Trabajo</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-black uppercase tracking-widest text-xs text-brand-orange mb-8">Compañía</h4>
          <ul className="space-y-4 text-base text-slate-300">
            <li><Link href="#" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Privacidad</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Términos</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-black uppercase tracking-widest text-xs text-brand-orange mb-8">Conecta</h4>
          <div className="flex gap-4 mb-8">
             <a 
               href="https://www.linkedin.com/in/abelardo-carlos-flores/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-brand-blue transition-all group"
               title="LinkedIn"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
             </a>
             <a 
               href="https://www.facebook.com/profile.php?id=61571979869242" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-brand-blue transition-all group"
               title="Facebook"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
             </a>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hablemos:</p>
            <a href="mailto:abelardo.carlos@hackesjobs.com.mx" className="block text-white font-black text-lg hover:text-brand-orange transition-colors truncate max-w-full">
              abelardo.carlos@hackesjobs.com.mx
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-24 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
        <p>&copy; {new Date().getFullYear()} Hacke's Jobs. Todos los derechos reservados.</p>
        <div className="flex gap-6">
           <span>CDMX, México</span>
           <span className="text-brand-orange">Hecho con ❤️ por HJ Team</span>
        </div>
      </div>
    </footer>
  );
}
