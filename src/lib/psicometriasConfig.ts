export interface TestInfoProps {
  slug: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  nivel: string;
  precio: number;
  precioFormateado: string;
  categoria: string;
  instrucciones: string[];
  comingSoon?: boolean;
}

export const testsConfig: Record<string, TestInfoProps> = {
  luscher: {
    slug: 'luscher',
    nombre: 'Test de Colores de Lüscher',
    descripcion: 'Evaluación proyectiva que revela tu estado emocional, nivel de ansiedad y capacidad de adaptación mediante la elección de colores.',
    duracion: '5 min',
    nivel: 'Básico',
    precio: 0,
    precioFormateado: 'Gratis',
    categoria: 'Proyectivo',
    instrucciones: [
      'Se te presentarán 8 tarjetas de colores diferentes.',
      'Toca primero el color que más te agrade en este momento, luego el que más te agrade de los que quedan, y así hasta terminar.',
      'Después repetirás el ejercicio con los colores en otro orden. No intentes recordar tu primera elección.',
      'Trata de no relacionar los colores con objetos o ropa, elige instintivamente.'
    ]
  },
  disc: {
    slug: 'disc',
    nombre: 'Perfil DISC (Cleaver)',
    descripcion: 'Descubre tu estilo de comportamiento en el trabajo: cómo respondes a desafíos, te relacionas con otros, tu ritmo de trabajo y cumplimiento de normas.',
    duracion: '15 min',
    nivel: 'Básico',
    precio: 0,
    precioFormateado: 'Gratis',
    categoria: 'Comportamiento',
    instrucciones: [
      'Encontrarás 30 grupos de 4 frases.',
      'En cada grupo, marca la frase que MÁS te describe (+) y la que MENOS te describe (−).',
      'No hay respuestas correctas o incorrectas. Sé sincero(a) para obtener un resultado preciso.',
      'Responde pensando en tu entorno laboral o académico habitual.'
    ]
  },
  allport: {
    slug: 'allport',
    nombre: 'Test de Valores de Allport',
    descripcion: 'Mide el peso relativo de 6 valores fundamentales: Teórico, Económico, Estético, Social, Político y Religioso.',
    duracion: '20 min',
    nivel: 'Básico',
    precio: 0,
    precioFormateado: 'Gratis',
    categoria: 'Valores',
    instrucciones: [
      'El test consta de 45 preguntas divididas en dos partes.',
      'En la primera parte, deberás elegir entre dos alternativas la que más se acerque a tu forma de pensar.',
      'En la segunda parte, deberás ordenar 4 opciones según tu preferencia: toca primero la que más prefieres y al final la que menos.',
      'No hay respuestas buenas ni malas, responde con total sinceridad.'
    ]
  },
  moss: {
    slug: 'moss',
    nombre: 'Test de Habilidades Gerenciales (Moss)',
    descripcion: 'Evalúa la capacidad de supervisión, sentido común y habilidades para tomar decisiones en situaciones laborales.',
    duracion: '30 min',
    nivel: 'Intermedio',
    precio: 349,
    precioFormateado: '$349 MXN',
    categoria: 'Habilidades Gerenciales',
    instrucciones: [
      'Se te presentarán 30 situaciones de trabajo con 4 posibles respuestas.',
      'Para cada situación, elige la opción que consideres más adecuada para resolver el problema.',
      'Responde pensando en tu experiencia o en cómo actuarías en un rol de liderazgo.'
    ]
  },
  zavic: {
    slug: 'zavic',
    nombre: 'Test de Valores e Intereses (Zavic)',
    descripcion: 'Mide valores (moral, legalidad, indiferencia, corrupción) e intereses (económico, político, social, religioso).',
    duracion: '20 min',
    nivel: 'Intermedio',
    precio: 349,
    precioFormateado: '$349 MXN',
    categoria: 'Valores y Ética',
    instrucciones: [
      'El cuestionario consta de 60 casos con 4 opciones cada uno.',
      'Lee cada caso y elige la opción que mejor represente lo que tú harías o preferirías.',
      'Asegúrate de responder todas las preguntas.'
    ]
  },
  kostick: {
    slug: 'kostick',
    nombre: 'Inventario de Percepción y Preferencias (Kostick)',
    descripcion: 'Analiza 20 factores del comportamiento laboral agrupados en 7 áreas: dirección del trabajo, liderazgo, ritmo, naturaleza social, estilo de trabajo, temperamento y subordinación.',
    duracion: '30 min',
    nivel: 'Intermedio',
    precio: 349,
    precioFormateado: '$349 MXN',
    categoria: 'Personalidad Laboral',
    instrucciones: [
      'Encontrarás 90 pares de frases.',
      'Deberás elegir siempre una de las dos opciones (A o B), aquella que mejor te describa.',
      'A veces puede parecer que ninguna te describe bien o que ambas lo hacen, pero DEBES elegir una obligatoriamente.'
    ]
  },
  raven: {
    slug: 'raven',
    nombre: 'Test de Matrices Progresivas (Raven)',
    descripcion: 'Mide tu capacidad de razonamiento lógico, inteligencia no verbal y deducción visual.',
    duracion: '45 min',
    nivel: 'Avanzado',
    precio: 519,
    precioFormateado: '$519 MXN',
    categoria: 'Inteligencia General',
    comingSoon: true,
    instrucciones: [
      'Esta prueba tiene un límite de tiempo estricto de 45 minutos. El cronómetro no se puede pausar.',
      'Se te presentarán 60 figuras con una parte faltante.',
      'Deberás seleccionar de entre las opciones disponibles cuál es la pieza que completa lógicamente el patrón.',
      'La dificultad aumenta progresivamente. Si no sabes una respuesta, intenta deducirla o avanza a la siguiente.'
    ]
  },
  terman: {
    slug: 'terman',
    nombre: 'Test de Inteligencia de Terman-Merrill',
    descripcion: 'Evaluación integral que mide habilidades verbales, lógicas, matemáticas y espaciales para calcular un coeficiente intelectual (CI).',
    duracion: '40 min',
    nivel: 'Avanzado',
    precio: 519,
    precioFormateado: '$519 MXN',
    categoria: 'Inteligencia Integral',
    instrucciones: [
      'La evaluación tiene 10 series (179 reactivos) con un tiempo total de 38 minutos.',
      'Antes de cada serie verás sus instrucciones y un ejemplo; el cronómetro de la serie (de 3 a 6 minutos) arranca cuando presionas "Comenzar".',
      'Al agotarse el tiempo la serie se cierra sola y pasas a la siguiente; no podrás regresar. Es normal no alcanzar a contestar todo.',
      'Ten a la mano papel y lápiz para las series de aritmética, y busca un lugar sin distracciones.'
    ]
  },
  '16pf': {
    slug: '16pf',
    nombre: 'Cuestionario de 16 Factores de Personalidad (16 PF)',
    descripcion: 'Evaluación exhaustiva de la estructura de la personalidad en 16 factores primarios y 5 dimensiones globales.',
    duracion: '60 min',
    nivel: 'Premium',
    precio: 867,
    precioFormateado: '$867 MXN',
    categoria: 'Personalidad Profunda',
    instrucciones: [
      'El cuestionario consta de 185 reactivos: la mayoría son afirmaciones sobre tu forma de ser y 15 son problemas breves de razonamiento.',
      'En las afirmaciones responde Verdadero, No estoy seguro o Falso. Usa "No estoy seguro" solo cuando de verdad no puedas decidir.',
      'Responde rápidamente, lo primero que te venga a la mente suele ser lo más preciso.'
    ]
  },
  mmpi: {
    slug: 'mmpi',
    nombre: 'Inventario Multifásico de Personalidad (MMPI-2)',
    descripcion: 'Evaluación clínica avanzada de la personalidad y psicopatología, diseñada para detectar patrones psicológicos profundos.',
    duracion: '90 - 120 min',
    nivel: 'Premium',
    precio: 867,
    precioFormateado: '$867 MXN',
    categoria: 'Clínica',
    instrucciones: [
      'Se te presentarán 567 afirmaciones distintas.',
      'Deberás responder "Verdadero" si la afirmación se aplica a ti en general, o "Falso" si no se aplica.',
      'Es un test extenso, tómate tu tiempo y busca un espacio tranquilo. El sistema guardará tu progreso si necesitas descansar.',
      'Nota: El reporte clínico completo de esta evaluación solo estará visible para los psicólogos certificados de nuestra plataforma o de la empresa reclutadora.'
    ]
  }
};

// NOTA (auditoría 2026-05-15): el mapa de URLs de webhook se movió a
// `src/lib/psicometriasServer.ts` para mantenerlo server-only y permitir
// configurar la base vía `N8N_BASE_URL`. Antes vivía aquí (`webhookUrlMap`)
// con 5 paths desincronizados respecto a los workflows reales.

// Helper for grouping tests by level
export const testsByLevel = {
  basico: [testsConfig.disc, testsConfig.allport, testsConfig.luscher],
  intermedio: [testsConfig.moss, testsConfig.zavic, testsConfig.kostick],
  avanzado: [testsConfig.raven, testsConfig.terman],
  premium: [testsConfig['16pf'], testsConfig.mmpi]
};
