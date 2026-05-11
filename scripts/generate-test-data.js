// Generador determinista de contenido para los tests psicométricos.
// Produce contenido variado y construct-aligned (no copyrighted official items).
// Ejecutar: node scripts/generate-test-data.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

function write(file, content) {
  fs.writeFileSync(path.join(DATA_DIR, file), content, 'utf8');
  console.log(`[ok] ${file}`);
}

/* ============================ MOSS — 30 situaciones supervisión ============================ */
const MOSS_ITEMS = [
  ['Un operario nuevo comete un error grave en línea de producción durante su primera semana.',
    'Llamarle la atención frente a sus compañeros para que sirva de ejemplo.',
    'Reunirme con él en privado, revisar el procedimiento y darle seguimiento esta semana.',
    'Dejarlo pasar; es nuevo y aprenderá solo con el tiempo.',
    'Reportarlo a Recursos Humanos para que decidan la sanción.'],
  ['Dos integrantes de tu equipo discuten constantemente y eso afecta los tiempos de entrega.',
    'Mediar una conversación entre ambos y acordar reglas mínimas de convivencia.',
    'Cambiar a uno de ellos de turno para evitar el contacto.',
    'Esperar a que se resuelvan solos; los adultos deben manejar sus diferencias.',
    'Aplicar una sanción a ambos por bajar la productividad.'],
  ['Tu jefe directo te pide cumplir una meta que sabes que es operativamente imposible esta semana.',
    'Aceptar el compromiso para no parecer débil ante el jefe.',
    'Presentar datos objetivos y proponer un plan realista a 2 semanas.',
    'Comprometer al equipo a horas extra forzadas para alcanzar la meta.',
    'Decir que no se puede sin presentar alternativa.'],
  ['Un colaborador con buen desempeño técnico recibe quejas reiteradas por su trato con compañeros.',
    'Ignorar las quejas mientras los resultados sean buenos.',
    'Hablar con él en una sesión 1:1 con ejemplos concretos y plan de mejora medible.',
    'Despedirlo de inmediato para mandar un mensaje al equipo.',
    'Enviarle a un curso genérico de habilidades blandas sin más seguimiento.'],
  ['Detectas un faltante de materia prima que apunta a un descuido del turno anterior.',
    'Hacer un reporte formal con evidencia antes de acusar a alguien.',
    'Confrontar al supervisor del turno anterior frente al equipo.',
    'Reponer el faltante de tu inventario sin levantar reporte.',
    'Asumir que fue robo y pedir cámaras nuevas.'],
  ['Un cliente externo se queja por la actitud de un colaborador clave de tu área.',
    'Disculparme con el cliente, recabar la versión interna y dar seguimiento documentado.',
    'Defender automáticamente al colaborador porque conozco su trabajo.',
    'Trasladar al colaborador a otra área sin investigar.',
    'Pedir que el cliente trate solo conmigo de ahora en adelante.'],
  ['La meta mensual está al 60% y faltan 5 días.',
    'Convocar al equipo, revisar bloqueos y rebalancear cargas con prioridades claras.',
    'Pedir horas extra obligatorias sin diagnóstico previo.',
    'Reportar el incumplimiento como inevitable a la dirección.',
    'Exigir el resultado sin escuchar al equipo.'],
  ['Un colaborador te informa que recibió una oferta de la competencia.',
    'Escuchar sus motivos, identificar qué se puede ajustar y responder con datos al área de RH.',
    'Igualar la oferta económica sin más análisis.',
    'Asumir que ya está perdido y no hacer nada.',
    'Reaccionar con molestia y reducir su responsabilidad como represalia.'],
  ['Necesitas implementar un nuevo procedimiento que generará resistencia.',
    'Comunicar el porqué con datos, capacitar y dar un periodo de transición.',
    'Imponer el cambio de la noche a la mañana, sin explicaciones.',
    'Posponer hasta que el equipo lo pida.',
    'Aplicarlo solo a los nuevos para no incomodar a los antiguos.'],
  ['Un miembro de tu equipo se ausenta tres días sin justificar.',
    'Contactarlo personalmente para entender qué ocurre antes de proceder.',
    'Iniciar el proceso de baja inmediatamente.',
    'Esperar a que aparezca y darle el beneficio de la duda sin proceso.',
    'Sancionarlo sin escucharlo.'],
  ['La dirección anuncia un recorte de presupuesto del 20% para tu área.',
    'Analizar gastos por impacto y proponer un plan transparente al equipo.',
    'Recortar primero personal sin revisar otras partidas.',
    'No comunicar al equipo hasta que sea inevitable.',
    'Rechazar el recorte sin contrapropuesta.'],
  ['Recibes un reconocimiento por un proyecto en el que tu equipo hizo el 80% del trabajo.',
    'Reconocer públicamente al equipo y compartir el crédito con nombres específicos.',
    'Aceptar el reconocimiento sin mencionar al equipo.',
    'Rechazarlo por completo para no causar conflicto.',
    'Mencionar al equipo solo si alguien pregunta.'],
  ['Un colaborador propone una mejora al proceso que tú no habías considerado.',
    'Evaluarla con criterios objetivos y, si aplica, implementarla dando crédito.',
    'Rechazarla porque no salió de mí.',
    'Tomarla y presentarla como propia ante la dirección.',
    'Ignorarla sin retroalimentar al colaborador.'],
  ['Detectas que un proceso seguro está siendo evadido para ganar tiempo.',
    'Detener la práctica de inmediato y reforzar capacitación; documentar el incidente.',
    'Hacer la vista gorda si los resultados son buenos.',
    'Reportar a los responsables sin investigar contexto.',
    'Quitar la regla porque "nadie la sigue".'],
  ['Te asignan un proyecto fuera de tu zona de comodidad y con plazos ajustados.',
    'Diagnosticar lo que no sé, pedir apoyo puntual y armar plan con hitos.',
    'Rechazarlo argumentando que no es mi especialidad.',
    'Aceptar sin planear y esperar que salga bien.',
    'Delegarlo en alguien del equipo sin asumir responsabilidad.'],
  ['Un colaborador tiene desempeño bajo desde hace dos meses, antes era estable.',
    'Tener una conversación honesta para entender qué cambió y construir plan.',
    'Reemplazarlo sin diálogo.',
    'Castigarlo bajando su bono.',
    'Asumir que es flojera y dejarlo.'],
  ['Tienes que dar una mala noticia al equipo sobre cancelación de bonos.',
    'Comunicar con honestidad, contexto y siguientes pasos posibles.',
    'Delegar la comunicación a RH para no incomodarme.',
    'Anunciar por correo masivo sin contexto.',
    'Posponer la noticia indefinidamente.'],
  ['Un proveedor incumple en una entrega crítica de materia prima.',
    'Activar plan de contingencia, documentar el incidente y renegociar el contrato.',
    'Cambiar de proveedor inmediatamente sin evaluar alternativas.',
    'Aceptar el retraso sin penalización para mantener buena relación.',
    'Reportar a dirección sin tomar acción operativa.'],
  ['Un colaborador con experiencia se opone abiertamente a una directriz tuya.',
    'Escuchar su argumento técnico, validar con datos y decidir con base en eso.',
    'Imponer la directriz por jerarquía sin escucharlo.',
    'Ceder para evitar el conflicto.',
    'Aislarlo del proyecto.'],
  ['Tu equipo lleva tres semanas trabajando bajo presión sostenida.',
    'Reconocer el esfuerzo, ajustar carga si es posible y mostrar plan de salida.',
    'Exigir más sin reconocimiento.',
    'Bajar metas sin avisar a dirección.',
    'Ignorar señales de fatiga.'],
  ['Descubres un error tuyo que impactó al equipo y al área financiera.',
    'Asumir el error abiertamente y proponer acción correctiva.',
    'Culpar a un colaborador para protegerme.',
    'Ocultarlo y esperar que nadie lo detecte.',
    'Minimizarlo aunque haya consecuencias reales.'],
  ['Un colaborador junior te pide retroalimentación directa.',
    'Dar feedback específico, con ejemplos y compromisos medibles.',
    'Solo decirle que "va bien" para no incomodar.',
    'Posponerlo varias semanas.',
    'Delegarlo en su líder sin involucrarme.'],
  ['Una decisión que tomaste hace 3 meses resultó mala y aún tiene impacto.',
    'Reconocerla públicamente, ajustar el rumbo y comunicar aprendizajes.',
    'Negar que fue mala decisión y mantenerla.',
    'Buscar un culpable externo.',
    'Cambiar de rumbo sin comunicar nada al equipo.'],
  ['Necesitas seleccionar a un colaborador para una promoción interna.',
    'Definir criterios objetivos, comunicarlos y evaluar con evidencia.',
    'Elegir al más antiguo sin más criterios.',
    'Elegir al que tengo mayor afinidad personal.',
    'Postergar la decisión indefinidamente.'],
  ['Un cliente importante te pide algo que técnicamente no se puede entregar.',
    'Explicar con claridad los límites técnicos y proponer alternativa viable.',
    'Prometerlo aunque sé que no lo cumpliré.',
    'Decir simplemente "no se puede" sin alternativa.',
    'Trasladar la decisión a otra persona para evadir el conflicto.'],
  ['Un colaborador se acerca con un problema personal que afecta su desempeño.',
    'Escuchar con empatía, derivar al área correspondiente y ajustar carga temporal.',
    'Pedirle que separe su vida personal del trabajo, sin más.',
    'Despedirlo si el problema persiste.',
    'Resolverle el problema personal yo mismo.'],
  ['En una junta directiva critican públicamente un proyecto que tú lideras.',
    'Escuchar la crítica, pedir especificidad y volver con un plan documentado.',
    'Defenderme emocionalmente sin datos.',
    'Aceptar todo sin cuestionar.',
    'Buscar culpables en mi equipo después de la junta.'],
  ['Una nueva tecnología promete ahorros importantes pero requiere capacitar al equipo.',
    'Hacer un piloto controlado, capacitar gradualmente y medir resultados.',
    'Implementarla de inmediato a todo el equipo sin piloto.',
    'Rechazarla por miedo al cambio.',
    'Implementarla solo si la dirección la ordena.'],
  ['Un colaborador presenta un reporte con datos que no cuadran con tu observación.',
    'Pedirle que muestre el método y validar fuentes antes de decidir.',
    'Asumir que mintió y sancionarlo.',
    'Aceptar el reporte sin verificar.',
    'Hacer mi propio reporte ignorando el suyo.'],
  ['Te ofrecen liderar un proyecto estratégico de alto perfil pero alto riesgo.',
    'Evaluar capacidades, recursos y plan de mitigación antes de aceptar.',
    'Aceptar sin analizar para no perder la oportunidad.',
    'Rechazar sin evaluar por miedo al fracaso.',
    'Aceptar y delegarlo todo en el equipo.'],
];

