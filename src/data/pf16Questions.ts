// Banco del cuestionario 16 PF. Redactado por Hacke's Jobs: reactivos
// originales, no los del instrumento comercial.
//
// 185 reactivos distintos (antes había 45 frases y el resto eran repeticiones
// con "(considerando tu contexto laboral actual)" al final):
//  · Factor B (razonamiento): 15 problemas con una sola respuesta correcta.
//  · Los otros 15 factores: 170 afirmaciones de Verdadero / No estoy seguro / Falso.
//    Cada afirmación lleva su dirección: "+" suma al polo alto del factor y
//    "-" al polo bajo, para que no baste con contestar siempre "Verdadero".
import { barajar, type ChoiceQuestion } from '@/lib/psicometrias/banco';

export const PF16_VERSION = 'pf16-2026-10';

export const PF16_FACTORES = {
  A: 'Afabilidad',
  B: 'Razonamiento',
  C: 'Estabilidad emocional',
  E: 'Dominancia',
  F: 'Animación',
  G: 'Atención a las normas',
  H: 'Atrevimiento social',
  I: 'Sensibilidad',
  L: 'Vigilancia',
  M: 'Abstracción',
  N: 'Privacidad',
  O: 'Aprensión',
  Q1: 'Apertura al cambio',
  Q2: 'Autosuficiencia',
  Q3: 'Perfeccionismo',
  Q4: 'Tensión',
} as const;

type Factor = keyof typeof PF16_FACTORES;
type FactorPersonalidad = Exclude<Factor, 'B'>;

