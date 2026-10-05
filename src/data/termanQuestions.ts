// Banco de la prueba de inteligencia tipo Terman-Merrill. Redactado por
// Hacke's Jobs: reactivos originales con la estructura de las 10 series del
// Terman-Merrill, no los del instrumento comercial.
//
// Antes casi todo era respuesta abierta (imposible de calificar igual para
// todos) y había reactivos sin respuesta válida. Ahora cada serie tiene un
// formato objetivo y su clave, y la calificación se hace en el navegador.
import { barajar } from '@/lib/psicometrias/banco';

export const TERMAN_VERSION = 'terman-2026-10';

export type FormatoSerie = 'opcion' | 'dos' | 'numero';

export interface ReactivoTerman {
  id: number;
  text: string;
  /** Opciones (formatos 'opcion' y 'dos'). */
  opciones?: { id: string; text: string }[];
  /** Clave: id(s) de opción correcta(s) o el número esperado. */
  clave: string[];
}

export interface SerieTerman {
  id: number;
  title: string;
  desc: string;
  ejemplo: string;
  formato: FormatoSerie;
  timeMinutes: number;
  /** Puntos por reactivo correcto (en 'dos', por cada opción correcta marcada). */
  puntos: number;
  questions: ReactivoTerman[];
}

const LETRAS = 'abcde';

/**
 * Serie de opción única. En cada reactivo la primera opción es la correcta; se
 * reparte en las posiciones a/b/c/d por partes iguales (en orden aleatorio) para
 * que contestar siempre la misma letra no dé ventaja ni desventaja.
 */
function serieDeOpcion(reactivos: [string, ...string[]][], semilla: number, texto?: string): ReactivoTerman[] {
  const n = reactivos[0].length - 1;
  const posiciones = barajar(reactivos.map((_, i) => i % n), semilla);
  return reactivos.map(([t, correcta, ...distractores], i) => {
    const otras = barajar(distractores, semilla + i + 1);
    const opciones = [...otras.slice(0, posiciones[i]), correcta, ...otras.slice(posiciones[i])];
    return {
      id: i + 1,
      text: texto ?? t,
      opciones: opciones.map((o, k) => ({ id: LETRAS[k], text: o })),
      clave: [LETRAS[posiciones[i]]],
    };
  });
}

/** Opciones fijas (Sí/No, Igual/Opuesto…) con la respuesta correcta indicada. */
function fija(id: number, text: string, opciones: string[], correcta: string): ReactivoTerman {
  return {
    id,
    text,
    opciones: opciones.map((t, k) => ({ id: LETRAS[k], text: t })),
    clave: [LETRAS[opciones.indexOf(correcta)]],
  };
}

const S1: [string, ...string[]][] = [
  ['¿En qué continente está Egipto?', 'África', 'Asia', 'Europa', 'Oceanía'],
  ['¿Cuántos lados tiene un hexágono?', '6', '5', '7', '8'],
  ['¿Qué órgano bombea la sangre por el cuerpo?', 'Corazón', 'Hígado', 'Pulmón', 'Riñón'],
  ['¿En qué unidad se mide la potencia eléctrica?', 'Watt', 'Litro', 'Metro', 'Gramo'],
  ['¿Qué planeta es conocido como "el planeta rojo"?', 'Marte', 'Venus', 'Júpiter', 'Saturno'],
  ['¿Quién pintó "La Gioconda" (Mona Lisa)?', 'Leonardo da Vinci', 'Miguel Ángel', 'Pablo Picasso', 'Diego Rivera'],
  ['¿Qué gas necesitamos respirar para vivir?', 'Oxígeno', 'Nitrógeno', 'Helio', 'Dióxido de carbono'],
  ['¿Qué instrumento mide la temperatura?', 'Termómetro', 'Barómetro', 'Velocímetro', 'Higrómetro'],
  ['¿Quién escribió "Cien años de soledad"?', 'Gabriel García Márquez', 'Octavio Paz', 'Pablo Neruda', 'Carlos Fuentes'],
  ['¿Cuál es la moneda oficial de Japón?', 'Yen', 'Yuan', 'Won', 'Rupia'],
  ['¿En qué año inició la guerra de Independencia de México?', '1810', '1821', '1910', '1492'],
  ['¿Cuál es la capital de Australia?', 'Canberra', 'Sídney', 'Melbourne', 'Perth'],
  ['¿Cómo se llama el proceso con el que las plantas fabrican su alimento usando la luz?', 'Fotosíntesis', 'Respiración', 'Digestión', 'Evaporación'],
  ['¿Qué órgano filtra la sangre y produce la orina?', 'Riñón', 'Páncreas', 'Estómago', 'Bazo'],
  ['¿Cuántos centímetros tiene un metro?', '100', '10', '1000', '60'],
  ['¿Cuál es el océano más grande del planeta?', 'Pacífico', 'Atlántico', 'Índico', 'Ártico'],
];