const mossOut = MOSS_ITEMS.map((row, idx) => {
  const id = String(idx + 1);
  const [question, ...opts] = row;
  return {
    id,
    question: `Situación ${id}. ${question}`,
    options: opts.map((text, i) => ({ id: `moss_${id}_opt_${i + 1}`, text })),
  };
});

write('mossQuestions.ts',
`// Auto-generado por scripts/generate-test-data.js — no editar a mano.
export const MOSS_QUESTIONS = ${JSON.stringify(mossOut, null, 2)};

export const getMossQuestions = () => MOSS_QUESTIONS;
`);

/* ============================ ZAVIC — 60 reactivos valores/intereses ============================ */
// 4 valores: moral, legalidad, indiferencia, corrupción
// 4 intereses: económico, político, social, religioso
const ZAVIC_ITEMS = [];
const zavicScenarios = [
  'Frente a un compañero que comete una falta menor, lo correcto es:',
  'Si te ofrecen una "comisión por debajo del agua" para acelerar un trámite:',
  'Cuando ves a alguien hacer trampa en un proceso de selección:',
  'Si descubres que un proveedor sobornó a un comprador interno:',
  'Ante una oportunidad de subir de puesto saltándote a un compañero más capacitado:',
  'Si un cliente te pide facturar un servicio que no se prestó:',
  'Cuando una regla interna te perjudica injustamente:',
  'Si tu jefe te pide hacer algo legal pero éticamente cuestionable:',
  'Ante un dilema entre ganar más o respetar tu palabra:',
  'Cuando ves negligencia que pone en riesgo a terceros:',
  'Si te ofrecen un cargo mejor pagado pero menos significativo:',
  'Cuando hay una causa social en el trabajo que requiere tu apoyo voluntario:',
  'Si una decisión empresarial afecta tu comunidad local:',
  'Ante la opción de invertir tu bono en formación o en consumo:',
  'Cuando tu fe o creencias chocan con una práctica de la empresa:',
];