/** "+frase" puntúa hacia el polo alto del factor; "-frase", hacia el bajo. */
const AFIRMACIONES: Record<FactorPersonalidad, string[]> = {
  A: [
    '+Disfruto trabajar con personas más que con cosas o datos.',
    '+Me resulta fácil mostrar afecto a las personas cercanas.',
    '-Prefiero mantener cierta distancia con la gente del trabajo.',
    '+Me interesa saber cómo se sienten mis compañeros.',
    '-Me siento más cómodo con máquinas o documentos que con personas.',
    '+Disfruto atender y ayudar a los clientes.',
    '-Me cuesta acercarme a las personas que acabo de conocer.',
    '+La gente suele buscarme para platicar.',
    '-Preferiría un trabajo con poco contacto con otras personas.',
    '+Me gusta convivir con mis compañeros a la hora de la comida.',
    '-En las reuniones familiares suelo quedarme al margen.',
    '+Me considero una persona cálida.',
  ],
  C: [
    '+Me recupero pronto de un mal día.',
    '-Me altero con facilidad cuando las cosas salen mal.',
    '+Puedo atender varios problemas a la vez sin perder la calma.',
    '-Mis cambios de ánimo afectan mi trabajo.',
    '+Afronto los contratiempos con serenidad.',
    '-Las críticas me afectan durante varios días.',
    '+Me siento satisfecho con la forma en que manejo mi vida.',
    '-A menudo me siento agobiado por mis responsabilidades.',
    '+Duermo bien aunque tenga problemas pendientes.',
    '-Pierdo la paciencia más seguido de lo que quisiera.',
    '+Puedo enfrentar situaciones difíciles sin desanimarme.',
    '-Me frustro rápido cuando algo no sale como esperaba.',
  ],
  E: [
    '+Me gusta tener la última palabra en una discusión.',
    '-Prefiero ceder antes que discutir.',
    '+Defiendo mis ideas aunque los demás no estén de acuerdo.',
    '-Me cuesta decirle "no" a otras personas.',
    '+Cuando algo no me parece, lo digo directamente.',
    '-Suelo adaptarme a lo que los demás quieren.',
    '+Me gusta influir en las decisiones del grupo.',
    '-Evito dar órdenes a otras personas.',
    '+Si alguien hace mal su trabajo, se lo hago saber.',
    '-Prefiero que otros tomen la iniciativa.',
    '+Me considero una persona competitiva.',
    '-Rara vez insisto en salirme con la mía.',
  ],
  F: [
    '+Me gustan las fiestas y las reuniones animadas.',
    '-Prefiero las actividades tranquilas.',
    '+Suelo ser espontáneo en lo que digo y hago.',
    '-Pienso bien las cosas antes de decirlas.',
    '+Me divierto con facilidad.',
    '-La gente me describe como una persona seria.',
    '+Me entusiasman las actividades emocionantes.',
    '-Prefiero una noche tranquila en casa a salir de fiesta.',
    '+Suelo ser quien anima al grupo.',
    '-Rara vez actúo por impulso.',
    '+Me gusta hacer bromas.',
    '-Soy más bien reservado al expresarme.',
  ],
  G: [
    '+Cumplo las reglas aunque nadie me vigile.',
    '-Algunas reglas están hechas para romperse.',
    '+Considero importante cumplir mis obligaciones al pie de la letra.',
    '-Si una norma me parece absurda, la ignoro.',
    '+Respeto los procedimientos de la empresa aunque sean lentos.',
    '-Me molesta que me digan cómo debo comportarme.',
    '+Me siento culpable si falto a un compromiso.',
    '-A veces hago trampa en cosas pequeñas.',
    '+Las personas deben respetar a la autoridad.',
    '-Prefiero hacer las cosas a mi manera aunque exista un procedimiento.',
    '+Cumplo mis promesas aunque me cueste.',
  ],
  H: [
    '+Me siento cómodo hablando frente a mucha gente.',
    '-Me pongo nervioso cuando debo presentarme ante desconocidos.',
    '+Inicio conversaciones con desconocidos sin problema.',
    '-Me cuesta hablar en reuniones con personas de alto cargo.',
    '+Me gusta asumir retos que otros evitan.',
    '-Evito las situaciones en las que pueda quedar en ridículo.',
    '+No me intimida conocer a personas importantes.',
    '-Me trabo con facilidad cuando todos me ponen atención.',
    '+Me ofrezco para presentar el trabajo del equipo.',
    '-Prefiero pasar desapercibido en un grupo nuevo.',
    '+Me animo a probar cosas arriesgadas.',
    '-Me cuesta hacer valer mis derechos frente a desconocidos.',
  ],
  I: [
    '+Me conmueven fácilmente las películas o historias tristes.',
    '-Prefiero los temas prácticos a los sentimentales.',
    '+Me gusta el arte, la música o la poesía.',
    '-Las decisiones deben tomarse solo con base en hechos, no en sentimientos.',
    '+Me afecta mucho ver sufrir a otras personas.',
    '-Me considero una persona práctica y realista más que sensible.',
    '+Cuido la estética de lo que hago.',
    '-Me aburren las conversaciones sobre sentimientos.',
    '+Presto atención a cómo se sienten los demás.',
    '-Prefiero un trabajo técnico a uno creativo.',
    '+Me interesan la decoración y el diseño.',
  ],
  L: [
    '+Mucha gente actúa solo por interés propio.',
    '-Confío en la gente hasta que me demuestre lo contrario.',
    '+Me cuesta creer en las buenas intenciones de los demás.',
    '-Doy a las personas el beneficio de la duda.',
    '+Hay personas que hablan mal de mí a mis espaldas.',
    '-Creo que la mayoría de la gente es honesta.',
    '+Verifico lo que otros me dicen antes de creerlo.',
    '-Rara vez sospecho de los motivos de otros.',
    '+Hay que tener cuidado con quienes son demasiado amables.',
    '-Me resulta fácil confiar en compañeros nuevos.',
    '+Suelo pensar que otros quieren aprovecharse de mí.',
  ],
  M: [
    '+Me pierdo en mis pensamientos con facilidad.',
    '-Me concentro en lo práctico e inmediato.',
    '+Me gusta imaginar cómo podrían ser las cosas.',
    '-Prefiero resolver problemas concretos que pensar en ideas.',
    '+A veces me distraigo pensando en otras cosas.',
    '-Me fijo más en los hechos que en las posibilidades.',
    '+Disfruto pensar en ideas nuevas aunque no tengan una aplicación inmediata.',
    '-Prefiero los trabajos con resultados tangibles.',
    '+Me atraen los temas filosóficos.',
    '-Me considero una persona con los pies en la tierra.',
    '+Tengo muchas ideas que nunca llego a realizar.',
  ],
  N: [
    '+Prefiero no hablar de mi vida personal en el trabajo.',
    '-Le cuento mis problemas a casi cualquier persona.',
    '+Soy discreto con lo que siento.',
    '-La gente se da cuenta fácilmente de lo que pienso.',
    '+Me reservo mi opinión cuando no conviene darla.',
    '-Comparto con facilidad detalles de mi vida.',
    '+Pocas personas me conocen realmente.',
    '-Digo lo que siento sin pensarlo mucho.',
    '+Cuido lo que digo frente a personas que no conozco bien.',
    '-Soy un libro abierto.',
    '+Prefiero que mis asuntos personales queden en privado.',
  ],
  O: [
    '+Me preocupo por cosas que podrían salir mal.',
    '-Rara vez me siento culpable.',
    '+Me pregunto con frecuencia si hice bien las cosas.',
    '-Me siento seguro de mí mismo la mayor parte del tiempo.',
    '+Me cuesta dejar de pensar en mis errores.',
    '-Casi nunca me preocupa lo que piensen de mí.',
    '+Me siento inseguro en situaciones nuevas.',
    '-Duermo tranquilo aunque haya cometido un error.',
    '+Me preocupa decepcionar a los demás.',
    '-Me siento satisfecho conmigo mismo.',
    '+Con frecuencia dudo de mis capacidades.',
  ],
  Q1: [
    '+Me gusta probar formas nuevas de hacer las cosas.',
    '-Prefiero los métodos tradicionales que ya funcionan.',
    '+Me interesan las ideas innovadoras aunque cuestionen lo establecido.',
    '-Desconfío de los cambios rápidos.',
    '+Cuestiono las costumbres que no tienen sentido.',
    '-Me siento más cómodo con lo conocido.',
    '+Me entusiasma aprender a usar tecnología nueva.',
    '-Si algo funciona, no hay por qué cambiarlo.',
    '+Disfruto debatir sobre ideas diferentes a las mías.',
    '-Prefiero que las cosas sigan como siempre.',
    '+Busco mejorar los procesos aunque ya funcionen.',
  ],
  Q2: [
    '+Prefiero trabajar solo que en equipo.',
    '-Me gusta pedir la opinión de otros antes de decidir.',
    '+Resuelvo mis problemas sin pedir ayuda.',
    '-Disfruto más las actividades en grupo.',
    '+Tomo mis decisiones sin necesitar la aprobación de otros.',
    '-Necesito el apoyo de otras personas para sentirme seguro.',
    '+Disfruto pasar tiempo a solas.',
    '-Me cuesta trabajar sin compañía.',
    '+Prefiero aprender por mi cuenta.',
    '-Me gusta que otros me acompañen en mis proyectos.',
    '+Me las arreglo bien sin depender de nadie.',
  ],
  Q3: [
    '+Planeo con detalle antes de empezar una tarea.',
    '-Dejo las cosas para última hora.',
    '+Me gusta que mi trabajo quede impecable.',
    '-Mi lugar de trabajo suele estar desordenado.',
    '+Organizo mi tiempo con cuidado.',
    '-Me cuesta seguir un plan.',
    '+Reviso mi trabajo antes de entregarlo.',
    '-Improviso más de lo que planeo.',
    '+Me exijo cumplir mis propios estándares.',
    '-No me molesta entregar algo que solo está "suficientemente bien".',
    '+Llevo un control ordenado de mis pendientes.',
  ],
  Q4: [
    '+Me impaciento cuando tengo que esperar.',
    '-Me tomo las cosas con calma.',
    '+Me siento tenso con frecuencia.',
    '-Rara vez me siento presionado.',
    '+Me irrito cuando me interrumpen.',
    '-Me relajo con facilidad.',
    '+Me cuesta quedarme quieto.',
    '-Tengo mucha paciencia.',
    '+Me frustro cuando las cosas no avanzan.',
    '-Me mantengo tranquilo aunque haya mucho trabajo.',
    '+Siento que siempre tengo prisa.',
  ],
};

