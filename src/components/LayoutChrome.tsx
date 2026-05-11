'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Rutas donde NO se muestra Navbar/Footer
const HIDE_CHROME_ROUTES = ['/login', '/register', '/dashboard'];

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = HIDE_CHROME_ROUTES.some(route => pathname.startsWith(route));

  if (hideChrome) {
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
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