const zavicOptionTemplates = [
  ['Reportarlo siguiendo el conducto formal aunque sea incómodo.', // moral
   'Apegarme estrictamente al reglamento que aplique.',                // legalidad
   'No involucrarme, no es mi problema.',                              // indiferencia
   'Aprovechar la situación a mi favor si puedo.'],                    // corrupción
  ['Rechazarlo y reportarlo al área de cumplimiento.',
   'Rechazarlo porque va contra el reglamento.',
   'Ignorar la oferta y seguir trabajando.',
   'Aceptarlo discretamente si nadie se entera.'],
  ['Documentarlo y notificarlo al área correspondiente.',
   'Pedir que se aplique la política antifraude.',
   'No decir nada para no ganarme problemas.',
   'Usar la información para negociar algo a cambio.'],
  ['Reportar el caso aunque implique perder al proveedor.',
   'Iniciar el proceso disciplinario formal.',
   'Mantenerme al margen, no me toca.',
   'Pedir mi parte del acuerdo para guardar silencio.'],
  ['Decir la verdad: el compañero merece la oportunidad.',
   'Cumplir lo que dice el procedimiento de promoción.',
   'Quedarme callado, que decidan los demás.',
   'Aceptar la promoción sin mencionarlo.'],
  ['Rechazar y explicar las implicaciones fiscales y legales.',
   'Rechazarlo porque la ley fiscal lo prohíbe.',
   'Dejar que otro decida.',
   'Hacerlo si me dan una compensación extra.'],
  ['Buscar cambiar la regla por medios formales.',
   'Cumplirla mientras esté vigente, aunque sea injusta.',
   'Ignorarla cuando convenga.',
   'Sobornar a quien pueda excluirme de la regla.'],
  ['Negarme y explicar mi razón ética.',
   'Verificar si lo cuestionable es también ilegal antes de actuar.',
   'Hacerlo, no es mi responsabilidad evaluar la ética.',
   'Hacerlo y pedir una compensación adicional.'],
  ['Respetar mi palabra aunque pierda dinero.',
   'Revisar el contrato formal antes de decidir.',
   'Ganar más, lo demás es secundario.',
   'Romper la palabra si nadie se entera.'],
  ['Detener la operación y reportar el riesgo.',
   'Activar los protocolos de seguridad formales.',
   'Pensar que alguien más lo arreglará.',
   'Usar el incidente para presionar a alguien.'],
  ['Elegir lo significativo aunque pague menos.',
   'Evaluar contrato y condiciones formales.',
   'Me da igual, cualquiera de las dos.',
   'Elegir lo que más pague aunque no me importe.'],
  ['Apoyar la causa de forma comprometida.',
   'Apoyar solo si está en el reglamento.',
   'No participar.',
   'Participar solo si me reditúa algo.'],
  ['Buscar mitigar el impacto en mi comunidad.',
   'Verificar lo que dicta la regulación local.',
   'No me incumbe.',
   'Aprovechar el cambio para ganar algo personal.'],
  ['Invertir en mi formación a largo plazo.',
   'Verificar políticas de capacitación de la empresa.',
   'Da igual, depende del momento.',
   'Gastarlo en lo que me dé estatus inmediato.'],
  ['Mantenerme fiel a mis valores y dialogarlo.',
   'Revisar si la práctica viola alguna norma.',
   'Adaptarme sin pensar.',
   'Usar el conflicto para sacar provecho.'],
];

const zavicValues = ['moral', 'legalidad', 'indiferencia', 'corrupcion'];
for (let i = 0; i < 60; i++) {
  const sIdx = i % zavicScenarios.length;
  const variant = Math.floor(i / zavicScenarios.length);
  const id = String(i + 1);
  const baseQ = zavicScenarios[sIdx];
  const optsBase = zavicOptionTemplates[sIdx];
  // rotar el orden de las opciones por variante para evitar memorización trivial
  const rotated = optsBase.map((_, k) => optsBase[(k + variant) % 4]);
  ZAVIC_ITEMS.push({
    id,
    question: `Caso ${id}. ${baseQ}`,
    options: rotated.map((text, k) => ({ id: `zavic_${id}_opt_${k + 1}`, text })),
  });
}

write('zavicQuestions.ts',
`// Auto-generado — Zavic 60 reactivos (4 valores × 4 intereses).
export const ZAVIC_QUESTIONS = ${JSON.stringify(ZAVIC_ITEMS, null, 2)};

export const getZavicQuestions = () => ZAVIC_QUESTIONS;
`);

