// Banco del inventario Kostick (PAPI: Perception And Preference Inventory).
// Redactado por Hacke's Jobs: afirmaciones originales, no las del instrumento
// comercial.
//
// Estructura del PAPI: 20 factores con 9 afirmaciones cada uno (180 en total),
// combinadas en 90 pares de elección forzada. Los pares se arman con un
// calendario "todos contra todos": en cada ronda los 20 factores aparecen una
// vez, ningún par se repite y ningún factor se enfrenta consigo mismo. Así cada
// factor puntúa de 0 a 9, como en la prueba original. (Antes eran 30 pares
// repetidos tres veces.)
import type { ChoiceQuestion } from '@/lib/psicometrias/banco';

export const KOSTICK_VERSION = 'kostick-2026-10';

export const KOSTICK_FACTORES = {
  N: { area: 'Dirección del trabajo', nombre: 'Necesidad de terminar una tarea' },
  G: { area: 'Dirección del trabajo', nombre: 'Papel de trabajador intenso' },
  A: { area: 'Dirección del trabajo', nombre: 'Necesidad de logro' },
  L: { area: 'Liderazgo', nombre: 'Papel de líder' },
  P: { area: 'Liderazgo', nombre: 'Necesidad de controlar a otros' },
  I: { area: 'Liderazgo', nombre: 'Facilidad para tomar decisiones' },
  T: { area: 'Ritmo de trabajo', nombre: 'Ritmo (tempo)' },
  V: { area: 'Ritmo de trabajo', nombre: 'Vigor físico' },
  X: { area: 'Naturaleza social', nombre: 'Necesidad de ser notado' },
  S: { area: 'Naturaleza social', nombre: 'Extensión social' },
  B: { area: 'Naturaleza social', nombre: 'Necesidad de pertenecer a grupos' },
  O: { area: 'Naturaleza social', nombre: 'Necesidad de cercanía y afecto' },
  R: { area: 'Estilo de trabajo', nombre: 'Tipo teórico' },
  D: { area: 'Estilo de trabajo', nombre: 'Interés en los detalles' },
  C: { area: 'Estilo de trabajo', nombre: 'Organización' },
  Z: { area: 'Temperamento', nombre: 'Necesidad de cambio' },
  E: { area: 'Temperamento', nombre: 'Control emocional' },
  K: { area: 'Temperamento', nombre: 'Necesidad de defenderse (agresividad)' },
  F: { area: 'Subordinación', nombre: 'Apoyo a la autoridad' },
  W: { area: 'Subordinación', nombre: 'Necesidad de reglas y supervisión' },
} as const;

type Factor = keyof typeof KOSTICK_FACTORES;

