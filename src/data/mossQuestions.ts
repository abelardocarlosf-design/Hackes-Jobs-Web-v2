// Banco del test Moss (habilidades de supervisión). Redactado por Hacke's Jobs:
// reactivos originales, no los del instrumento comercial.
//
// Cada situación trae primero la respuesta correcta y luego tres distractores.
// El orden que ve el candidato se baraja (con semilla fija) para que la
// correcta no quede siempre en la misma posición, como pasaba antes.
import { barajar, type ChoiceQuestion } from '@/lib/psicometrias/banco';

export const MOSS_VERSION = 'moss-2026-10';

export const MOSS_DIMENSIONES = {
  HS: 'Habilidad de supervisión',
  CDRH: 'Capacidad de decisión en las relaciones humanas',
  CEMT: 'Capacidad de evaluación de problemas interpersonales',
  HERI: 'Habilidad para establecer relaciones interpersonales',
  SCMT: 'Sentido común y tacto en las relaciones interpersonales',
} as const;

type Dimension = keyof typeof MOSS_DIMENSIONES;
type Item = [Dimension, string, string, string, string, string];

const ITEMS: Item[] = [
  ['HS', "Un operario nuevo comete un error grave en línea de producción durante su primera semana.",
    "Reunirme con él en privado, revisar el procedimiento y darle seguimiento esta semana.",
    "Llamarle la atención frente a sus compañeros para que sirva de ejemplo.",
    "Dejarlo pasar; es nuevo y aprenderá solo con el tiempo.",
    "Reportarlo a Recursos Humanos para que decidan la sanción."],
  ['CEMT', "Dos integrantes de tu equipo discuten constantemente y eso afecta los tiempos de entrega.",
    "Mediar una conversación entre ambos y acordar reglas mínimas de convivencia.",
    "Cambiar a uno de ellos de turno para evitar el contacto.",
    "Esperar a que se resuelvan solos; los adultos deben manejar sus diferencias.",
    "Aplicar una sanción a ambos por bajar la productividad."],
  ['CDRH', "Tu jefe directo te pide cumplir una meta que sabes que es operativamente imposible esta semana.",
    "Presentar datos objetivos y proponer un plan realista a 2 semanas.",
    "Aceptar el compromiso para no parecer débil ante el jefe.",
    "Comprometer al equipo a horas extra forzadas para alcanzar la meta.",
    "Decir que no se puede sin presentar alternativa."],
  ['HERI', "Un colaborador con buen desempeño técnico recibe quejas reiteradas por su trato con compañeros.",
    "Hablar con él en una sesión 1:1 con ejemplos concretos y plan de mejora medible.",
    "Ignorar las quejas mientras los resultados sean buenos.",
    "Despedirlo de inmediato para mandar un mensaje al equipo.",
    "Enviarle a un curso genérico de habilidades blandas sin más seguimiento."],
  ['CEMT', "Detectas un faltante de materia prima que apunta a un descuido del turno anterior.",
    "Hacer un reporte formal con evidencia antes de acusar a alguien.",
    "Confrontar al supervisor del turno anterior frente al equipo.",
    "Reponer el faltante de tu inventario sin levantar reporte.",
    "Asumir que fue robo y pedir cámaras nuevas."],
  ['CEMT', "Un cliente externo se queja por la actitud de un colaborador clave de tu área.",
    "Disculparme con el cliente, recabar la versión interna y dar seguimiento documentado.",
    "Defender automáticamente al colaborador porque conozco su trabajo.",
    "Trasladar al colaborador a otra área sin investigar.",
    "Pedir que el cliente trate solo conmigo de ahora en adelante."],
  ['HS', "La meta mensual está al 60% y faltan 5 días.",
    "Convocar al equipo, revisar bloqueos y rebalancear cargas con prioridades claras.",
    "Pedir horas extra obligatorias sin diagnóstico previo.",
    "Reportar el incumplimiento como inevitable a la dirección.",
    "Exigir el resultado sin escuchar al equipo."],
  ['HERI', "Un colaborador te informa que recibió una oferta de la competencia.",
    "Escuchar sus motivos, identificar qué se puede ajustar y responder con datos al área de RH.",
    "Igualar la oferta económica sin más análisis.",
    "Asumir que ya está perdido y no hacer nada.",
    "Reaccionar con molestia y reducir su responsabilidad como represalia."],
  ['HS', "Necesitas implementar un nuevo procedimiento que generará resistencia.",
    "Comunicar el porqué con datos, capacitar y dar un periodo de transición.",
    "Imponer el cambio de la noche a la mañana, sin explicaciones.",
    "Posponer hasta que el equipo lo pida.",
    "Aplicarlo solo a los nuevos para no incomodar a los antiguos."],
  ['CEMT', "Un miembro de tu equipo se ausenta tres días sin justificar.",
    "Contactarlo personalmente para entender qué ocurre antes de proceder.",
    "Iniciar el proceso de baja inmediatamente.",
    "Esperar a que aparezca y darle el beneficio de la duda sin proceso.",
    "Sancionarlo sin escucharlo."],
  ['CDRH', "La dirección anuncia un recorte de presupuesto del 20% para tu área.",
    "Analizar gastos por impacto y proponer un plan transparente al equipo.",
    "Recortar primero personal sin revisar otras partidas.",
    "No comunicar al equipo hasta que sea inevitable.",
    "Rechazar el recorte sin contrapropuesta."],
  ['HERI', "Recibes un reconocimiento por un proyecto en el que tu equipo hizo el 80% del trabajo.",
    "Reconocer públicamente al equipo y compartir el crédito con nombres específicos.",
    "Aceptar el reconocimiento sin mencionar al equipo.",
    "Rechazarlo por completo para no causar conflicto.",
    "Mencionar al equipo solo si alguien pregunta."],
  ['HERI', "Un colaborador propone una mejora al proceso que tú no habías considerado.",
    "Evaluarla con criterios objetivos y, si aplica, implementarla dando crédito.",
    "Rechazarla porque no salió de mí.",
    "Tomarla y presentarla como propia ante la dirección.",
    "Ignorarla sin retroalimentar al colaborador."],
  ['HS', "Detectas que un procedimiento de seguridad se está saltando para ganar tiempo.",
    "Detener la práctica de inmediato y reforzar capacitación; documentar el incidente.",
    "Hacer la vista gorda si los resultados son buenos.",
    "Reportar a los responsables sin investigar contexto.",
    "Quitar la regla porque \"nadie la sigue\"."],
  ['SCMT', "Te asignan un proyecto fuera de tu zona de comodidad y con plazos ajustados.",
    "Diagnosticar lo que no sé, pedir apoyo puntual y armar plan con hitos.",
    "Rechazarlo argumentando que no es mi especialidad.",
    "Aceptar sin planear y esperar que salga bien.",
    "Delegarlo en alguien del equipo sin asumir responsabilidad."],
  ['CEMT', "Un colaborador tiene desempeño bajo desde hace dos meses, antes era estable.",
    "Tener una conversación honesta para entender qué cambió y construir plan.",
    "Reemplazarlo sin diálogo.",
    "Castigarlo bajando su bono.",
    "Asumir que es flojera y dejarlo."],
  ['SCMT', "Tienes que dar una mala noticia al equipo sobre cancelación de bonos.",
    "Comunicar con honestidad, contexto y siguientes pasos posibles.",
    "Delegar la comunicación a RH para no incomodarme.",
    "Anunciar por correo masivo sin contexto.",
    "Posponer la noticia indefinidamente."],
  ['CDRH', "Un proveedor incumple en una entrega crítica de materia prima.",
    "Activar plan de contingencia, documentar el incidente y renegociar el contrato.",
    "Cambiar de proveedor inmediatamente sin evaluar alternativas.",
    "Aceptar el retraso sin penalización para mantener buena relación.",
    "Reportar a dirección sin tomar acción operativa."],
  ['HERI', "Un colaborador con experiencia se opone abiertamente a una directriz tuya.",
    "Escuchar su argumento técnico, validar con datos y decidir con base en eso.",
    "Imponer la directriz por jerarquía sin escucharlo.",
    "Ceder para evitar el conflicto.",
    "Aislarlo del proyecto."],
  ['HS', "Tu equipo lleva tres semanas trabajando bajo presión sostenida.",
    "Reconocer el esfuerzo, ajustar carga si es posible y mostrar plan de salida.",
    "Exigir más sin reconocimiento.",
    "Bajar metas sin avisar a dirección.",
    "Ignorar señales de fatiga."],
  ['SCMT', "Descubres un error tuyo que impactó al equipo y al área financiera.",
    "Asumir el error abiertamente y proponer acción correctiva.",
    "Culpar a un colaborador para protegerme.",
    "Ocultarlo y esperar que nadie lo detecte.",
    "Minimizarlo aunque haya consecuencias reales."],
  ['HS', "Un colaborador junior te pide retroalimentación directa.",
    "Dar feedback específico, con ejemplos y compromisos medibles.",
    "Solo decirle que \"va bien\" para no incomodar.",
    "Posponerlo varias semanas.",
    "Delegarlo en su líder sin involucrarme."],
  ['SCMT', "Una decisión que tomaste hace 3 meses resultó mala y aún tiene impacto.",
    "Reconocerla públicamente, ajustar el rumbo y comunicar aprendizajes.",
    "Negar que fue mala decisión y mantenerla.",
    "Buscar un culpable externo.",
    "Cambiar de rumbo sin comunicar nada al equipo."],
  ['CDRH', "Necesitas seleccionar a un colaborador para una promoción interna.",
    "Definir criterios objetivos, comunicarlos y evaluar con evidencia.",
    "Elegir al más antiguo sin más criterios.",
    "Elegir al que tengo mayor afinidad personal.",
    "Postergar la decisión indefinidamente."],
  ['SCMT', "Un cliente importante te pide algo que técnicamente no se puede entregar.",
    "Explicar con claridad los límites técnicos y proponer alternativa viable.",
    "Prometerlo aunque sé que no lo cumpliré.",
    "Decir simplemente \"no se puede\" sin alternativa.",
    "Trasladar la decisión a otra persona para evadir el conflicto."],
  ['HERI', "Un colaborador se acerca con un problema personal que afecta su desempeño.",
    "Escuchar con empatía, derivar al área correspondiente y ajustar carga temporal.",
    "Pedirle que separe su vida personal del trabajo, sin más.",
    "Despedirlo si el problema persiste.",
    "Resolverle el problema personal yo mismo."],
  ['SCMT', "En una junta directiva critican públicamente un proyecto que tú lideras.",
    "Escuchar la crítica, pedir especificidad y volver con un plan documentado.",
    "Defenderme emocionalmente sin datos.",
    "Aceptar todo sin cuestionar.",
    "Buscar culpables en mi equipo después de la junta."],
  ['CDRH', "Una nueva tecnología promete ahorros importantes pero requiere capacitar al equipo.",
    "Hacer un piloto controlado, capacitar gradualmente y medir resultados.",
    "Implementarla de inmediato a todo el equipo sin piloto.",
    "Rechazarla por miedo al cambio.",
    "Implementarla solo si la dirección la ordena."],
  ['CEMT', "Un colaborador presenta un reporte con datos que no cuadran con tu observación.",
    "Pedirle que muestre el método y validar fuentes antes de decidir.",
    "Asumir que mintió y sancionarlo.",
    "Aceptar el reporte sin verificar.",
    "Hacer mi propio reporte ignorando el suyo."],
  ['CDRH', "Te ofrecen liderar un proyecto estratégico de alto perfil pero alto riesgo.",
    "Evaluar capacidades, recursos y plan de mitigación antes de aceptar.",
    "Aceptar sin analizar para no perder la oportunidad.",
    "Rechazar sin evaluar por miedo al fracaso.",
    "Aceptar y delegarlo todo en el equipo."],
];

