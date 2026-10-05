// Banco del test Zavic (valores e intereses). Redactado por Hacke's Jobs:
// reactivos originales, no los del instrumento comercial.
//
// 60 casos distintos (antes eran 15 casos repetidos 4 veces):
//  · 30 de VALORES: cada opción representa Moral, Legalidad, Indiferencia o Corrupción.
//  · 30 de INTERESES: cada opción representa Económico, Político, Social o Religioso.
// Se intercalan y el orden de las opciones se baraja con semilla fija.
import { barajar, type ChoiceQuestion } from '@/lib/psicometrias/banco';

export const ZAVIC_VERSION = 'zavic-2026-10';

const VALORES = { M: 'Moral', L: 'Legalidad', I: 'Indiferencia', C: 'Corrupción' } as const;
const INTERESES = { E: 'Económico', P: 'Político', S: 'Social', R: 'Religioso' } as const;

/** [situación, Moral, Legalidad, Indiferencia, Corrupción] */
const CASOS_VALORES: [string, string, string, string, string][] = [
  ['Un compañero comete una falta menor en el trabajo.',
    'Hablar con él para que lo corrija.',
    'Aplicar lo que indica el reglamento interno.',
    'No involucrarme; no es mi problema.',
    'Usar la falta a mi favor si puedo.'],
  ['Te ofrecen una "comisión por debajo del agua" para acelerar un trámite.',
    'Rechazarla; no está bien.',
    'Rechazarla y reportarla al área de cumplimiento.',
    'Ignorar la oferta y seguir trabajando.',
    'Aceptarla discretamente si nadie se entera.'],
  ['Ves que alguien hace trampa en un proceso de selección.',
    'Decirle que es injusto para los demás candidatos.',
    'Reportarlo para que se aplique la política del proceso.',
    'No decir nada para no ganarme problemas.',
    'Usar lo que vi para negociar algo a cambio.'],
  ['Descubres que un proveedor sobornó a un comprador interno.',
    'Denunciarlo aunque implique perder al proveedor.',
    'Reportarlo para que se inicie el proceso disciplinario formal.',
    'Mantenerme al margen; no me toca.',
    'Pedir mi parte para guardar silencio.'],
  ['Puedes obtener un ascenso que le correspondería a un compañero más capacitado.',
    'Reconocer que él lo merece más.',
    'Dejar que decida el procedimiento formal de promoción.',
    'Quedarme callado; que decidan los demás.',
    'Hablar mal de él para quedarme con el puesto.'],
  ['Un cliente te pide facturar un servicio que no se prestó.',
    'Negarme; sería mentir.',
    'Negarme porque la ley fiscal lo prohíbe.',
    'Que lo decida otra persona.',
    'Hacerlo si me dan una compensación.'],
  ['Una regla interna te perjudica injustamente.',
    'Exponer por qué es injusta y proponer que se cambie.',
    'Cumplirla mientras esté vigente.',
    'Ignorarla cuando me convenga.',
    'Conseguir que alguien me exente a cambio de un favor.'],
  ['Tu jefe te pide hacer algo legal pero éticamente cuestionable.',
    'Negarme y explicarle mis razones.',
    'Hacerlo solo si se confirma que está dentro de la ley.',
    'Hacerlo; evaluar la ética no me corresponde.',
    'Hacerlo y pedir algo a cambio.'],
  ['Debes elegir entre ganar más dinero o cumplir un acuerdo de palabra.',
    'Cumplir mi palabra aunque pierda dinero.',
    'Revisar qué está firmado y apegarme a eso.',
    'Me da lo mismo; lo que salga.',
    'Romper el acuerdo si nadie se entera.'],
  ['Ves una negligencia que pone en riesgo a otras personas.',
    'Detenerla y avisar del riesgo.',
    'Activar el protocolo de seguridad establecido.',
    'Pensar que alguien más lo arreglará.',
    'Usar el incidente para presionar a alguien.'],
  ['Un compañero te pide que registres su entrada porque llegará tarde.',
    'Negarme y sugerirle que avise a su jefe con honestidad.',
    'Negarme porque el reglamento prohíbe registrar a otra persona.',
    'Que lo resuelva él; no quiero meterme.',
    'Hacerlo a cambio de que él me cubra después.'],
  ['Encuentras en la impresora un documento confidencial con los sueldos del área.',
    'Entregarlo a su responsable sin leerlo.',
    'Seguir la política de manejo de información confidencial.',
    'Dejarlo donde estaba.',
    'Leerlo y usar la información para negociar mi aumento.'],
  ['Tu jefe te pide anotar más horas de las trabajadas en un proyecto que paga el cliente.',
    'Negarme, porque sería engañar al cliente.',
    'Negarme y consultar el contrato y la política de facturación.',
    'Hacer lo que me pide; la responsabilidad es suya.',
    'Hacerlo y anotar también horas extra para mí.'],
  ['Te das cuenta de que un cliente pagó dos veces la misma factura.',
    'Avisarle de inmediato para devolverle el pago.',
    'Reportarlo a contabilidad para que aplique el procedimiento de devolución.',
    'No decir nada; si él no lo nota, no es asunto mío.',
    'Callar y aplicar ese dinero a mis metas de cobranza.'],
  ['Un inspector insinúa que puede "pasar por alto" una falla a cambio de un regalo.',
    'Rechazarlo y corregir la falla.',
    'Rechazarlo y reportar el intento conforme a la norma.',
    'Dejar que otro trate con el inspector.',
    'Darle el regalo para evitar la multa.'],
  ['Un amigo te pide recomendarlo para una vacante para la que no está calificado.',
    'Decirle con franqueza que no puedo recomendarlo para ese puesto.',
    'Pedirle que participe en el proceso como cualquier otro candidato.',
    'Pasar su CV sin comentarios y olvidarme del tema.',
    'Recomendarlo a cambio de un favor.'],
  ['Ves que un compañero se lleva material de oficina a su casa con frecuencia.',
    'Hablar con él y decirle que eso no está bien.',
    'Informar a su jefe conforme al reglamento interno.',
    'No es mi problema.',
    'Llevarme yo también lo que necesite.'],
  ['Puedes ganar un bono si ocultas un defecto menor de un lote de producción.',
    'Reportar el defecto aunque pierda el bono.',
    'Aplicar el procedimiento de calidad para producto no conforme.',
    'Dejar que calidad lo detecte, si es que lo detecta.',
    'Ocultarlo y cobrar el bono.'],
  ['En una licitación, un proveedor te ofrece un viaje si lo favoreces.',
    'Rechazarlo; elegiría al proveedor solo por sus méritos.',
    'Rechazarlo y declararlo según la política de conflicto de interés.',
    'Ignorar el ofrecimiento y que decida el comité.',
    'Aceptar el viaje y favorecerlo.'],
  ['Te equivocaste en un cálculo y nadie se ha dado cuenta.',
    'Corregirlo y avisar a quienes afecta.',
    'Corregirlo siguiendo el procedimiento de control de cambios.',
    'Dejarlo así; si nadie lo notó, no importa.',
    'Culpar a otro si alguien lo descubre.'],
  ['Un cliente te ofrece una propina por atenderlo antes que a los demás.',
    'Agradecer y atenderlo en su turno, como a todos.',
    'Rechazarla porque la política de la empresa lo prohíbe.',
    'Atenderlo como sea y no pensar en ello.',
    'Aceptarla y adelantarlo.'],
  ['Te enteras de que en tu empresa se descarta a candidatos por su edad.',
    'Plantearlo porque es injusto, aunque me genere problemas.',
    'Señalar que la ley prohíbe esa discriminación y pedir que se corrija.',
    'No intervenir; no es mi área.',
    'Usar esa información para presionar a recursos humanos.'],
  ['Un compañero falsificó una firma para agilizar un trámite urgente.',
    'Hablar con él y pedirle que lo corrija, aunque sea incómodo.',
    'Reportarlo, porque falsificar una firma es un delito.',
    'Hacer como que no vi nada.',
    'Pedirle que también agilice mis trámites así.'],
  ['Tienes acceso a información de un cliente que le interesaría a la competencia.',
    'Protegerla, porque me la confiaron.',
    'Protegerla conforme al aviso de privacidad y la ley de datos personales.',
    'No pensar en ello.',
    'Venderla si nadie lo nota.'],
  ['Te piden firmar de recibido un equipo que todavía no llega.',
    'No firmar hasta recibirlo; sería mentir.',
    'No firmar, porque el procedimiento exige verificar la entrega.',
    'Firmar para no complicarme.',
    'Firmar a cambio de un beneficio del proveedor.'],
  ['Un colaborador tuyo cometió un error y te pide que no lo reportes.',
    'Explicarle que hay que asumirlo y ayudarle a corregirlo.',
    'Reportarlo como lo establece el procedimiento.',
    'Hacer como si no supiera nada.',
    'Callar a cambio de que me deba un favor.'],
  ['Notas que una báscula de la planta registra un peso que favorece a la empresa.',
    'Informarlo, porque perjudica a los clientes.',
    'Solicitar la calibración que exige la norma.',
    'No hacer nada; no es mi área.',
    'Aprovechar la diferencia para cumplir mis metas.'],
  ['Te ofrecen copiar el software de la empresa para usarlo en tu negocio personal.',
    'No hacerlo; no me pertenece.',
    'No hacerlo; viola la licencia y la ley de derechos de autor.',
    'Me da igual lo que hagan otros.',
    'Copiarlo; nadie se dará cuenta.'],
  ['En una evaluación de desempeño puedes calificar alto a un amigo que rindió poco.',
    'Calificarlo con justicia, aunque sea mi amigo.',
    'Calificarlo con los indicadores definidos en el formato.',
    'Ponerle una calificación promedio para no complicarme.',
    'Calificarlo alto si él hace lo mismo conmigo.'],
  ['Te enteras de que la empresa descarga residuos sin tratar al drenaje.',
    'Plantearlo a la dirección porque daña a la comunidad.',
    'Exigir que se cumpla la norma ambiental y, si no, acudir a la autoridad.',
    'No es mi responsabilidad.',
    'Callarme a cambio de un ascenso.'],
];