/* ============================ KOSTICK — 90 pares A/B ============================ */
const kostickPairs = [
  ['Prefiero asumir el liderazgo en un proyecto nuevo.', 'Prefiero ejecutar tareas claras dentro de un plan ya hecho.'],
  ['Disfruto persuadir a otros para alcanzar un objetivo.', 'Prefiero presentar datos y dejar que decidan.'],
  ['Me siento cómodo tomando decisiones bajo presión.', 'Prefiero contar con tiempo y consulta antes de decidir.'],
  ['Me gusta trabajar con plazos ajustados.', 'Rindo mejor con cronogramas amplios.'],
  ['Prefiero variar de tareas a lo largo del día.', 'Rindo mejor con tareas continuas y enfocadas.'],
  ['Me gusta convivir con muchas personas en el trabajo.', 'Prefiero un círculo reducido de colegas.'],
  ['Tomo iniciativa para introducir cambios.', 'Espero a que el cambio esté validado por otros.'],
  ['Me motivan los retos intelectuales complejos.', 'Me motivan las tareas concretas y prácticas.'],
  ['Defiendo mi punto aunque genere conflicto.', 'Cedo si veo que mantener la armonía es más útil.'],
  ['Me siento cómodo hablando en público.', 'Prefiero comunicar por escrito o en grupos pequeños.'],
  ['Pongo metas ambiciosas y voy por ellas.', 'Pongo metas alcanzables para asegurar avance.'],
  ['Disfruto liderar reuniones.', 'Disfruto contribuir en reuniones lideradas por otros.'],
  ['Tomo riesgos calculados con frecuencia.', 'Evito riesgos a menos que sea estrictamente necesario.'],
  ['Pongo mi trabajo por encima de la rutina social.', 'Cuido el equilibrio entre vida laboral y social.'],
  ['Confronto a quien no cumple su parte.', 'Prefiero hablar en privado y con tacto.'],
  ['Me adapto rápido a nuevos procesos.', 'Necesito tiempo para internalizar cambios.'],
  ['Trabajo mejor con autonomía total.', 'Trabajo mejor con supervisión cercana.'],
  ['Me agrada estar al frente de un equipo grande.', 'Prefiero coordinar equipos pequeños.'],
  ['Comparto ideas aunque no estén pulidas.', 'Comparto solo cuando la idea está lista.'],
  ['Pido feedback frecuente.', 'Trabajo mejor sin retroalimentación constante.'],
  ['Negocio con dureza para obtener ventaja.', 'Negocio buscando un acuerdo justo para ambas partes.'],
  ['Doy seguimiento personalmente a cada detalle.', 'Delego el seguimiento y confío en el equipo.'],
  ['Compito por reconocimiento profesional.', 'No persigo reconocimiento, me basta el trabajo bien hecho.'],
  ['Me siento cómodo dirigiendo a personas mayores que yo.', 'Prefiero un contexto donde la jerarquía sea afín.'],
  ['Hago las cosas a mi manera aunque haya un manual.', 'Sigo el manual estrictamente.'],
  ['Tomo decisiones con la información disponible aunque sea incompleta.', 'Espero a tener toda la información antes de decidir.'],
  ['Defiendo nuevas formas de hacer las cosas.', 'Mantengo los métodos que ya funcionan.'],
  ['Mi energía es alta y constante.', 'Mi energía varía y manejo bien los descansos.'],
  ['Disfruto la presión de ventas o metas comerciales.', 'Prefiero roles técnicos sin presión comercial.'],
  ['Hablo con franqueza aunque incomode.', 'Modulo mis comentarios para no incomodar.'],
];

const kostickOut = [];
for (let i = 0; i < 90; i++) {
  const pair = kostickPairs[i % kostickPairs.length];
  // alternar A/B para que la posición no sea predictible
  const swap = i % 2 === 1;
  const a = swap ? pair[1] : pair[0];
  const b = swap ? pair[0] : pair[1];
  const id = String(i + 1);
  kostickOut.push({
    id,
    question: `Par ${id}. ¿Cuál te describe mejor?`,
    options: [
      { id: `kostick_${id}_opt_A`, text: `A) ${a}` },
      { id: `kostick_${id}_opt_B`, text: `B) ${b}` },
    ],
  });
}

write('kostickQuestions.ts',
`// Auto-generado — Kostick 90 pares de afirmaciones (forced choice A/B).
export const KOSTICK_QUESTIONS = ${JSON.stringify(kostickOut, null, 2)};

export const getKostickQuestions = () => KOSTICK_QUESTIONS;
`);

/* ============================ 16PF — 185 ítems × 3 opciones ============================ */
const pf16Items = [
  'Me siento cómodo en reuniones sociales con personas que no conozco.',
  'Suelo terminar lo que empiezo, aun cuando se vuelve difícil.',
  'Me cuesta tomar decisiones cuando hay varias opciones similares.',
  'Disfruto resolver problemas abstractos.',
  'Me preocupo mucho por lo que piensan de mí.',
  'Sigo las reglas establecidas aunque las considere imperfectas.',
  'Suelo ser el primero en proponer ideas en mi equipo.',
  'Me siento culpable cuando no cumplo una tarea menor.',
  'Prefiero trabajar en proyectos prácticos y tangibles.',
  'Me adapto con facilidad a entornos cambiantes.',
  'Tomo riesgos para alcanzar resultados altos.',
  'Confío en mi intuición tanto como en los datos.',
  'Me siento incómodo confrontando a alguien directamente.',
  'Soy sensible a las emociones de los demás.',
  'Mantengo la calma en situaciones de alta presión.',
  'Prefiero soledad para pensar antes de decidir.',
  'Soy puntual incluso para citas informales.',
  'Considero todas las consecuencias antes de actuar.',
  'Defiendo mi opinión incluso si soy minoría.',
  'Me cuesta delegar tareas importantes.',
  'Disfruto liderar tareas grupales.',
  'Tolero la crítica constructiva sin frustrarme.',
  'Cumplo mis compromisos aunque me genere costo personal.',
  'Me motivan los retos intelectuales más que los sociales.',
  'Tengo dificultad para empezar tareas que no me motivan.',
  'Soy directo cuando algo me parece injusto.',
  'Me preparo en exceso para situaciones que controlo poco.',
  'Soy flexible cuando el contexto lo requiere.',
  'Prefiero la rutina previsible al cambio constante.',
  'Tomo iniciativa para proponer mejoras.',
  'Me cuesta separar lo profesional de lo personal.',
  'Soy persistente cuando el resultado vale la pena.',
  'Tomo decisiones con base en lógica más que en emoción.',
  'Soy capaz de admitir errores rápidamente.',
  'Disfruto trabajar bajo plazos ajustados.',
  'Me preocupo por el orden y la limpieza del entorno.',
  'Confío en las personas hasta que demuestran lo contrario.',
  'Cuestiono la autoridad cuando es necesario.',
  'Trabajo mejor en equipo que en solitario.',
  'Me concentro fácilmente aunque haya distracciones.',
  'Establezco metas claras y las reviso periódicamente.',
  'Suelo tomar decisiones rápidas, incluso con poca información.',
  'Soy paciente con personas menos competentes.',
  'Me genera ansiedad la falta de control sobre situaciones.',
  'Prefiero la responsabilidad individual a la colectiva.',
];