const AFIRMACIONES: Record<Factor, string[]> = {
  N: [
    'Termino una tarea antes de empezar otra.',
    'Me incomoda dejar un trabajo a medias.',
    'Sigo con una tarea hasta terminarla, aunque me tome más tiempo.',
    'Cuando empiezo algo, me gusta verlo terminado.',
    'Prefiero cerrar pendientes antes de aceptar otros nuevos.',
    'Me cuesta descansar si tengo algo sin terminar.',
    'Llevo cada encargo hasta el final.',
    'No me gusta dejar cabos sueltos en un proyecto.',
    'Me siento satisfecho cuando cierro por completo un pendiente.',
  ],
  G: [
    'Trabajo duro durante toda la jornada.',
    'Estoy dispuesto a esforzarme más que los demás.',
    'Me gusta tener mucho trabajo por hacer.',
    'Dedico horas extra cuando el trabajo lo exige.',
    'Disfruto las temporadas de mucha carga de trabajo.',
    'Pongo mucho empeño en todo lo que hago.',
    'El trabajo pesado no me cansa fácilmente.',
    'Prefiero estar ocupado que tener tiempo libre en el trabajo.',
    'Me esfuerzo al máximo aunque nadie me supervise.',
  ],
  A: [
    'Me pongo metas difíciles de alcanzar.',
    'Quiero ser de los mejores en lo que hago.',
    'Me esfuerzo por superar mis propios resultados.',
    'Me motiva alcanzar objetivos ambiciosos.',
    'Quiero avanzar en mi carrera más rápido que el promedio.',
    'Me gusta competir para quedar en primer lugar.',
    'Busco hacer las cosas mejor que la vez anterior.',
    'Aspiro a puestos de mayor responsabilidad.',
    'Me frustra quedarme por debajo de mis metas.',
  ],
  L: [
    'Me gusta dirigir a un grupo de personas.',
    'Suelo tomar la batuta cuando el grupo no se organiza.',
    'La gente suele seguir mis indicaciones.',
    'Me siento cómodo siendo responsable del trabajo de otros.',
    'Me gusta coordinar el trabajo de un equipo.',
    'Disfruto ser quien representa al grupo.',
    'Asumo el mando con naturalidad.',
    'Me gusta ser el responsable de un proyecto.',
    'Prefiero ser el líder que un integrante más del equipo.',
  ],
  P: [
    'Me gusta decirle a otros cómo hacer su trabajo.',
    'Superviso de cerca a quienes dependen de mí.',
    'Me gusta que las cosas se hagan a mi manera.',
    'Me siento responsable de que otros cumplan su parte.',
    'Disfruto dar instrucciones a los demás.',
    'Me gusta influir en las decisiones de otras personas.',
    'Corrijo a otros cuando hacen algo mal.',
    'Me gusta tener autoridad sobre otros.',
    'Pido cuentas a quienes tienen tareas a su cargo.',
  ],
  I: [
    'Tomo decisiones con rapidez.',
    'Decido sin necesidad de consultar a muchas personas.',
    'Me resulta fácil elegir entre varias opciones.',
    'No me cuesta tomar decisiones importantes.',
    'Una vez que decido, no le doy más vueltas.',
    'Prefiero decidir pronto que esperar a tener toda la información.',
    'Me siento seguro al tomar decisiones difíciles.',
    'Asumo las consecuencias de mis decisiones sin titubear.',
    'Me gusta ser quien tiene la última palabra.',
  ],
  T: [
    'Trabajo a un ritmo rápido.',
    'Me gusta hacer las cosas deprisa.',
    'Me impaciento cuando las cosas van lentas.',
    'Resuelvo los pendientes con agilidad.',
    'Paso rápido de una actividad a otra.',
    'Termino mis tareas antes del plazo.',
    'Me gusta trabajar con un ritmo intenso.',
    'Me desespera la lentitud de algunos procesos.',
    'Hago muchas cosas en poco tiempo.',
  ],
  V: [
    'Prefiero un trabajo que me mantenga en movimiento.',
    'Me gustan las actividades físicas.',
    'Me aburre estar sentado mucho tiempo.',
    'Disfruto el trabajo de campo o en piso.',
    'Tengo mucha energía física.',
    'Prefiero ir en persona a resolver algo que hacerlo por teléfono.',
    'Practico algún deporte con regularidad.',
    'Me siento mejor cuando hago esfuerzo físico.',
    'Prefiero tareas activas a tareas de escritorio.',
  ],
  X: [
    'Me gusta que reconozcan mis logros en público.',
    'Disfruto ser el centro de atención.',
    'Me gusta destacar en un grupo.',
    'Me agrada que la gente note mi trabajo.',
    'Me gusta hablar frente a un grupo.',
    'Disfruto que me feliciten frente a otros.',
    'Me gusta que me pidan mi opinión en las reuniones.',
    'Me gusta hacerme notar.',
    'Disfruto presentar mis resultados ante los directivos.',
  ],
  S: [
    'Hago amigos con facilidad.',
    'Disfruto conocer gente nueva.',
    'Me gusta convivir con mis compañeros fuera del trabajo.',
    'Tengo muchos conocidos en distintos ámbitos.',
    'Platico fácilmente con desconocidos.',
    'Me gustan las reuniones sociales.',
    'Disfruto los eventos con mucha gente.',
    'Me resulta fácil iniciar una conversación.',
    'Me gusta mantener contacto con mucha gente.',
  ],
  B: [
    'Me gusta sentirme parte de un equipo.',
    'Prefiero trabajar en grupo que solo.',
    'Me importa ser aceptado por mis compañeros.',
    'Me adapto a lo que decide el grupo.',
    'Me gusta participar en las actividades del equipo.',
    'Me siento bien cuando el equipo me incluye.',
    'Me esfuerzo por llevarme bien con todo el grupo.',
    'Me gusta pertenecer a asociaciones o clubes.',
    'Prefiero los logros del equipo a los logros individuales.',
  ],
  O: [
    'Me gusta tener relaciones cercanas con mis compañeros.',
    'Me importa que las personas con quienes trabajo me aprecien.',
    'Busco ganarme la confianza de mis compañeros.',
    'Me interesa saber cómo están mis compañeros en lo personal.',
    'Me afecta cuando alguien del trabajo está molesto conmigo.',
    'Me gusta tener un amigo de confianza en el trabajo.',
    'Me gusta apoyar a un compañero con un problema personal.',
    'Valoro la calidez en el trato.',
    'Expreso mi aprecio a las personas cercanas.',
  ],
  R: [
    'Me gusta reflexionar sobre ideas y teorías.',
    'Analizo un problema a fondo antes de actuar.',
    'Me interesa entender el porqué de las cosas.',
    'Disfruto planear a largo plazo.',
    'Me gusta leer sobre temas complejos.',
    'Busco el principio que explica un problema.',
    'Prefiero pensar antes que actuar.',
    'Me gusta diseñar soluciones nuevas.',
    'Disfruto discutir conceptos abstractos.',
  ],
  D: [
    'Reviso con cuidado los detalles de mi trabajo.',
    'Detecto errores pequeños que otros no ven.',
    'Me gusta el trabajo que requiere precisión.',
    'Reviso dos veces antes de entregar algo.',
    'Pongo atención a los datos exactos.',
    'Disfruto las tareas minuciosas.',
    'Cuido cada detalle de un informe.',
    'Me molesta entregar algo con errores, aunque sean menores.',
    'Me gusta trabajar con cifras exactas.',
  ],
  C: [
    'Mantengo mi lugar de trabajo ordenado.',
    'Planeo mi día antes de empezar.',
    'Me gusta tener un sistema para todo.',
    'Sigo una agenda bien definida.',
    'Archivo mis documentos de forma ordenada.',
    'Hago listas de pendientes.',
    'Organizo mis tareas por prioridad.',
    'Me gusta saber dónde está cada cosa.',
    'Planifico con anticipación.',
  ],
  Z: [
    'Me gusta probar formas nuevas de hacer las cosas.',
    'Me aburre la rutina.',
    'Disfruto los cambios en mi trabajo.',
    'Busco experiencias nuevas con frecuencia.',
    'Me gusta cambiar de proyecto seguido.',
    'Me entusiasman las ideas novedosas.',
    'Me adapto con gusto a situaciones nuevas.',
    'Me gusta conocer lugares y ambientes diferentes.',
    'Prefiero la variedad a la estabilidad.',
  ],
  E: [
    'Mantengo la calma en situaciones tensas.',
    'Controlo mis emociones en el trabajo.',
    'Rara vez pierdo la paciencia.',
    'No dejo que el enojo afecte mis decisiones.',
    'Pienso antes de reaccionar.',
    'Soy reservado con mis sentimientos.',
    'Me mantengo sereno ante las críticas.',
    'Guardo la compostura aunque me provoquen.',
    'Mis compañeros rara vez me ven alterado.',
  ],
  K: [
    'Defiendo mi postura con firmeza.',
    'Enfrento directamente a quien me ataca.',
    'No me dejo presionar por otros.',
    'Digo lo que pienso aunque moleste.',
    'Respondo con firmeza cuando no estoy de acuerdo.',
    'Lucho por lo que considero justo.',
    'No dejo pasar una ofensa.',
    'Discuto cuando creo tener la razón.',
    'Me defiendo cuando me critican injustamente.',
  ],
  F: [
    'Apoyo las decisiones de mi jefe.',
    'Soy leal a la empresa en la que trabajo.',
    'Me gusta ayudar a mi jefe a lograr sus objetivos.',
    'Respeto la autoridad de mis superiores.',
    'Defiendo a mi jefe ante los demás.',
    'Me gusta saber qué espera mi jefe de mí.',
    'Procuro quedar bien con mis superiores.',
    'Sigo las indicaciones de mi jefe aunque no las comparta del todo.',
    'Me identifico con los objetivos de la empresa.',
  ],
  W: [
    'Prefiero recibir instrucciones claras sobre qué hacer.',
    'Me gusta trabajar con procedimientos definidos.',
    'Sigo las reglas al pie de la letra.',
    'Me siento más seguro con un jefe que me oriente.',
    'Prefiero que me digan cómo se hacen las cosas.',
    'Me gusta que las políticas estén por escrito.',
    'Respeto los reglamentos aunque nadie me vigile.',
    'Me incomoda trabajar sin lineamientos claros.',
    'Consulto el manual antes de improvisar.',
  ],
};

