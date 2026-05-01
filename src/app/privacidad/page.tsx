import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | Hacke\'s Jobs',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white font-sans pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-10 tracking-tight">Aviso de Privacidad</h1>
        
        <div className="prose prose-lg text-slate-600 max-w-none space-y-6">
          <p>
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">1. Identidad y Domicilio del Responsable</h2>
          <p>
            En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, Hacke's Jobs (el "Responsable") hace de su conocimiento el presente Aviso de Privacidad para proteger la información de nuestros candidatos, clientes y visitantes.
          </p>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">2. Datos Personales que Recabamos</h2>
          <p>
            Para llevar a cabo las finalidades descritas en el presente Aviso de Privacidad, recabaremos los siguientes datos personales:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Datos de identificación (nombre completo, RFC, CURP).</li>
            <li>Datos de contacto (correo electrónico, teléfono, dirección).</li>
            <li>Datos laborales y académicos (currículum vitae, trayectoria, certificaciones).</li>
            <li>Datos generados por evaluaciones psicométricas y algoritmos de inteligencia artificial dentro de nuestra plataforma.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">3. Finalidades del Tratamiento de Datos</h2>
          <p>Los datos personales que recabamos de usted los utilizaremos para las siguientes finalidades primarias:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Analizar su perfil y realizar <i>matching</i> con ofertas laborales mediante Inteligencia Artificial.</li>
            <li>Administrar y aplicar pruebas psicométricas (CAT) para medir aptitudes y compatibilidad.</li>
            <li>Proveer reportes anonimizados a empresas clientes para agilizar sus procesos de selección.</li>
            <li>Procesamiento de pagos y facturación (Módulo B2B).</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">4. Derechos ARCO</h2>
          <p>
            Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
          </p>
          <p>
            Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud respectiva enviando un correo a: <strong>privacidad@hackesjobs.com</strong>
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