/** [situación, Económico, Político, Social, Religioso] */
const CASOS_INTERESES: [string, string, string, string, string][] = [
  ['Si te ofrecen dos puestos, elegirías el que:',
    'Pague mejor.', 'Tenga más autoridad y poder de decisión.', 'Más ayude a otras personas.', 'Sea más compatible con mis creencias.'],
  ['Con un ingreso extra inesperado, lo primero que harías es:',
    'Invertirlo para que crezca.', 'Usarlo para posicionarme mejor en mi entorno.', 'Apoyar a alguien que lo necesita.', 'Dar una parte a mi comunidad de fe.'],
  ['En tu tiempo libre preferirías:',
    'Emprender un negocio propio.', 'Participar en una asociación donde pueda dirigir.', 'Hacer voluntariado.', 'Participar en actividades de mi comunidad religiosa o espiritual.'],
  ['De un trabajo, lo que más te importa es:',
    'El sueldo y las prestaciones.', 'La posibilidad de llegar a puestos de dirección.', 'Que mi trabajo beneficie a la gente.', 'Que respete mis valores y mi fe.'],
  ['Admiras más a una persona que:',
    'Construyó una fortuna desde cero.', 'Llegó a dirigir una gran institución.', 'Dedicó su vida a servir a los demás.', 'Vive su fe con coherencia.'],
  ['Si pudieras cambiar algo de tu ciudad, sería:',
    'Atraer más inversión y empleos bien pagados.', 'Ocupar un cargo para tomar las decisiones importantes.', 'Mejorar los servicios para quienes menos tienen.', 'Fortalecer los valores morales y espirituales.'],
  ['Una meta que te gustaría cumplir en diez años:',
    'Tener independencia financiera.', 'Dirigir un área o una empresa.', 'Haber ayudado a muchas personas.', 'Haber crecido espiritualmente.'],
  ['En una reunión de trabajo, lo que más disfrutas es:',
    'Hablar de cifras, costos y ganancias.', 'Conducir la discusión y lograr que se acepte mi propuesta.', 'Que todos se sientan escuchados.', 'Que las decisiones respeten principios éticos y espirituales.'],
  ['Un libro que leerías con gusto:',
    'Sobre finanzas personales e inversión.', 'Sobre liderazgo y estrategia.', 'Sobre historias de ayuda humanitaria.', 'Sobre espiritualidad o fe.'],
  ['Si ganaras un premio en tu empresa, preferirías que fuera:',
    'Un bono en efectivo.', 'Un ascenso con más responsabilidad.', 'Un donativo a la causa social que yo elija.', 'Tiempo libre para un retiro espiritual.'],
  ['Ante una emergencia en tu colonia, tú:',
    'Buscarías cómo proteger tu patrimonio.', 'Organizarías a los vecinos y tomarías el liderazgo.', 'Ayudarías directamente a los afectados.', 'Convocarías a orar y a apoyarse en la fe.'],
  ['Lo que más te motiva para trabajar duro es:',
    'Ganar más dinero.', 'Ganar influencia y reconocimiento.', 'Contribuir al bienestar de otros.', 'Cumplir con lo que considero mi misión espiritual.'],
  ['Al orientar a un familiar sobre qué carrera estudiar, le recomendarías una que:',
    'Tenga buenos ingresos.', 'Le permita llegar a posiciones de mando.', 'Le permita servir a los demás.', 'Vaya de acuerdo con sus creencias.'],
  ['En una organización civil te gustaría:',
    'Administrar sus finanzas.', 'Presidirla.', 'Atender directamente a los beneficiarios.', 'Encargarte de su orientación ética y espiritual.'],
  ['Si pudieras tomarte un año sabático, lo usarías para:',
    'Preparar un negocio rentable.', 'Construir relaciones con personas influyentes.', 'Hacer trabajo comunitario.', 'Profundizar en tu vida espiritual.'],
  ['Lo que más te preocupa del futuro es:',
    'No tener estabilidad económica.', 'Perder posición o influencia.', 'Que aumente la desigualdad.', 'Que se pierdan los valores espirituales.'],
  ['La noticia que leerías primero:',
    'La de la bolsa y la economía.', 'La de una elección o un cambio de gobierno.', 'La de un programa de apoyo a comunidades.', 'La de un acontecimiento religioso.'],
  ['Si tu empresa te pide representarla, prefieres:',
    'Negociar contratos grandes.', 'Representarla ante autoridades y cámaras empresariales.', 'Coordinar su programa de responsabilidad social.', 'Participar en su comité de ética.'],
  ['Lo que más valoras de un líder es:',
    'Que haga crecer las utilidades.', 'Su capacidad para ejercer el mando.', 'Su interés genuino por su gente.', 'Su congruencia con sus creencias.'],
  ['Te sentirías más realizado si:',
    'Lograras un patrimonio sólido.', 'Ocuparas un cargo de alto nivel.', 'Supieras que cambiaste la vida de alguien.', 'Vivieras en paz con tu fe.'],
  ['Para un fin de semana ideal, elegirías:',
    'Revisar oportunidades de inversión o de venta.', 'Asistir a un evento con personas influyentes.', 'Apoyar en una casa hogar o un albergue.', 'Ir a un retiro o a una celebración religiosa.'],
  ['Cuando te va bien económicamente, tú:',
    'Ahorras e inviertes.', 'Lo usas para entrar a círculos de poder.', 'Compartes con quien lo necesita.', 'Lo agradeces y das una parte a tu comunidad de fe.'],
  ['El tipo de jefe que te gustaría ser:',
    'El que hace ganar más dinero a su equipo.', 'El que llega a la dirección general.', 'El que forma y cuida a su gente.', 'El que guía con principios y fe.'],
  ['Lo más importante que le enseñarías a un joven:',
    'A administrar su dinero.', 'A liderar y hacerse respetar.', 'A ser solidario.', 'A cultivar su fe.'],
  ['En una votación vecinal o sindical, tú:',
    'Votas por lo que más te convenga económicamente.', 'Te postulas como representante.', 'Votas por lo que más beneficie a la mayoría.', 'Votas según tus convicciones religiosas.'],
  ['Te ofrecen un puesto en otra ciudad. Lo aceptarías si:',
    'El sueldo es mucho mayor.', 'Es un puesto de mayor jerarquía.', 'Desde ahí puedes ayudar más a la gente.', 'Puedes seguir practicando tu fe con tu comunidad.'],
  ['Una actividad que te llena de satisfacción:',
    'Cerrar una buena venta.', 'Convencer a un grupo de seguir tu idea.', 'Enseñar a alguien algo que le cambia la vida.', 'Un momento de oración o meditación.'],
  ['Si pudieras crear una fundación, se dedicaría a:',
    'Financiar a emprendedores con proyectos rentables.', 'Formar líderes políticos y empresariales.', 'Atender a personas en situación de pobreza.', 'Difundir valores espirituales.'],
  ['Lo que más te molesta en el trabajo es:',
    'Que tu esfuerzo no se reconozca con dinero.', 'Que otros tomen decisiones que te corresponden.', 'Que se trate mal a las personas.', 'Que se actúe contra tus principios religiosos.'],
  ['Al final de tu vida te gustaría ser recordado como alguien:',
    'Próspero.', 'Influyente.', 'Generoso.', 'De fe.'],
];