const LETRAS = ['a', 'b', 'c', 'd'];

export const MOSS_QUESTIONS: ChoiceQuestion[] = ITEMS.map(([dimension, situacion, correcta, ...distractores], i) => {
  const id = String(i + 1);
  const opciones = barajar(
    [{ text: correcta, valor: 1 }, ...distractores.map(text => ({ text, valor: 0 }))],
    (i + 1) * 2654435761
  );
  return {
    id,
    question: `Situación ${id}. ${situacion}`,
    options: opciones.map((op, k) => ({ id: `moss_${id}_${LETRAS[k]}`, text: op.text, clave: dimension, valor: op.valor })),
  };
});

export function calificarMoss(answers: Record<string, string>) {
  const dims = Object.keys(MOSS_DIMENSIONES) as Dimension[];
  const aciertos = Object.fromEntries(dims.map(d => [d, 0])) as Record<Dimension, number>;
  const reactivos = { ...aciertos };
  for (const q of MOSS_QUESTIONS) {
    const d = q.options[0].clave as Dimension;
    reactivos[d]++;
    if (q.options.find(o => o.id === answers[q.id])?.valor === 1) aciertos[d]++;
  }
  const total = dims.reduce((s, d) => s + aciertos[d], 0);
  const pct = (d: Dimension) => Math.round((aciertos[d] / reactivos[d]) * 100);

  // Índice de Capacidad Gerencial: ponderación que usa la lectura del reporte.
  const PESOS: Record<Dimension, number> = { HS: 0.3, CDRH: 0.25, CEMT: 0.2, HERI: 0.15, SCMT: 0.1 };
  const icg = Math.round(dims.reduce((s, d) => s + pct(d) * PESOS[d], 0));
  const nivelIcg = icg < 40 ? 'bajo' : icg <= 60 ? 'medio' : icg <= 80 ? 'adecuado' : 'alto';

  // Situaciones falladas: le dan al análisis ejemplos concretos de qué eligió el candidato.
  const errores = MOSS_QUESTIONS.flatMap(q => {
    const elegida = q.options.find(o => o.id === answers[q.id]);
    if (!elegida || elegida.valor === 1) return [];
    const correcta = q.options.find(o => o.valor === 1)!;
    return [`[${q.options[0].clave}] ${q.question} → Eligió: "${elegida.text}" · Correcta: "${correcta.text}"`];
  });

  return {
    nota: 'Aciertos contra la clave del banco de Hacke\'s Jobs (6 situaciones por dimensión). "porcentaje" es % de aciertos, NO un percentil. ICG = HS×0.30 + CDRH×0.25 + CEMT×0.20 + HERI×0.15 + SCMT×0.10.',
    por_dimension: Object.fromEntries(
      dims.map(d => [d, { nombre: MOSS_DIMENSIONES[d], aciertos: aciertos[d], reactivos: reactivos[d], porcentaje: pct(d) }])
    ),
    aciertos_totales: total,
    porcentaje_total: Math.round((total / MOSS_QUESTIONS.length) * 100),
    icg: { valor: icg, nivel: nivelIcg },
    errores,
    tabla: [
      ...dims.map(d => `${d} ${MOSS_DIMENSIONES[d]}: ${aciertos[d]}/${reactivos[d]} (${pct(d)}%)`),
      `Total: ${total}/${MOSS_QUESTIONS.length} (${Math.round((total / MOSS_QUESTIONS.length) * 100)}%) · ICG ${icg} (${nivelIcg})`,
    ].join('\n'),
  };
}

export const getMossQuestions = () => MOSS_QUESTIONS;