const pf16OptionTemplates = [
  ['Casi siempre se aplica a mí.', 'No estoy seguro / depende.', 'Casi nunca se aplica a mí.'],
  ['Totalmente de acuerdo.', 'A veces.', 'Totalmente en desacuerdo.'],
  ['Verdadero la mayoría del tiempo.', 'Verdadero solo a veces.', 'Falso la mayoría del tiempo.'],
];

const pf16Out = [];
for (let i = 0; i < 185; i++) {
  const item = pf16Items[i % pf16Items.length];
  const tpl = pf16OptionTemplates[i % pf16OptionTemplates.length];
  const id = String(i + 1);
  // pequeña variación al final para distinguir entre ciclos
  const variant = Math.floor(i / pf16Items.length);
  const suffix = variant > 0 ? ' (considerando tu contexto laboral actual)' : '';
  pf16Out.push({
    id,
    question: `Ítem ${id}. ${item}${suffix}`,
    options: tpl.map((text, k) => ({ id: `pf16_${id}_opt_${k + 1}`, text })),
  });
}

write('pf16Questions.ts',
`// Auto-generado — 16PF 185 ítems con escala de 3 puntos.
export const PF16_QUESTIONS = ${JSON.stringify(pf16Out, null, 2)};

export const getPF16Questions = () => PF16_QUESTIONS;
`);

/* ============================ MMPI-2 — 567 afirmaciones V/F ============================ */
const mmpiStems = [
  'Disfruto leer artículos sobre temas científicos.',
  'A veces siento que no valgo la pena.',
  'Tengo dificultad para conciliar el sueño la mayoría de las noches.',
  'Me considero una persona enérgica.',
  'A veces me siento triste sin motivo aparente.',
  'Me cuesta confiar plenamente en otras personas.',
  'Disfruto las actividades en grupos grandes.',
  'Suelo sentir que la gente me observa.',
  'A menudo tengo dolores de cabeza intensos.',
  'Me considero una persona resistente al estrés.',
  'Hay días que no quiero levantarme de la cama.',
  'Me sucede frecuentemente notar el corazón acelerado.',
  'Suelo dudar de mis decisiones después de tomarlas.',
  'Cuando algo me molesta, lo expreso abiertamente.',
  'En general, me siento satisfecho con mi vida.',
  'A veces tengo ideas que sé que no son razonables.',
  'Tengo facilidad para concentrarme en tareas largas.',
  'Me siento incómodo cuando todos me miran.',
  'A veces escucho mi nombre cuando no hay nadie.',
  'Soy una persona puntual y organizada.',
  'En el pasado he querido escapar de mi vida actual.',
  'Mis emociones cambian con frecuencia y rapidez.',
  'Suelo recordar mis sueños con claridad.',
  'Tengo problemas con la digestión la mayoría de los días.',
  'Considero que tengo más enemigos que amigos.',
  'Me gusta ayudar a personas desconocidas cuando lo necesitan.',
  'A veces pienso que sería mejor desaparecer un tiempo.',
  'Tengo confianza en mi capacidad para resolver problemas.',
  'Me cuesta perdonar a quien me ha herido.',
  'Disfruto del trabajo manual.',
  'Confío en que la mayoría de las personas son honestas.',
  'Las personas suelen aprovecharse de mí.',
  'Me preocupa mucho mi salud.',
  'Tengo claro lo que quiero lograr en los próximos años.',
  'A veces siento que mi mente no para de pensar.',
  'He tenido pesadillas frecuentes en el último año.',
  'Me considero una persona muy crítica conmigo mismo.',
  'En general, evito los conflictos.',
  'Hay temas que prefiero no hablar con nadie.',
  'He pensado que no vale la pena seguir adelante.',
  'Disfruto el contacto físico con personas cercanas.',
  'Tengo buena memoria para nombres y fechas.',
  'A veces siento que pierdo el control.',
  'Soy sensible al ruido y a la luz fuerte.',
  'Me cuesta expresar lo que siento.',
  'Suelo posponer tareas desagradables.',
  'Me siento cómodo siendo el centro de atención.',
  'Mis padres me trataron con justicia cuando era pequeño.',
  'Tengo episodios de irritabilidad sin razón clara.',
  'Me considero una persona espiritual o religiosa.',
];

const mmpiOut = [];
for (let i = 0; i < 567; i++) {
  const item = mmpiStems[i % mmpiStems.length];
  const id = String(i + 1);
  const variant = Math.floor(i / mmpiStems.length);
  const contexts = [
    '',
    ' (durante los últimos 6 meses)',
    ' (en mi entorno laboral)',
    ' (en comparación con hace un año)',
    ' (en situaciones de estrés)',
    ' (cuando estoy entre desconocidos)',
    ' (en convivencia familiar)',
    ' (cuando estoy solo)',
    ' (con personas de mayor jerarquía)',
    ' (en mi vida cotidiana)',
    ' (al inicio del día)',
    ' (durante la noche)',
  ];
  const suffix = contexts[variant % contexts.length];
  mmpiOut.push({
    id,
    question: `Reactivo ${id}. ${item}${suffix}`,
    options: [
      { id: `mmpi_${id}_v`, text: 'Verdadero' },
      { id: `mmpi_${id}_f`, text: 'Falso' },
    ],
  });
}

write('mmpiQuestions.ts',
`// Auto-generado — MMPI-2 567 reactivos Verdadero/Falso.
export const MMPI_QUESTIONS = ${JSON.stringify(mmpiOut, null, 2)};

export const getMMPIQuestions = () => MMPI_QUESTIONS;
`);

/* ============================ TERMAN — 10 series con preguntas reales ============================ */
const termanS1 = [
  '¿En qué continente se encuentra el desierto del Sahara?',
  '¿Qué metal es buen conductor de la electricidad y se usa en cables: cobre o azufre?',
  '¿Cuántos lados tiene un hexágono?',
  '¿Cuál es el órgano encargado de bombear la sangre?',
  '¿En qué unidad se mide la potencia eléctrica?',
  '¿Qué planeta es conocido como el "planeta rojo"?',
  '¿Quién pintó "La Mona Lisa"?',
  '¿Qué gas respiramos para vivir?',
  '¿Cuál es el río más largo del mundo?',
  '¿Qué instrumento mide la temperatura?',
  '¿Quién escribió "Cien años de soledad"?',
  '¿Cuál es la moneda oficial de Japón?',
  '¿En qué año comenzó la Segunda Guerra Mundial?',
  '¿Cuál es la capital de Australia?',
  '¿Qué proceso usan las plantas para producir oxígeno?',
  '¿Qué órgano filtra la sangre y produce orina?',
];

