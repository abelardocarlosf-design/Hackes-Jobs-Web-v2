import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Hacke\'s Jobs',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white font-sans pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-10 tracking-tight">Términos y Condiciones</h1>
        
        <div className="prose prose-lg text-slate-600 max-w-none space-y-6">
          <p>
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder, registrarse o usar la plataforma SaaS de Hacke's Jobs (el "Servicio"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
          </p>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">2. Descripción del Servicio (SaaS y ATS)</h2>
          <p>
            Hacke's Jobs provee un ecosistema digital de reclutamiento que incluye, pero no se limita a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Un sistema de seguimiento de candidatos (ATS) impulsado por Inteligencia Artificial.</li>
            <li>Plataforma de pruebas psicométricas adaptativas (CAT).</li>
            <li>Herramientas B2B de publicación de vacantes y filtrado inteligente.</li>
            <li>Portal B2C para perfiles profesionales y postulación a vacantes.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">3. Planes, Créditos Antigravity y Pagos</h2>
          <p>
            Los servicios B2B operan bajo un modelo de suscripción mensual (Starter, Professional, Enterprise) detallado en nuestra sección de Precios. El acceso a las funciones avanzadas de procesamiento de lenguaje natural y <i>scoring</i> de candidatos consume "Créditos Antigravity".
          </p>
          <p>
            El sistema de créditos (Gatekeeper) audita el uso de IA. Si la cuota mensual se agota, las funciones de IA quedarán pausadas hasta el siguiente ciclo de facturación o hasta que se adquiera un paquete de créditos adicional.
          </p>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">4. Propiedad Intelectual</h2>
          <p>
            El Servicio y su contenido original, características, diseño (Sistema "Stitch"), y algoritmos son propiedad exclusiva de Hacke's Jobs y están protegidos por las leyes internacionales de derechos de autor, marcas comerciales y propiedad intelectual.
          </p>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">5. Limitación de Responsabilidad</h2>
          <p>
            Hacke's Jobs funciona como un intermediario tecnológico. Aunque nuestra IA está diseñada para recomendar a los mejores perfiles, no garantizamos la contratación final, ni nos hacemos responsables por el desempeño laboral de los candidatos contratados a través de la plataforma. La decisión final de contratación es exclusiva del cliente B2B.
          </p>

          <div className="mt-16 pt-8 border-t border-slate-200">
            <Link href="/" className="text-brand-blue font-bold hover:underline">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