const FACTORES = Object.keys(KOSTICK_FACTORES) as Factor[];
const RONDAS = 9;

/** Calendario todos contra todos (método del círculo) para 20 factores. */
function parejasDeRonda(ronda: number): [Factor, Factor][] {
  const resto = FACTORES.slice(1);
  const girado = [...resto.slice(ronda), ...resto.slice(0, ronda)];
  const orden = [FACTORES[0], ...girado];
  const mitad = orden.length / 2;
  return Array.from({ length: mitad }, (_, k) => [orden[k], orden[orden.length - 1 - k]] as [Factor, Factor]);
}

export const KOSTICK_QUESTIONS: ChoiceQuestion[] = Array.from({ length: RONDAS }, (_, ronda) =>
  parejasDeRonda(ronda).map(([f1, f2], k) => {
    // Alterna qué factor va como A para que la posición no delate nada.
    const [fa, fb] = (ronda + k) % 2 === 0 ? [f1, f2] : [f2, f1];
    return { fa, fb, ronda };
  })
)
  .flat()
  .map(({ fa, fb, ronda }, i) => {
    const id = String(i + 1);
    return {
      id,
      question: `Par ${id}. ¿Cuál de las dos frases te describe mejor?`,
      options: [
        { id: `kostick_${id}_A`, text: `A) ${AFIRMACIONES[fa][ronda]}`, clave: fa },
        { id: `kostick_${id}_B`, text: `B) ${AFIRMACIONES[fb][ronda]}`, clave: fb },
      ],
    };
  });

