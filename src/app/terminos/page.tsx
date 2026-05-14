import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Hacke\'s Jobs',
};

export default function TerminosPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>
      
      <div className="container relative mx-auto px-4 max-w-4xl z-10 pt-40 pb-24">
        <div className="glass-card-dark p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tight uppercase">Términos y Condiciones</h1>
          
          <div className="prose prose-invert prose-lg max-w-none space-y-6 prose-headings:font-black prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
            <p className="text-brand-orange font-bold uppercase tracking-widest text-sm">
              Hackes Jobs Technologies<br/>
              Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">1. Aceptación de los Términos</h2>
            <p>Al acceder, registrarse o usar la plataforma SaaS de Hacke's Jobs (el "Servicio"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">2. Descripción del Servicio (SaaS y ATS)</h2>
            <p>Hacke's Jobs provee un ecosistema digital de reclutamiento que incluye, pero no se limita a:</p>
            <ul>
              <li>Un sistema de seguimiento de candidatos (ATS) impulsado por Inteligencia Artificial.</li>
              <li>Plataforma de pruebas psicométricas adaptativas (CAT).</li>
              <li>Herramientas B2B de publicación de vacantes y filtrado inteligente.</li>
              <li>Portal B2C para perfiles profesionales y postulación a vacantes.</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">3. Planes, Créditos Antigravity y Pagos</h2>
            <p>Los servicios B2B operan bajo un modelo de suscripción mensual (Starter, Professional, Enterprise) detallado en nuestra sección de Precios. El acceso a las funciones avanzadas de procesamiento de lenguaje natural y <i>scoring</i> de candidatos consume "Créditos Antigravity".</p>
            <p>El sistema de créditos (Gatekeeper) audita el uso de IA. Si la cuota mensual se agota, las funciones de IA quedarán pausadas hasta el siguiente ciclo de facturación o hasta que se adquiera un paquete de créditos adicional.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">4. Cláusula de Garantía de Reposición (Plan Growth)</h2>
            <p><strong>1. ALCANCE DE LA GARANTÍA</strong><br/>
            HACKES JOBS TECHNOLOGIES otorga al CLIENTE una garantía de reposición de candidato consistente en reemplazar, sin costo adicional, a la persona contratada a través del Plan Growth cuando se actualice alguno de los supuestos descritos en la cláusula 3, dentro del plazo establecido en la cláusula 2.</p>
            
            <p><strong>2. PLAZO DE LA GARANTÍA</strong><br/>
            El plazo de la garantía es de DIEZ (10) DÍAS NATURALES, contados a partir del primer día efectivo de ingreso del candidato a las instalaciones o nómina del CLIENTE, lo que ocurra primero. El día de ingreso cuenta como Día 1.</p>
            
            <p><strong>3. SUPUESTOS QUE ACTIVAN LA GARANTÍA</strong><br/>
            La garantía se hace efectiva cuando, dentro del plazo descrito en la cláusula 2, ocurra alguno de los siguientes supuestos:</p>
            <ul>
              <li><strong>BAJA VOLUNTARIA</strong> del candidato, entendida como la renuncia presentada por escrito o el abandono de funciones por más de tres (3) días hábiles consecutivos sin justificación.</li>
              <li><strong>DESPIDO POR FALTA DE COMPETENCIAS TÉCNICAS O CONDUCTUALES</strong> previamente especificadas en la requisición del puesto y verificadas mediante el proceso de evaluación entregado por HACKES JOBS TECHNOLOGIES.</li>
            </ul>

            <p><strong>4. SUPUESTOS QUE NO ACTIVAN LA GARANTÍA</strong><br/>
            La garantía no aplica, y el proceso se considera concluido sin obligación de reposición, en los siguientes casos:</p>
            <ul>
              <li>Cambios en el perfil, responsabilidades, salario, prestaciones, horario o condiciones del puesto distintos a los acordados en la requisición original.</li>
              <li>Despido por causas no atribuibles al desempeño técnico o conductual del candidato (reestructuración, recorte, cierre de área, cambio organizacional).</li>
              <li>Decisión del CLIENTE de no contratar formalmente al candidato seleccionado dentro de los quince (15) días naturales siguientes a la entrega de la terna.</li>
              <li>Incumplimiento por parte del CLIENTE en el pago, alta en nómina, entrega de equipo o cualquier obligación patronal contractualmente prevista.</li>
              <li>Caso fortuito o fuerza mayor.</li>
            </ul>

            <p><strong>5. UNICIDAD DE LA REPOSICIÓN</strong><br/>
            La garantía cubre UNA (1) ÚNICA REPOSICIÓN por cada vacante pagada bajo el Plan Growth. Una vez ejercida la reposición y entregado el candidato sustituto, se considera cumplida la obligación de HACKES JOBS TECHNOLOGIES respecto de esa vacante, con independencia del desempeño posterior del candidato sustituto.</p>

            <p><strong>6. PROCEDIMIENTO PARA EJERCER LA GARANTÍA</strong><br/>
            El CLIENTE debe notificar por escrito (correo electrónico a abelardo.carlos@hackesjobs.com.mx) dentro de los cinco (5) días hábiles siguientes a que ocurra el supuesto que activa la garantía, acompañando:</p>
            <ul>
              <li>Fecha de ingreso y fecha de baja del candidato.</li>
              <li>Causa documentada de la baja (carta de renuncia, acta administrativa o documento equivalente).</li>
              <li>En caso de despido por falta de competencias, evidencia mínima del incumplimiento (evaluaciones internas, reportes de supervisor).</li>
            </ul>
            <p>HACKES JOBS TECHNOLOGIES revisará la procedencia en un plazo máximo de cinco (5) días hábiles e iniciará el proceso de reposición dentro de los siguientes diez (10) días hábiles, comprometiéndose a entregar nueva terna en un plazo máximo de quince (15) días hábiles a partir de la confirmación de procedencia.</p>

            <p><strong>7. EXCLUSIVIDAD Y LIMITACIÓN DE RESPONSABILIDAD</strong><br/>
            La presente garantía constituye el único remedio disponible para el CLIENTE en caso de baja del candidato dentro del plazo cubierto. HACKES JOBS TECHNOLOGIES no será responsable por daños indirectos, consecuenciales, lucro cesante, pérdida de oportunidad, costos de capacitación, ni cualquier otro concepto distinto a la reposición pactada en esta cláusula.</p>

            <p><strong>8. RELACIÓN LABORAL</strong><br/>
            Se reconoce expresamente que la relación laboral con el candidato contratado se establece entre el CLIENTE y dicho candidato. HACKES JOBS TECHNOLOGIES actúa exclusivamente como prestador de servicios de reclutamiento y selección, sin asumir el carácter de patrón, intermediario laboral ni subcontratista en términos de la Ley Federal del Trabajo.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">5. Compliance Psicológico — Declaración Profesional</h2>
            <p><strong>SUPERVISIÓN PROFESIONAL Y ÉTICA PSICOLÓGICA</strong><br/>
            Las evaluaciones psicométricas que aplicamos — especialmente aquellas con alcance clínico como el MMPI-2 y el 16PF — son interpretadas y validadas bajo la supervisión de Lic. Guillermo Muñoz Ledo, psicólogo(a) titulado(a) con Cédula Profesional Federal número 12541240, expedida por la Dirección General de Profesiones de la Secretaría de Educación Pública.</p>
            
            <p>Nuestra operación se apega al Código Ético del Psicólogo emitido por la Sociedad Mexicana de Psicología, así como a los estándares internacionales de aplicación de pruebas psicológicas (Standards for Educational and Psychological Testing, AERA/APA/NCME).</p>
            
            <p>Las pruebas de tamizaje conductual (DISC, Moss, Zavic, Allport, Kostick) se utilizan exclusivamente como herramientas de apoyo al proceso de selección y no como diagnóstico clínico. Las pruebas clínicas (MMPI-2, 16PF) se aplican únicamente cuando el perfil del puesto lo justifica, con interpretación profesional supervisada y bajo consentimiento informado del evaluado.</p>

            <p><strong>DECLARACIÓN PROFESIONAL Y LIMITACIONES DE USO</strong><br/>
            El presente reporte es resultado de la aplicación automatizada de instrumentos psicométricos estandarizados. Su contenido tiene carácter orientativo dentro de un proceso de selección de personal y no constituye un diagnóstico clínico ni una evaluación psicológica exhaustiva.</p>
            
            <p>La interpretación de las pruebas clínicas incluidas en este reporte (cuando aplique: MMPI-2, 16PF) fue supervisada por Guillermo Muñoz Ledo, Cédula Profesional 12541240, conforme al Código Ético del Psicólogo de la Sociedad Mexicana de Psicología.</p>
            
            <p>Este reporte debe ser considerado como una herramienta complementaria al proceso de selección, junto con entrevistas, verificación de referencias y evaluación técnica del puesto. La decisión final de contratación es responsabilidad exclusiva de la empresa contratante.</p>
            
            <p>El uso, reproducción o difusión de este reporte fuera del proceso de selección para el que fue generado está prohibido y constituye una violación al derecho de privacidad del evaluado conforme a la LFPDPPP.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">6. Propiedad Intelectual</h2>
            <p>El Servicio y su contenido original, características, diseño (Sistema "Stitch"), y algoritmos son propiedad exclusiva de Hacke's Jobs y están protegidos por las leyes internacionales de derechos de autor, marcas comerciales y propiedad intelectual.</p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-white/10 pb-2">7. Limitación de Responsabilidad General</h2>
            <p>Hacke's Jobs funciona como un intermediario tecnológico. Aunque nuestra IA está diseñada para recomendar a los mejores perfiles, no garantizamos la contratación final, ni nos hacemos responsables por el desempeño laboral de los candidatos contratados a través de la plataforma (salvo lo expresamente establecido en la Cláusula de Garantía de Reposición). La decisión final de contratación es exclusiva del cliente B2B.</p>

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
