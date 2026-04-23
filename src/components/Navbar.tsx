import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';

export default function Navbar() {
  return (
    <header className="fixed top-0 z-[100] w-full transition-all duration-500">
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/20 shadow-premium rounded-[2rem] px-6 sm:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="relative w-[180px] sm:w-[220px] h-12 sm:h-14">
              <Image 
                src="/logo.png" 
                fill 
                className="object-contain object-left" 
                alt="Hacke's Jobs Logo"
                priority
              />
            </div>
          </Link>

          <nav className="hidden lg:flex gap-10 items-center text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
            <Link href="/empresas" className="hover:text-brand-blue transition-all hover:tracking-[0.35em]">Empresas</Link>
            <Link href="/candidatos" className="hover:text-brand-blue transition-all hover:tracking-[0.35em]">Candidatos</Link>
            <Link href="/vacantes" className="hover:text-brand-blue transition-all hover:tracking-[0.35em]">Vacantes</Link>
            <Link href="/psicometrias" className="hover:text-brand-blue transition-all hover:tracking-[0.35em]">Psicometrías</Link>
            <Link href="/blog" className="hover:text-brand-blue transition-all hover:tracking-[0.35em]">Blog</Link>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/dashboard/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-brand-blue">
                Ingresar
              </Button>
            </Link>
            <Link href="/empresas">
              <Button variant="secondary" size="sm" className="rounded-xl px-6 h-12 font-black text-[10px] shadow-orange/40 hover:shadow-orange">
                AGENDAR LLAMADA
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