const S2: [string, ...string[]][] = [
  ['Si vas manejando y empieza a llover muy fuerte, lo más prudente es:', 'Reducir la velocidad y encender las luces.', 'Acelerar para llegar antes.', 'Detenerte a mitad del carril.'],
  ['Si un compañero te pide que mientas por él a su jefe, lo mejor es:', 'Negarte y sugerirle que hable él con su jefe.', 'Mentir para ayudarlo.', 'Contarle a todos lo que te pidió.'],
  ['Si en una tienda te dan cambio de más, lo correcto es:', 'Devolver la diferencia.', 'Quedártela porque el error fue de ellos.', 'Gastarla ahí mismo.'],
  ['Si encuentras a un niño pequeño perdido en la calle, deberías:', 'Quedarte con él y avisar a la policía o a seguridad.', 'Decirle que busque solo a sus papás.', 'Llevarlo a tu casa sin avisar a nadie.'],
  ['Si hueles humo en tu oficina, lo primero que debes hacer es:', 'Dar la alarma y seguir el protocolo de evacuación.', 'Seguir trabajando hasta ver el fuego.', 'Abrir todas las puertas para buscar el origen.'],
  ['Si tienes una entrevista de trabajo importante, conviene llegar:', 'Unos minutos antes de la hora.', 'Justo a la hora, corriendo.', 'Media hora tarde para no parecer ansioso.'],
  ['Si tu jefe te pide hacer algo ilegal, deberías:', 'Negarte y, si insiste, reportarlo.', 'Hacerlo porque es una orden.', 'Hacerlo y guardar pruebas para después.'],
  ['Si tu equipo no cumple la meta por un error tuyo, lo correcto es:', 'Reconocerlo y proponer cómo corregirlo.', 'Culpar a otro compañero.', 'No decir nada.'],
  ['Si encuentras una cartera con identificación, lo mejor es:', 'Buscar la forma de devolverla a su dueño.', 'Quedarte con el dinero y tirar la cartera.', 'Dejarla donde estaba.'],
  ['¿Para qué sirven las señales de tránsito?', 'Para ordenar la circulación y prevenir accidentes.', 'Para adornar las calles.', 'Para que los agentes tengan trabajo.'],
  ['¿Por qué conviene ahorrar una parte del sueldo?', 'Para enfrentar imprevistos y metas futuras.', 'Porque gastar siempre es malo.', 'Para no pagar impuestos.'],
];

