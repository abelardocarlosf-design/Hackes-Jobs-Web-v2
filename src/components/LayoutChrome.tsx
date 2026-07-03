'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

// Rutas donde NO se muestra Navbar/Footer pero SÍ el mesh background
const HIDE_NAV_ROUTES = ['/login', '/register'];
// Rutas donde NO se muestra nada del chrome (dashboard tiene su propio layout)
const HIDE_ALL_ROUTES = ['/dashboard'];

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideAll = HIDE_ALL_ROUTES.some(route => pathname.startsWith(route));
  const hideNav = HIDE_NAV_ROUTES.some(route => pathname.startsWith(route));

  if (hideAll) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Global animated mesh background — glassmorphism foundation */}
      <div className="mesh-canvas" aria-hidden="true">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>
      {!hideNav && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideNav && <Footer />}
      {!hideNav && <FloatingWhatsApp />}
    </>
  );
}

