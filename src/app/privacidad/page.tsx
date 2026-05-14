import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | Hacke\'s Jobs',
};

export default function PrivacidadPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>
      
      <div className="container relative mx-auto px-4 max-w-4xl z-10 pt-40 pb-24">
        <div className="glass-card-dark p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tight uppercase">Aviso de Privacidad Integral</h1>
          
          <div className="prose prose-invert prose-lg max-w-none space-y-6 prose-headings:font-black prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
            <p className="text-brand-orange font-bold uppercase tracking-widest text-sm">
              Hackes Jobs Technologies<br/>
              Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Identidad y Domicilio del Responsable</h2>
            <p>
              <strong>CAFA950413-CZ3</strong>, en lo sucesivo "HACKES JOBS TECHNOLOGIES", con domicilio fiscal en C JOSEFA ORTIZ DE DOMINGUEZ 108 SAN MATEO OTZACATIPAN, TOLUCA, Estado de México, México, C.P. 50220, es el responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento, y los Lineamientos del Aviso de Privacidad emitidos por el INAI.
            </p>
            <p>
              <strong>Contacto del responsable:</strong> abelardo.carlos@hackesjobs.com.mx
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Datos Personales que Recabamos</h2>
            <p>Recabamos las siguientes categorías de datos, dependiendo de su rol como candidato, cliente empresarial o usuario del sitio:</p>
            
            <h3 className="text-xl mt-6">DE CANDIDATOS Y POSTULANTES:</h3>
            <ul>
              <li><strong>Datos de identificación:</strong> nombre completo, fecha de nacimiento, género, nacionalidad, CURP, RFC.</li>
              <li><strong>Datos de contacto:</strong> domicilio, teléfono, correo electrónico.</li>
              <li><strong>Datos académicos y laborales:</strong> historial educativo, certificaciones, experiencia laboral, referencias, expectativa salarial.</li>
              <li><strong>Datos derivados de evaluaciones psicométricas:</strong> respuestas a las baterías aplicadas (DISC, 16PF, Moss, Zavic, Lüscher, MMPI-2, Terman-Merrill, Raven, Kostick, Allport), resultados, perfiles conductuales e interpretaciones generadas por nuestro sistema y validadas por personal profesional.</li>
              <li><strong>Datos sensibles:</strong> las evaluaciones psicométricas clínicas (MMPI-2, 16PF) pueden generar información sensible relativa a estado emocional, rasgos de personalidad y aspectos psicológicos. El tratamiento de estos datos se realiza con su consentimiento expreso, bajo supervisión de psicólogo titulado y con las medidas de seguridad reforzadas que se describen más adelante.</li>
            </ul>

            <h3 className="text-xl mt-6">DE CLIENTES EMPRESARIALES Y SUS REPRESENTANTES:</h3>
            <ul>
              <li><strong>Datos de identificación y contacto:</strong> nombre, puesto, correo corporativo, teléfono.</li>
              <li><strong>Datos fiscales:</strong> razón social, RFC, domicilio fiscal, régimen fiscal, uso de CFDI, método de pago.</li>
            </ul>

            <h3 className="text-xl mt-6">DE VISITANTES DEL SITIO:</h3>
            <ul>
              <li>Datos de navegación recabados mediante cookies y tecnologías similares (ver sección de cookies).</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Finalidades del Tratamiento</h2>
            <p><strong>FINALIDADES PRIMARIAS</strong> (necesarias para la relación jurídica; el tratamiento de sus datos para estos fines no requiere consentimiento adicional bajo el artículo 10 de la LFPDPPP en lo aplicable, pero usted ha sido informado):</p>
            <ul>
              <li>Prestar servicios de reclutamiento y selección de personal por cuenta de nuestros clientes empresariales.</li>
              <li>Aplicar, procesar e interpretar evaluaciones psicométricas como parte del proceso de selección.</li>
              <li>Transferir su candidatura, perfil y resultados de evaluación al cliente empresarial que solicitó el proceso de reclutamiento.</li>
              <li>Dar seguimiento post-contratación durante los 90 días siguientes a la colocación para fines de garantía y control de calidad del servicio.</li>
              <li>Emitir comprobantes fiscales digitales (CFDI 4.0), cobrar contraprestaciones y cumplir obligaciones fiscales y contables.</li>
              <li>Cumplir obligaciones legales aplicables y atender requerimientos de autoridades competentes.</li>
            </ul>

            <p><strong>FINALIDADES SECUNDARIAS</strong> (no necesarias para la relación jurídica; puede oponerse a estas en cualquier momento sin afectar el servicio principal):</p>
            <ul>
              <li>Mantenerlo en nuestra base de candidatos para considerarlo en futuros procesos de reclutamiento con otros clientes.</li>
              <li>Enviarle comunicaciones sobre vacantes, oportunidades laborales, contenido informativo y actualizaciones del servicio.</li>
              <li>Elaborar estadísticas agregadas y anonimizadas para mejorar nuestros procesos y modelos de evaluación.</li>
            </ul>
            <p>Si usted desea oponerse al tratamiento para las finalidades secundarias, puede manifestarlo enviando correo a abelardo.carlos@hackesjobs.com.mx con asunto "OPOSICIÓN — FINALIDADES SECUNDARIAS" en un plazo de 5 días hábiles a partir de que reciba este aviso. Su negativa no será motivo para negarle el servicio principal.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Transferencias de Datos</h2>
            <p>Sus datos personales serán transferidos a los siguientes terceros sin requerir su consentimiento adicional, en términos del artículo 37 de la LFPDPPP:</p>
            <ul>
              <li><strong>AL CLIENTE EMPRESARIAL</strong> que solicitó el proceso de reclutamiento, para que evalúe su candidatura y, en su caso, lo contrate.</li>
              <li><strong>A AUTORIDADES</strong> competentes cuando exista requerimiento legal fundado y motivado.</li>
            </ul>

            <p>Las siguientes transferencias se realizan con su consentimiento (al aceptar este aviso lo otorga expresamente):</p>
            <ul>
              <li>A nuestros <strong>PROVEEDORES TECNOLÓGICOS</strong> (encargados del tratamiento) que prestan servicios de infraestructura, hospedaje, procesamiento de pagos, análisis y comunicación: Stripe, Inc.; proveedores de servicios de nube y modelos de inteligencia artificial (OpenAI, Anthropic, Google); proveedor de facturación electrónica autorizado; servicios de mensajería (WhatsApp Business API). Estos terceros operan bajo contratos que les obligan a cumplir la LFPDPPP y a aplicar medidas de seguridad equivalentes.</li>
            </ul>

            <p>Algunas transferencias implican envío de datos fuera del territorio nacional. Al aceptar este aviso, usted otorga consentimiento expreso para dichas transferencias internacionales, las cuales se realizan bajo cláusulas contractuales que garantizan el nivel de protección exigido por la LFPDPPP.</p>
            <p>Si no desea autorizar las transferencias que requieren su consentimiento, puede manifestarlo en los mismos términos descritos para las finalidades secundarias. En ese caso, le informamos que no podremos prestarle el servicio de reclutamiento, ya que la transferencia al cliente empresarial y a los proveedores tecnológicos es indispensable para su operación.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Derechos ARCO y Procedimiento para Ejercerlos</h2>
            <p>Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO), así como a revocar el consentimiento otorgado y a limitar el uso o divulgación de sus datos.</p>
            <p>Para ejercer cualquiera de estos derechos, envíe solicitud al correo abelardo.carlos@hackesjobs.com.mx con la siguiente información:</p>
            <ol>
              <li>Nombre completo y medio para comunicarle la respuesta.</li>
              <li>Documento que acredite su identidad (INE, pasaporte) o, en su caso, la representación legal.</li>
              <li>Descripción clara y precisa del derecho que ejerce y de los datos sobre los que recae.</li>
              <li>Cualquier otro elemento que facilite la localización de los datos.</li>
            </ol>
            <p><strong>Plazos:</strong><br/>
              - Respondemos su solicitud en un máximo de 20 días hábiles.<br/>
              - Si procede, hacemos efectiva la solicitud en los 15 días hábiles siguientes a la respuesta.
            </p>
            <p>Si considera que su derecho ha sido vulnerado, puede acudir al Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI) en <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer">www.inai.org.mx</a>.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Medidas de Seguridad</h2>
            <p>HACKES JOBS TECHNOLOGIES aplica medidas administrativas, técnicas y físicas para proteger sus datos personales, incluyendo:</p>
            <ul>
              <li>Cifrado en tránsito con TLS 1.3 y en reposo con AES-256.</li>
              <li>Aislamiento multi-tenant: los datos de cada cliente y candidato están segregados lógicamente.</li>
              <li>Control de accesos por roles y autenticación reforzada.</li>
              <li>Bitácoras de acceso y auditoría de operaciones sobre datos sensibles.</li>
              <li>Convenios de confidencialidad con todo el personal y proveedores con acceso a datos personales.</li>
              <li>Supervisión profesional de psicólogo titulado en el tratamiento de pruebas clínicas (MMPI-2, 16PF).</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Uso de Cookies y Tecnologías Similares</h2>
            <p>Nuestro sitio utiliza cookies propias y de terceros para fines operativos, analíticos y de mejora de experiencia. Puede deshabilitarlas desde la configuración de su navegador. La lista detallada de cookies y su propósito está disponible bajo solicitud.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Cambios al Aviso</h2>
            <p>Cualquier modificación a este Aviso de Privacidad será publicada en www.hackesjobs.com.mx/privacidad con indicación clara de la fecha de última actualización. Le recomendamos revisarlo periódicamente.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">Consentimiento</h2>
            <p>Al proporcionar sus datos personales a través de formularios, correo electrónico, evaluaciones aplicadas o cualquier otro medio, usted manifiesta haber leído, entendido y aceptado los términos de este Aviso de Privacidad, así como las transferencias y finalidades secundarias descritas, salvo que manifieste su negativa en los términos previstos.</p>

            <div className="mt-16 pt-8 border-t border-white/10">
              <Link href="/" className="text-brand-orange font-bold hover:underline uppercase text-xs tracking-widest">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