/** Factor B: [problema, respuesta correcta, distractor, distractor] */
const RAZONAMIENTO: [string, string, string, string][] = [
  ['"Muchas" es a "pocas" como "mayoría" es a:', 'Minoría', 'Totalidad', 'Grupo'],
  ['¿Qué número sigue? 3, 6, 9, 12, …', '15', '14', '16'],
  ['"Ingenioso" es a "torpe" como "generoso" es a:', 'Tacaño', 'Amable', 'Rico'],
  ['Ana es mayor que Luis y Luis es mayor que Carlos. ¿Quién es el menor?', 'Carlos', 'Luis', 'Ana'],
  ['¿Cuál de estas palabras no pertenece al grupo?', 'Madera', 'Cobre', 'Hierro'],
  ['¿Qué número sigue? 2, 4, 8, 16, …', '32', '24', '30'],
  ['"Hora" es a "minuto" como "minuto" es a:', 'Segundo', 'Día', 'Reloj'],
  ['Si un lápiz cuesta 3 pesos, ¿cuánto cuestan 7 lápices?', '21 pesos', '18 pesos', '24 pesos'],
  ['Lo contrario de "escaso" es:', 'Abundante', 'Poco', 'Raro'],
  ['¿Qué número sigue? 1, 4, 9, 16, …', '25', '20', '24'],
  ['Todos los A son B y ningún B es C. Por lo tanto:', 'Ningún A es C', 'Algunos A son C', 'Todos los C son A'],
  ['"Pie" es a "zapato" como "mano" es a:', 'Guante', 'Dedo', 'Brazo'],
  ['Si hoy es miércoles, ¿qué día será dentro de 10 días?', 'Sábado', 'Viernes', 'Domingo'],
  ['¿Qué número sigue? 20, 17, 14, 11, …', '8', '9', '7'],
  ['Juan tiene el doble de la edad de Pedro, y Pedro tiene 12 años. ¿Cuántos años tendrá Juan dentro de 3 años?', '27', '24', '30'],
];