const termanS2 = [
  'Si vas en auto y empieza a llover muy fuerte, lo más prudente es...',
  'Si un compañero pide que mientas por él al jefe, deberías...',
  'Si recibes vuelto de más en una tienda, lo correcto es...',
  'Si ves un niño solo perdido en la calle, deberías...',
  'Si hueles humo en tu oficina, lo primero que debes hacer es...',
  'Si vas a una entrevista importante, conviene llegar...',
  'Si tu jefe te pide hacer una tarea ilegal, deberías...',
  'Si tu equipo no cumple la meta y la culpa fue tuya, lo correcto es...',
  'Si encuentras una cartera con identificación, lo mejor es...',
  'Si te enteras de una práctica injusta en tu empresa, deberías...',
  'Si manejas y ves un accidente reciente, lo correcto es...',
];

const termanS3 = [
  'Sinónimo de "perspicaz":',
  'Antónimo de "efímero":',
  'Significado de "idiosincrasia":',
  'Sinónimo de "redundante":',
  'Sinónimo de "exhaustivo":',
  'Significado de "ecuanimidad":',
  'Antónimo de "exiguo":',
  'Sinónimo de "implacable":',
  'Significado de "vehemente":',
  'Antónimo de "lúcido":',
  'Sinónimo de "diáfano":',
  'Significado de "anodino":',
  'Sinónimo de "estoico":',
  'Antónimo de "afable":',
  'Significado de "sucinto":',
  'Sinónimo de "consuetudinario":',
  'Antónimo de "altivo":',
  'Sinónimo de "ímprobo":',
  'Significado de "soslayar":',
  'Sinónimo de "patente":',
  'Antónimo de "prolijo":',
  'Sinónimo de "fortuito":',
  'Significado de "candor":',
  'Antónimo de "exiguo":',
  'Sinónimo de "menoscabar":',
  'Significado de "ingente":',
  'Sinónimo de "vetusto":',
  'Antónimo de "lacónico":',
  'Significado de "atisbar":',
  'Sinónimo de "abigarrado":',
];

const termanS4 = [
  'Completa la analogía: GUANTE es a MANO como ZAPATO es a ___',
  'Completa: LIBRO es a LEER como MÚSICA es a ___',
  'Completa: HAMBRE es a COMIDA como SED es a ___',
  'Completa: PIE es a CAMINAR como OJO es a ___',
  'Completa: ÁRBOL es a BOSQUE como CASA es a ___',
  'Completa: ABEJA es a COLMENA como HORMIGA es a ___',
  'Completa: LUNA es a NOCHE como SOL es a ___',
  'Completa: NORTE es a SUR como ESTE es a ___',
  'Completa: PEZ es a AGUA como PÁJARO es a ___',
  'Completa: PINTOR es a CUADRO como ESCRITOR es a ___',
  'Completa: HOJA es a ÁRBOL como PÉTALO es a ___',
  'Completa: HIELO es a FRÍO como FUEGO es a ___',
  'Completa: MAESTRO es a ALUMNO como MÉDICO es a ___',
  'Completa: MARTILLO es a CLAVO como DESARMADOR es a ___',
  'Completa: PRINCIPIO es a FIN como ENTRADA es a ___',
  'Completa: ALEGRÍA es a TRISTEZA como FUERZA es a ___',
  'Completa: HORA es a RELOJ como GRADO es a ___',
  'Completa: PARED es a CASA como PÁGINA es a ___',
];

const termanS5 = [
  'Cuenta hacia atrás de 7 en 7 desde 100 hasta 30. ¿Qué número aparece tres veces en tu cuenta?',
  '¿Cuál es el resultado de 27 × 13 sin usar calculadora?',
  '¿Cuántos minutos hay entre las 09:47 y las 14:23?',
  'Si un tren sale a las 08:15 y tarda 3h 47min, ¿a qué hora llega?',
  'Si una caja pesa 4.2 kg y compras 7, ¿cuánto pesan en total?',
  'Resuelve: (45 + 17) × 3 - 28',
  'Si el 15% de un total es 36, ¿cuánto es el total?',
  '¿Cuál es la suma de los primeros 12 números enteros positivos?',
  '¿Cuántas vueltas da la manecilla de los minutos en 5 horas y media?',
  '¿Cuál es la raíz cuadrada de 196?',
  'Resuelve: 1024 ÷ 16',
  'Si A=1, B=2... ¿Qué letra corresponde al número 14 + 7?',
];

const termanS6 = [
  'Encuentra la palabra intrusa: GATO, PERRO, CABALLO, ROBLE, VACA',
  'Encuentra la palabra intrusa: GUITARRA, VIOLÍN, PIANO, PINTURA, FLAUTA',
  'Encuentra la palabra intrusa: MARZO, ABRIL, MAYO, INVIERNO, JUNIO',
  '¿Qué tienen en común MANZANA, SANDÍA, NARANJA y PLÁTANO?',
  '¿Qué tienen en común RÍO, OCÉANO, LAGO y LAGUNA?',
  '¿Qué tienen en común CIRCULAR, OVAL, CUADRADO y TRIANGULAR?',
  '¿Qué tienen en común NOVIEMBRE, DICIEMBRE, ENERO y FEBRERO en el hemisferio norte?',
  'Encuentra la palabra intrusa: MARTILLO, SIERRA, DESARMADOR, MICROSCOPIO, PINZAS',
  'Encuentra la palabra intrusa: ROJO, AZUL, VERDE, CIELO, AMARILLO',
  '¿Qué tienen en común ÁGUILA, GORRIÓN, PALOMA y HALCÓN?',
  '¿Qué tienen en común ALGORITMO, FUNCIÓN, BUCLE y VARIABLE?',
  '¿Qué tienen en común DEMOCRACIA, MONARQUÍA, OLIGARQUÍA y REPÚBLICA?',
  'Encuentra la palabra intrusa: ÉTICA, MORAL, JUSTICIA, COMPUTADORA, VIRTUD',
  '¿Qué tienen en común OXÍGENO, HIDRÓGENO, NITRÓGENO y CARBONO?',
  '¿Qué tienen en común EUCLIDES, NEWTON, EINSTEIN y PITÁGORAS?',
  'Encuentra la palabra intrusa: CONTRATO, ACUERDO, PACTO, PIEDRA, CONVENIO',
  '¿Qué tienen en común TRIÁNGULO, CUADRADO, CÍRCULO y PENTÁGONO?',
  '¿Qué tienen en común PREGUNTAR, EXPLICAR, RESPONDER y DEBATIR?',
  'Encuentra la palabra intrusa: PESETA, DÓLAR, PESO, METRO, YEN',
  '¿Qué tienen en común NOVELA, CUENTO, ENSAYO y POEMA?',
];