/** [palabra, palabra, 'Igual' | 'Opuesto'] */
const S3: [string, string, 'Igual' | 'Opuesto'][] = [
  ['alegre', 'contento', 'Igual'], ['subir', 'bajar', 'Opuesto'], ['rápido', 'veloz', 'Igual'],
  ['comprar', 'vender', 'Opuesto'], ['empezar', 'iniciar', 'Igual'], ['abundante', 'escaso', 'Opuesto'],
  ['perspicaz', 'sagaz', 'Igual'], ['efímero', 'duradero', 'Opuesto'], ['redundante', 'repetitivo', 'Igual'],
  ['lúcido', 'confuso', 'Opuesto'], ['diáfano', 'transparente', 'Igual'], ['afable', 'hosco', 'Opuesto'],
  ['sucinto', 'breve', 'Igual'], ['altivo', 'humilde', 'Opuesto'], ['fortuito', 'casual', 'Igual'],
  ['prolijo', 'conciso', 'Opuesto'], ['vetusto', 'antiguo', 'Igual'], ['lacónico', 'locuaz', 'Opuesto'],
  ['menoscabar', 'disminuir', 'Igual'], ['ingente', 'diminuto', 'Opuesto'], ['implacable', 'inflexible', 'Igual'],
  ['exiguo', 'cuantioso', 'Opuesto'], ['vehemente', 'apasionado', 'Igual'], ['apático', 'entusiasta', 'Opuesto'],
  ['ecuánime', 'imparcial', 'Igual'], ['sumiso', 'rebelde', 'Opuesto'], ['estoico', 'sufrido', 'Igual'],
  ['pródigo', 'avaro', 'Opuesto'], ['soslayar', 'eludir', 'Igual'], ['anodino', 'interesante', 'Opuesto'],
];

/** [concepto, correcta 1, correcta 2, distractor, distractor, distractor] */
const S4: [string, string, string, string, string, string][] = [
  ['Un círculo siempre tiene:', 'centro', 'circunferencia', 'color', 'esquinas', 'gran tamaño'],
  ['Un jardín siempre tiene:', 'plantas', 'tierra', 'cerca', 'perro', 'fuente'],
  ['Un triángulo siempre tiene:', 'tres lados', 'tres ángulos', 'un ángulo recto', 'lados iguales', 'color'],
  ['Un río siempre tiene:', 'agua', 'cauce', 'puentes', 'peces', 'barcos'],
  ['Una ciudad siempre tiene:', 'habitantes', 'construcciones', 'rascacielos', 'metro', 'playa'],
  ['Un juego siempre tiene:', 'reglas', 'jugadores', 'pelota', 'premio', 'árbitro'],
  ['Una moneda siempre tiene:', 'valor', 'dos caras', 'agujero', 'color dorado', 'un animal grabado'],
  ['Un reloj siempre tiene:', 'mecanismo', 'forma de indicar la hora', 'manecillas', 'números romanos', 'alarma'],
  ['Una familia siempre tiene:', 'miembros', 'parentesco', 'hijos', 'casa propia', 'mascota'],
  ['Una empresa siempre tiene:', 'dueño', 'actividad', 'sucursales', 'fábrica', 'sindicato'],
  ['Un mensaje siempre tiene:', 'contenido', 'destinatario', 'timbre postal', 'sobre', 'firma notarial'],
  ['Un árbol siempre tiene:', 'raíces', 'tronco', 'frutos', 'flores', 'nido'],
  ['Un idioma siempre tiene:', 'palabras', 'gramática', 'alfabeto latino', 'acentos', 'diccionario impreso'],
  ['Una votación siempre tiene:', 'votantes', 'opciones', 'urnas de cristal', 'boletas de papel', 'candidatos famosos'],
  ['Una carrera deportiva siempre tiene:', 'competidores', 'meta', 'pista de tierra', 'caballos', 'público'],
  ['Un contrato siempre tiene:', 'partes', 'obligaciones', 'notario', 'sello oficial', 'abogado'],
  ['Una canción siempre tiene:', 'sonido', 'ritmo', 'letra', 'guitarra', 'coro'],
  ['Un edificio siempre tiene:', 'cimientos', 'paredes', 'elevador', 'ventanas de vidrio', 'estacionamiento'],
];