const OPCIONES_ESCALA = [
  { sufijo: 'v', text: 'Verdadero', punto: 2 },
  { sufijo: 'n', text: 'No estoy seguro', punto: 1 },
  { sufijo: 'f', text: 'Falso', punto: 0 },
] as const;

interface Reactivo { factor: Factor; texto: string; directo?: boolean; razonamiento?: [string, string, string] }

/** Intercala los factores (uno de cada uno por vuelta) y mete un problema de razonamiento cada 12 reactivos. */
function ordenar(): Reactivo[] {
  const colas = (Object.keys(AFIRMACIONES) as FactorPersonalidad[]).map(f =>
    AFIRMACIONES[f].map(t => ({ factor: f as Factor, texto: t.slice(1), directo: t[0] === '+' }))
  );
  const personalidad: Reactivo[] = [];
  for (let vuelta = 0; colas.some(c => c.length); vuelta++) {
    for (const cola of colas) {
      const r = cola.shift();
      if (r) personalidad.push(r);
    }
  }
  const razonamiento: Reactivo[] = RAZONAMIENTO.map(([texto, ...opciones]) => ({
    factor: 'B', texto, razonamiento: opciones as [string, string, string],
  }));
  const salida: Reactivo[] = [];
  personalidad.forEach((r, i) => {
    salida.push(r);
    if ((i + 1) % 12 === 6 && razonamiento.length) salida.push(razonamiento.shift()!);
  });
  return [...salida, ...razonamiento];
}

export const PF16_QUESTIONS: ChoiceQuestion[] = ordenar().map((r, i) => {
  const id = String(i + 1);
  if (r.razonamiento) {
    const [correcta, ...distractores] = r.razonamiento;
    const opciones = barajar(
      [{ text: correcta, valor: 1 }, ...distractores.map(text => ({ text, valor: 0 }))],
      (i + 1) * 7331
    );
    return {
      id,
      question: r.texto,
      options: opciones.map((op, k) => ({ id: `pf16_${id}_${'abc'[k]}`, text: op.text, clave: 'B', valor: op.valor })),
    };
  }
  return {
    id,
    question: r.texto,
    options: OPCIONES_ESCALA.map(op => ({
      id: `pf16_${id}_${op.sufijo}`,
      text: op.text,
      clave: r.factor,
      valor: r.directo ? op.punto : 2 - op.punto,
    })),
  };
});

export function calificarPF16(answers: Record<string, string>) {
  const factores = Object.keys(PF16_FACTORES) as Factor[];
  const puntos = Object.fromEntries(factores.map(f => [f, 0])) as Record<Factor, number>;
  const maximo = { ...puntos };
  let intermedias = 0;
  for (const q of PF16_QUESTIONS) {
    const f = q.options[0].clave as Factor;
    maximo[f] += f === 'B' ? 1 : 2;
    const op = q.options.find(o => o.id === answers[q.id]);
    if (!op) continue;
    puntos[f] += op.valor ?? 0;
    if (op.id.endsWith('_n')) intermedias++;
  }
  return {
    nota: 'Puntaje crudo por factor. Personalidad: 2 puntos por respuesta en la dirección del factor, 1 por "No estoy seguro", 0 en contra. Razonamiento (B): 1 punto por acierto. "escala_0_10" es una conversión lineal del crudo, no un decatipo normativo.',
    por_factor: Object.fromEntries(
      factores.map(f => [f, { factor: PF16_FACTORES[f], crudo: puntos[f], maximo: maximo[f], escala_0_10: Math.round((puntos[f] / maximo[f]) * 10) }])
    ),
    respuestas_intermedias: intermedias,
  };
}

export const getPF16Questions = () => PF16_QUESTIONS;