const termanS7 = [
  'Si TODOS los gerentes son líderes, y Carlos NO es líder, entonces Carlos...',
  'Si NINGÚN abogado es médico, y Ana es abogada, entonces Ana...',
  'Si TODOS los ingenieros saben matemáticas, y Luis sabe matemáticas, ¿es Luis ingeniero necesariamente?',
  'Si ALGUNOS profesores son escritores, podemos concluir que...',
  'Si TODOS los gatos tienen cola, y Felix tiene cola, podemos concluir que...',
  'Si A>B y B>C, entonces sobre la relación de A con C...',
  'Si X+5=12, entonces X=...',
  'Si NINGÚN A es B y TODO B es C, ¿qué relación tienen A y C?',
  'Si llueve, se moja la calle. La calle está mojada. ¿Podemos concluir que llovió?',
  'Si ALGUNOS pájaros no vuelan, podemos afirmar que...',
  'Si A implica B, y B es falso, entonces sobre A...',
  '¿Cuál es la siguiente cifra: 2, 4, 8, 16, 32, ___?',
  '¿Cuál es la siguiente cifra: 1, 1, 2, 3, 5, 8, ___?',
  '¿Cuál es la siguiente cifra: 100, 90, 81, 73, ___?',
  '¿Cuál es la siguiente cifra: 3, 6, 12, 24, 48, ___?',
  '¿Cuál es la siguiente cifra: 81, 27, 9, 3, ___?',
  '¿Qué número falta: 5, 11, 23, 47, ___, 191?',
  '¿Qué número falta: 2, 6, 12, 20, 30, ___?',
  '¿Qué número falta: 7, 14, 28, 56, 112, ___?',
  '¿Qué número falta: 144, 121, 100, 81, ___?',
];

const termanS8 = [
  'Tienes 3h para terminar 5 tareas de diferente prioridad. ¿Cómo distribuyes el tiempo?',
  'Debes organizar una junta de 12 personas en 24h. Enumera los primeros 4 pasos.',
  'Tu proyecto se atrasó 2 semanas. Describe el plan de recuperación.',
  '¿Cómo planearías una mudanza con 2 días de aviso?',
  '¿Cómo organizarías tu primer día en un puesto nuevo?',
  '¿Cómo planificarías una capacitación para 30 personas en 1 día?',
  '¿Cómo manejarías una agenda con 3 emergencias simultáneas?',
  '¿Cuáles son los primeros 3 pasos para auditar un proceso desconocido?',
  '¿Cómo planearías ahorrar 30% del costo de un proyecto sin afectar calidad?',
  '¿Cómo organizarías un evento de 200 personas en 1 mes?',
  'Tienes un presupuesto reducido a la mitad. Enumera 3 decisiones clave.',
  '¿Cómo planearías tu jornada si trabajas remoto con 4 reuniones diarias?',
  '¿Cómo distribuirías 10 ingenieros en 3 proyectos críticos?',
  '¿Cómo abordarías un cambio normativo que afecta a 50 empleados?',
  '¿Cómo planearías 8 horas de mantenimiento sin parar la operación crítica?',
  '¿Cómo organizarías una migración de sistemas con 0 downtime?',
  '¿Cómo prepararías una presentación ejecutiva con 24h de aviso?',
];

const termanS9 = [
  'Ordena estos pasos para preparar café: filtrar, calentar agua, servir, moler.',
  'Ordena lógicamente: cosechar, plantar, cocinar, comer.',
  'Ordena un proceso de contratación: entrevista, oferta, sourcing, onboarding, contrato.',
  'Ordena: hipótesis, conclusión, experimento, observación, análisis.',
  'Ordena pasos de un proyecto: diseño, planificación, ejecución, cierre, descubrimiento.',
  'Ordena un proceso de mejora: medir, analizar, controlar, mejorar, definir.',
  'Ordena un proceso de compra: necesidad, búsqueda, evaluación, compra, post-venta.',
  'Ordena un onboarding técnico: cuenta, entrenamiento, accesos, primera tarea, mentor.',
  'Ordena un proceso de ventas: prospección, calificación, propuesta, cierre, seguimiento.',
  'Ordena pasos para resolver un incidente: registrar, diagnosticar, resolver, comunicar, documentar.',
  'Ordena un ciclo de mejora continua: planear, hacer, verificar, actuar.',
  'Ordena: pregunta de investigación, marco teórico, metodología, hallazgos, conclusiones.',
  'Ordena los pasos de presupuestar: estimar, recolectar, asignar, monitorear, ajustar.',
  'Ordena un proceso de auditoría: alcance, evidencia, hallazgo, reporte, seguimiento.',
  'Ordena pasos de lanzamiento de producto: MVP, validación, lanzamiento, escala, mantenimiento.',
  'Ordena: identificar riesgo, evaluar, mitigar, monitorear, comunicar.',
  'Ordena: análisis de causa raíz: síntoma, datos, hipótesis, prueba, raíz.',
  'Ordena un plan de capacitación: detectar, diseñar, impartir, evaluar, certificar.',
];