const LETRAS = ['a', 'b', 'c', 'd'];

function armar(id: string, situacion: string, textos: string[], claves: string[], semilla: number): ChoiceQuestion {
  const opciones = barajar(textos.map((text, k) => ({ text, clave: claves[k] })), semilla);
  return {
    id,
    question: `Caso ${id}. ${situacion}`,
    options: opciones.map((op, k) => ({ id: `zavic_${id}_${LETRAS[k]}`, ...op })),
  };
}

// Se intercalan: valores, intereses, valores, intereses…
export const ZAVIC_QUESTIONS: ChoiceQuestion[] = CASOS_VALORES.flatMap((v, i) => {
  const idV = String(i * 2 + 1);
  const idI = String(i * 2 + 2);
  const [sitV, ...optsV] = v;
  const [sitI, ...optsI] = CASOS_INTERESES[i];
  return [
    armar(idV, sitV, optsV, Object.values(VALORES), (i * 2 + 1) * 40503),
    armar(idI, sitI, optsI, Object.values(INTERESES), (i * 2 + 2) * 40503),
  ];
});

export function calificarZavic(answers: Record<string, string>) {
  const valores = Object.fromEntries(Object.values(VALORES).map(v => [v, 0])) as Record<string, number>;
  const intereses = Object.fromEntries(Object.values(INTERESES).map(v => [v, 0])) as Record<string, number>;
  for (const q of ZAVIC_QUESTIONS) {
    const clave = q.options.find(o => o.id === answers[q.id])?.clave;
    if (!clave) continue;
    if (clave in valores) valores[clave]++;
    else if (clave in intereses) intereses[clave]++;
  }
  // El análisis en n8n lee las escalas en rango 0-15 (formato clásico del Zavic).
  const a15 = (conteos: Record<string, number>) =>
    Object.fromEntries(Object.entries(conteos).map(([k, v]) => [k, Math.round(v / 2)]));
  return {
    nota: 'Conteo de elecciones sobre 30 casos de valores y 30 de intereses (máximo 30 por escala). "escala_0_15" = conteo / 2, para leerse con los cortes clásicos del Zavic (Corrupción >= 7 es bandera crítica).',
    conteo: { valores, intereses },
    escala_0_15: { valores: a15(valores), intereses: a15(intereses) },
  };
}

export const getZavicQuestions = () => ZAVIC_QUESTIONS;
