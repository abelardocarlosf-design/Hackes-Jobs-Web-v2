'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { RUTAS_POR_ROL, RUTAS_SOLO_SESION, rutaCoincide } from '@/lib/navegacion';

// Las zonas privadas traen su propio shell (CrmShell, AdminShell…). Antes solo
// /dashboard estaba en esta lista, así que /crm y /admin renderizaban el navbar
// y el footer públicos encima de su propia cabecera: dos barras de navegación
// apiladas en cada pantalla del CRM.
const RUTAS_SIN_CHROME = [...Object.keys(RUTAS_POR_ROL), ...RUTAS_SOLO_SESION];

// Aquí sí queremos el fondo mesh, pero sin navbar ni footer.
const RUTAS_SIN_NAV = ['/login', '/register'];

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sinChrome = RUTAS_SIN_CHROME.some(ruta => rutaCoincide(pathname, ruta));
  const sinNav = RUTAS_SIN_NAV.some(ruta => rutaCoincide(pathname, ruta));

  if (sinChrome) {
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
      {!sinNav && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!sinNav && <Footer />}
      {!sinNav && <FloatingWhatsApp />}
    </>
  );
}