export function calificarKostick(answers: Record<string, string>) {
  const puntos = Object.fromEntries(FACTORES.map(f => [f, 0])) as Record<Factor, number>;
  for (const q of KOSTICK_QUESTIONS) {
    const clave = q.options.find(o => o.id === answers[q.id])?.clave as Factor | undefined;
    if (clave) puntos[clave]++;
  }
  const etiqueta = (f: Factor) => `${f} ${KOSTICK_FACTORES[f].nombre} (${puntos[f]})`;
  const nivel = (p: number) => (p >= 7 ? 'alto' : p <= 2 ? 'bajo' : 'medio');
  const areas = FACTORES.map(f => KOSTICK_FACTORES[f].area).filter((a, i, todas) => todas.indexOf(a) === i);

  return {
    nota: 'Escala de 0 a 9 por factor (cada factor aparece en 9 pares). La suma de los 20 factores es igual al número de pares contestados. Alto >= 7, bajo <= 2.',
    por_factor: Object.fromEntries(
      FACTORES.map(f => [f, { area: KOSTICK_FACTORES[f].area, factor: KOSTICK_FACTORES[f].nombre, puntaje: puntos[f], nivel: nivel(puntos[f]) }])
    ),
    // Lectura ya resuelta para que el análisis no tenga que recalcularla.
    perfil: {
      dominantes: [...FACTORES].sort((a, b) => puntos[b] - puntos[a]).slice(0, 4).map(etiqueta),
      altos: FACTORES.filter(f => puntos[f] >= 7).map(etiqueta),
      bajos: FACTORES.filter(f => puntos[f] <= 2).map(etiqueta),
    },
    // Tabla en texto plano para el bloque "Puntajes crudos" del reporte.
    tabla: areas
      .map(area =>
        `${area}: ` +
        FACTORES.filter(f => KOSTICK_FACTORES[f].area === area)
          .map(f => `${f} ${KOSTICK_FACTORES[f].nombre} ${puntos[f]}/9`)
          .join(' · ')
      )
      .join('\n'),
  };
}

export const getKostickQuestions = () => KOSTICK_QUESTIONS;