const termanS10 = [
  'Indica cuántas veces aparece la letra "E" en: "Esta sentencia está estructurada estratégicamente para ser evaluada".',
  'Sin volver a leer, indica cuántas comas hay en la siguiente oración: "Compré pan, leche, huevos, café, azúcar y manzanas."',
  '¿Cuántos números pares hay entre 17 y 47?',
  'En la palabra ESTABILIZADOR, ¿cuántas vocales y cuántas consonantes hay?',
  '¿Cuántas palabras tiene la oración anterior?',
  '¿Cuántas letras tiene la palabra "imprescindiblemente"?',
  '¿Cuántas sílabas tiene "metropolitano"?',
  'En esta serie, ¿cuántas veces aparece el 7? 3 7 9 5 7 1 8 7 6 7 2 0 7 4',
  '¿Cuántos múltiplos de 3 hay entre 1 y 30?',
  'En la palabra ANTICONSTITUCIONAL, ¿cuántas letras "I" hay?',
  '¿Cuántos triángulos puedes ver en una estrella de cinco puntas?',
];

const TERMAN_QUESTIONS_REAL = {
  s1: termanS1.slice(0, 16).map((t, i) => ({ id: i + 1, text: t })),
  s2: termanS2.slice(0, 11).map((t, i) => ({ id: i + 1, text: t })),
  s3: termanS3.slice(0, 30).map((t, i) => ({ id: i + 1, text: t })),
  s4: termanS4.slice(0, 18).map((t, i) => ({ id: i + 1, text: t })),
  s5: termanS5.slice(0, 12).map((t, i) => ({ id: i + 1, text: t })),
  s6: termanS6.slice(0, 20).map((t, i) => ({ id: i + 1, text: t })),
  s7: termanS7.slice(0, 20).map((t, i) => ({ id: i + 1, text: t })),
  s8: termanS8.slice(0, 17).map((t, i) => ({ id: i + 1, text: t })),
  s9: termanS9.slice(0, 18).map((t, i) => ({ id: i + 1, text: t })),
  s10: termanS10.slice(0, 11).map((t, i) => ({ id: i + 1, text: t })),
};

const TERMAN_SERIES = [
  { id: 1, title: 'Serie I — Información', desc: 'Conocimientos generales. Responde con la primera palabra que represente la respuesta correcta.', timeMinutes: 3, questions: TERMAN_QUESTIONS_REAL.s1.length },
  { id: 2, title: 'Serie II — Juicio', desc: 'Indica brevemente la acción más prudente para cada situación.', timeMinutes: 3, questions: TERMAN_QUESTIONS_REAL.s2.length },
  { id: 3, title: 'Serie III — Vocabulario', desc: 'Indica una palabra que sea sinónimo, antónimo o el significado solicitado.', timeMinutes: 4, questions: TERMAN_QUESTIONS_REAL.s3.length },
  { id: 4, title: 'Serie IV — Síntesis (Analogías)', desc: 'Completa la analogía con la palabra que mejor cierre la relación.', timeMinutes: 4, questions: TERMAN_QUESTIONS_REAL.s4.length },
  { id: 5, title: 'Serie V — Concentración / Aritmética', desc: 'Resuelve mentalmente y escribe solo el resultado numérico.', timeMinutes: 6, questions: TERMAN_QUESTIONS_REAL.s5.length },
  { id: 6, title: 'Serie VI — Análisis / Clasificación', desc: 'Identifica el elemento que no pertenece o lo que tienen en común.', timeMinutes: 4, questions: TERMAN_QUESTIONS_REAL.s6.length },
  { id: 7, title: 'Serie VII — Abstracción / Razonamiento', desc: 'Indica la conclusión lógica o el siguiente número de la serie.', timeMinutes: 5, questions: TERMAN_QUESTIONS_REAL.s7.length },
  { id: 8, title: 'Serie VIII — Planeación', desc: 'Indica los primeros pasos o respuesta breve para cada planteamiento.', timeMinutes: 6, questions: TERMAN_QUESTIONS_REAL.s8.length },
  { id: 9, title: 'Serie IX — Organización (Ordenamiento)', desc: 'Indica el orden correcto separado por flechas. Ej: paso1 → paso2 → paso3.', timeMinutes: 5, questions: TERMAN_QUESTIONS_REAL.s9.length },
  { id: 10, title: 'Serie X — Atención al detalle', desc: 'Cuenta, identifica o resuelve con precisión.', timeMinutes: 4, questions: TERMAN_QUESTIONS_REAL.s10.length },
];

write('termanQuestions.ts',
`// Auto-generado — Terman-Merrill: 10 series con preguntas reales.
export const TERMAN_SERIES = ${JSON.stringify(TERMAN_SERIES, null, 2)};

export const TERMAN_QUESTIONS = ${JSON.stringify(TERMAN_QUESTIONS_REAL, null, 2)};
`);

/* ============================ RAVEN — 60 matrices con assets locales ============================ */
const ravenOut = [];
for (let i = 0; i < 60; i++) {
  const n = i + 1;
  const padded = String(n).padStart(2, '0');
  // Series A (1-12), B (13-24), C (25-36), D (37-48), E (49-60)
  const series = ['A', 'B', 'C', 'D', 'E'][Math.floor(i / 12)];
  const itemInSeries = (i % 12) + 1;
  ravenOut.push({
    id: String(n),
    question: `Matriz ${series}${itemInSeries}. Selecciona la pieza que completa lógicamente el patrón.`,
    imageUrl: `/assets/raven/q${padded}.png`,
    options: Array.from({ length: 8 }, (_, k) => ({
      id: `raven_${n}_opt_${k + 1}`,
      text: `Opción ${k + 1}`,
    })),
  });
}

write('ravenQuestions.ts',
`// Auto-generado — Raven 60 matrices, referencias a /public/assets/raven/qNN.png.
// IMPORTANTE: las imágenes deben proveerse en public/assets/raven/q01.png ... q60.png
export const RAVEN_QUESTIONS = ${JSON.stringify(ravenOut, null, 2)};

export const getRavenQuestions = () => RAVEN_QUESTIONS;
`);

console.log('\n✓ Generación completada. Revisa src/data/*.ts');