/** [problema, respuesta numérica] */
const S5: [string, string][] = [
  ['Si compras 4 refrescos de 15 pesos cada uno, ¿cuánto pagas en total?', '60'],
  ['Un trabajador gana 450 pesos por día. ¿Cuánto gana en 6 días?', '2700'],
  ['Si tienes 200 pesos y gastas 135, ¿cuánto te queda?', '65'],
  ['¿Cuántos minutos hay en 3 horas y media?', '210'],
  ['Si 5 kilos de manzanas cuestan 120 pesos, ¿cuánto cuestan 3 kilos?', '72'],
  ['El 15% de un número es 36. ¿Cuál es el número?', '240'],
  ['¿Cuánto es (45 + 17) × 3 − 28?', '158'],
  ['Una caja lleva 24 piezas. ¿Cuántas cajas se llenan por completo con 300 piezas?', '12'],
  ['Un auto recorre 60 km en 45 minutos. A la misma velocidad, ¿cuántos km recorre en 3 horas?', '240'],
  ['Tres trabajadores terminan una obra en 12 días. Al mismo ritmo, ¿en cuántos días la terminan 6 trabajadores?', '6'],
  ['Un artículo cuesta 800 pesos y tiene 25% de descuento. ¿Cuánto pagas?', '600'],
  ['Un tanque de 500 litros está al 40%. ¿Cuántos litros faltan para llenarlo?', '300'],
];

/** [pregunta, 'Sí' | 'No'] */
const S6: [string, 'Sí' | 'No'][] = [
  ['¿Conviene revisar la llanta de refacción antes de un viaje largo?', 'Sí'],
  ['¿Es buena idea firmar un contrato sin leerlo si la otra persona parece confiable?', 'No'],
  ['¿Conviene desconectar un aparato eléctrico antes de repararlo?', 'Sí'],
  ['¿Es correcto usar el celular mientras se maneja si la llamada es breve?', 'No'],
  ['¿Hay que lavarse las manos antes de preparar alimentos?', 'Sí'],
  ['¿Es seguro mezclar cloro con otros productos de limpieza para que limpie mejor?', 'No'],
  ['¿Es útil tener los números de emergencia anotados en un lugar visible?', 'Sí'],
  ['¿Conviene compartir la contraseña del banco con un compañero de confianza?', 'No'],
  ['¿Es recomendable guardar copia de los documentos importantes?', 'Sí'],
  ['¿Se debe usar el elevador durante un incendio?', 'No'],
  ['¿Es prudente revisar el cambio que te dan al pagar?', 'Sí'],
  ['¿Se puede ser experto en algo sin haberlo practicado nunca?', 'No'],
  ['¿Hay que usar el equipo de protección aunque la tarea sea rápida?', 'Sí'],
  ['¿Una deuda deja de existir si no se paga a tiempo?', 'No'],
  ['¿Es buena práctica confirmar por escrito los acuerdos importantes?', 'Sí'],
  ['¿Es seguro abrir archivos adjuntos de correos de remitentes desconocidos?', 'No'],
  ['¿Se debe avisar al jefe si no se podrá cumplir con una entrega?', 'Sí'],
  ['¿El agua hierve a la misma temperatura a cualquier altitud?', 'No'],
  ['¿Conviene leer las instrucciones antes de usar una máquina nueva?', 'Sí'],
  ['¿Un año bisiesto tiene 365 días?', 'No'],
];

const S7: [string, ...string[]][] = [
  ['GUANTE es a MANO como ZAPATO es a:', 'pie', 'calcetín', 'pierna', 'suela'],
  ['LIBRO es a LEER como MÚSICA es a:', 'escuchar', 'nota', 'disco', 'radio'],
  ['HAMBRE es a COMIDA como SED es a:', 'agua', 'sal', 'boca', 'calor'],
  ['OJO es a VER como OÍDO es a:', 'oír', 'oreja', 'ruido', 'cabeza'],
  ['ÁRBOL es a BOSQUE como CASA es a:', 'ciudad', 'ladrillo', 'familia', 'techo'],
  ['ABEJA es a COLMENA como HORMIGA es a:', 'hormiguero', 'azúcar', 'insecto', 'tierra'],
  ['LUNA es a NOCHE como SOL es a:', 'día', 'calor', 'estrella', 'cielo'],
  ['NORTE es a SUR como ESTE es a:', 'oeste', 'izquierda', 'oriente', 'centro'],
  ['PEZ es a AGUA como PÁJARO es a:', 'aire', 'nido', 'pluma', 'árbol'],
  ['PINTOR es a CUADRO como ESCRITOR es a:', 'libro', 'pluma', 'lector', 'papel'],
  ['PÉTALO es a FLOR como HOJA es a:', 'planta', 'verde', 'otoño', 'papel'],
  ['HIELO es a FRÍO como FUEGO es a:', 'calor', 'humo', 'leña', 'rojo'],
  ['MAESTRO es a ALUMNO como MÉDICO es a:', 'paciente', 'hospital', 'enfermera', 'receta'],
  ['MARTILLO es a CLAVO como DESARMADOR es a:', 'tornillo', 'madera', 'herramienta', 'taller'],
  ['PRINCIPIO es a FIN como ENTRADA es a:', 'salida', 'puerta', 'boleto', 'pasillo'],
  ['KILÓMETRO es a DISTANCIA como KILOGRAMO es a:', 'peso', 'báscula', 'metro', 'volumen'],
  ['TERMÓMETRO es a TEMPERATURA como RELOJ es a:', 'tiempo', 'pared', 'alarma', 'manecillas'],
  ['CAPÍTULO es a LIBRO como ESCENA es a:', 'obra de teatro', 'actor', 'telón', 'boleto'],
  ['SEMILLA es a PLANTA como HUEVO es a:', 'ave', 'nido', 'cáscara', 'yema'],
  ['JUEZ es a SENTENCIA como MÉDICO es a:', 'diagnóstico', 'bata', 'consultorio', 'enfermedad'],
];

/** [palabras desordenadas, 'Verdadera' | 'Falsa'] */
const S8: [string, 'Verdadera' | 'Falsa'][] = [
  ['moja · agua · el', 'Verdadera'],
  ['cuadrados · son · los · redondos', 'Falsa'],
  ['tiene · semana · siete · la · días', 'Verdadera'],
  ['vuelan · los · peces · alas · con', 'Falsa'],
  ['el · sale · oeste · por · sol · el', 'Falsa'],
  ['más · es · la · el · que · pesado · hierro · pluma', 'Verdadera'],
  ['hielo · caliente · el · es', 'Falsa'],
  ['doce · año · el · tiene · meses', 'Verdadera'],
  ['nunca · leche · vacas · dan · las', 'Falsa'],
  ['minutos · hora · sesenta · una · tiene', 'Verdadera'],
  ['los · ladran · gatos', 'Falsa'],
  ['es · necesaria · vida · agua · para · la · el', 'Verdadera'],
  ['triángulo · cuatro · tiene · un · lados', 'Falsa'],
  ['metal · el · es · oro · un', 'Verdadera'],
  ['antes · que · llega · el · trueno · relámpago · el', 'Falsa'],
  ['pulmones · los · respiramos · con', 'Verdadera'],
  ['más · que · es · grande · la · luna · Tierra · la', 'Falsa'],
];

/** [palabra que no pertenece, ...las otras cuatro] */
const S9: [string, ...string[]][] = [
  ['roble', 'gato', 'perro', 'caballo', 'vaca'],
  ['pintura', 'guitarra', 'violín', 'piano', 'flauta'],
  ['invierno', 'marzo', 'abril', 'mayo', 'junio'],
  ['microscopio', 'martillo', 'sierra', 'desarmador', 'pinzas'],
  ['cielo', 'rojo', 'azul', 'verde', 'amarillo'],
  ['murciélago', 'águila', 'gorrión', 'paloma', 'halcón'],
  ['computadora', 'ética', 'moral', 'justicia', 'virtud'],
  ['piedra', 'contrato', 'acuerdo', 'pacto', 'convenio'],
  ['metro', 'peso', 'dólar', 'euro', 'yen'],
  ['partitura', 'novela', 'cuento', 'ensayo', 'poema'],
  ['Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter'],
  ['madera', 'cobre', 'hierro', 'plata', 'aluminio'],
  ['tiburón', 'ballena', 'delfín', 'foca', 'orca'],
  ['círculo', 'cuadrado', 'rectángulo', 'rombo', 'trapecio'],
  ['triste', 'alegre', 'contento', 'feliz', 'dichoso'],
  ['dormir', 'leer', 'escribir', 'hablar', 'escuchar'],
  ['Madrid', 'Lima', 'Bogotá', 'Quito', 'Santiago'],
  ['9', '2', '4', '6', '8'],
];

/** [serie, número que sigue] */
const S10: [string, string][] = [
  ['2, 4, 6, 8, …', '10'],
  ['5, 10, 15, 20, …', '25'],
  ['3, 6, 12, 24, …', '48'],
  ['1, 1, 2, 3, 5, 8, …', '13'],
  ['100, 90, 81, 73, …', '66'],
  ['81, 27, 9, 3, …', '1'],
  ['5, 11, 23, 47, …', '95'],
  ['2, 6, 12, 20, 30, …', '42'],
  ['7, 14, 28, 56, …', '112'],
  ['144, 121, 100, 81, …', '64'],
  ['1, 4, 9, 16, 25, …', '36'],
  ['50, 45, 41, 38, …', '36'],
  ['3, 5, 9, 15, 23, …', '33'],
  ['1, 3, 7, 15, 31, …', '63'],
  ['20, 18, 21, 19, 22, …', '20'],
  ['2, 3, 5, 8, 12, …', '17'],
  ['1, 2, 6, 24, 120, …', '720'],
];

export const TERMAN_SERIES: SerieTerman[] = [
  {
    id: 1, title: 'Serie I — Información', formato: 'opcion', timeMinutes: 3, puntos: 1,
    desc: 'Elige la respuesta correcta de cada pregunta.',
    ejemplo: '¿Cuántas patas tiene un perro? → 4',
    questions: serieDeOpcion(S1, 101),
  },
  {
    id: 2, title: 'Serie II — Juicio', formato: 'opcion', timeMinutes: 3, puntos: 2,
    desc: 'Elige la respuesta más sensata para cada situación.',
    ejemplo: 'Si se te descompone la computadora del trabajo, lo mejor es → avisar a soporte técnico.',
    questions: serieDeOpcion(S2, 211),
  },
  {
    id: 3, title: 'Serie III — Vocabulario', formato: 'opcion', timeMinutes: 3, puntos: 1,
    desc: 'Indica si las dos palabras significan lo mismo (Igual) o lo contrario (Opuesto).',
    ejemplo: 'grande — enorme → Igual · día — noche → Opuesto',
    questions: barajar(S3, 3301).map(([a, b, r], i) =>
      fija(i + 1, `${a.toUpperCase()} — ${b.toUpperCase()}`, ['Igual', 'Opuesto'], r)
    ),
  },
  {
    id: 4, title: 'Serie IV — Selección lógica', formato: 'dos', timeMinutes: 4, puntos: 1,
    desc: 'Marca las DOS cosas que SIEMPRE tiene lo que se menciona.',
    ejemplo: 'Un perro siempre tiene: collar · corazón · pelota · dueño · patas → corazón y patas',
    questions: S4.map(([t, c1, c2, ...d], i) => {
      const mezcladas = barajar([c1, c2, ...d].map((x, k) => ({ x, correcta: k < 2 })), 401 + i * 41);
      return {
        id: i + 1,
        text: t,
        opciones: mezcladas.map((o, k) => ({ id: LETRAS[k], text: o.x })),
        clave: mezcladas.flatMap((o, k) => (o.correcta ? [LETRAS[k]] : [])),
      };
    }),
  },
  {
    id: 5, title: 'Serie V — Aritmética', formato: 'numero', timeMinutes: 6, puntos: 2,
    desc: 'Resuelve mentalmente o en papel y escribe solo el número del resultado.',
    ejemplo: 'Si un lápiz cuesta 5 pesos, ¿cuánto cuestan 3? → 15',
    questions: S5.map(([t, r], i) => ({ id: i + 1, text: t, clave: [r] })),
  },
  {
    id: 6, title: 'Serie VI — Juicio práctico', formato: 'opcion', timeMinutes: 3, puntos: 1,
    desc: 'Contesta Sí o No a cada pregunta.',
    ejemplo: '¿Conviene cruzar la calle por el paso peatonal? → Sí',
    questions: barajar(S6, 6601).map(([t, r], i) => fija(i + 1, t, ['Sí', 'No'], r)),
  },
  {
    id: 7, title: 'Serie VII — Analogías', formato: 'opcion', timeMinutes: 4, puntos: 1,
    desc: 'Elige la palabra que completa la relación.',
    ejemplo: 'DÍA es a SOL como NOCHE es a → luna',
    questions: serieDeOpcion(S7, 701),
  },
  {
    id: 8, title: 'Serie VIII — Ordenamiento de frases', formato: 'opcion', timeMinutes: 4, puntos: 1,
    desc: 'Las palabras están desordenadas. Ordénalas mentalmente y decide si la frase que forman es Verdadera o Falsa.',
    ejemplo: 'caliente · fuego · es · el → "El fuego es caliente" → Verdadera',
    questions: S8.map(([t, r], i) => fija(i + 1, t, ['Verdadera', 'Falsa'], r)),
  },
  {
    id: 9, title: 'Serie IX — Clasificación', formato: 'opcion', timeMinutes: 3, puntos: 1,
    desc: 'Elige la palabra que NO pertenece al grupo.',
    ejemplo: 'manzana · pera · silla · uva → silla',
    // S9 no trae enunciado propio: se antepone uno vacío y se usa el texto común.
    questions: serieDeOpcion(S9.map(r => ['', ...r] as [string, ...string[]]), 901, 'Elige la palabra que no pertenece al grupo:'),
  },
  {
    id: 10, title: 'Serie X — Seriación', formato: 'numero', timeMinutes: 5, puntos: 2,
    desc: 'Escribe el número que sigue en cada serie.',
    ejemplo: '1, 3, 5, 7, … → 9',
    questions: S10.map(([t, r], i) => ({ id: i + 1, text: t, clave: [r] })),
  },
];

export const TERMAN_TOTAL_REACTIVOS = TERMAN_SERIES.reduce((s, x) => s + x.questions.length, 0);

/** Solo dígitos (y signo/punto decimal): "$ 2,700" → "2700". */
export function normalizarNumero(valor: string): string {
  return valor.replace(/[^\d.-]/g, '').replace(/^0+(?=\d)/, '').replace(/\.0+$/, '');
}

export function claveRespuesta(serie: number, reactivo: number) {
  return `s${serie}_q${reactivo}`;
}

/** Puntos que vale una respuesta (0 si es incorrecta o está vacía). */
export function puntosDeRespuesta(serie: SerieTerman, r: ReactivoTerman, valor: string | undefined): number {
  if (!valor) return 0;
  if (serie.formato === 'numero') return normalizarNumero(valor) === r.clave[0] ? serie.puntos : 0;
  if (serie.formato === 'dos') {
    const marcadas = valor.split(',').filter(Boolean);
    const aciertos = marcadas.filter(m => r.clave.includes(m)).length;
    const errores = marcadas.length - aciertos;
    return Math.max(0, aciertos - errores) * serie.puntos;
  }
  return r.clave.includes(valor) ? serie.puntos : 0;
}

export function calificarTerman(answers: Record<string, string>) {
  const porSerie = TERMAN_SERIES.map(s => {
    const maximo = s.questions.length * s.puntos * (s.formato === 'dos' ? 2 : 1);
    let puntos = 0;
    let contestadas = 0;
    for (const r of s.questions) {
      const v = answers[claveRespuesta(s.id, r.id)];
      if (v) contestadas++;
      puntos += puntosDeRespuesta(s, r, v);
    }
    return { serie: s.title, puntos, maximo, contestadas, reactivos: s.questions.length, porcentaje: Math.round((puntos / maximo) * 100) };
  });
  const total = porSerie.reduce((a, s) => a + s.puntos, 0);
  const maximo = porSerie.reduce((a, s) => a + s.maximo, 0);
  return {
    nota: 'Puntos contra la clave del banco. Pesos: II, V y X valen 2 por acierto; IV vale 1 por cada opción correcta marcada (menos 1 por cada incorrecta). No es un CI: para convertir a CI hacen falta normas por edad que este banco no tiene; usa el porcentaje para comparar entre series.',
    por_serie: porSerie,
    puntos_totales: total,
    maximo_total: maximo,
    porcentaje_total: Math.round((total / maximo) * 100),
  };
}
