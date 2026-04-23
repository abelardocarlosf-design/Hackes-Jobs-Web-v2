export type DiscType = 'D' | 'I' | 'S' | 'C';

export interface Option {
  text: string;
  type: DiscType;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
}

export const discQuestions: Question[] = [
  {
    id: 1,
    question: "En una reunión de equipo, tu rol principal suele ser:",
    options: [
      { text: "Tomar el control y dirigir la agenda hacia resultados concretos.", type: "D" },
      { text: "Animar al grupo y asegurar que todos participen con entusiasmo.", type: "I" },
      { text: "Escuchar atentamente y apoyar las decisiones consensuadas del equipo.", type: "S" },
      { text: "Analizar los datos presentados y asegurar la precisión técnica.", type: "C" }
    ]
  },
  {
    id: 2,
    question: "Ante un problema inesperado en un proyecto, tu primera reacción es:",
    options: [
      { text: "Tomar decisiones rápidas y actuar inmediatamente para resolverlo.", type: "D" },
      { text: "Reunir al equipo para hacer una lluvia de ideas creativa.", type: "I" },
      { text: "Mantener la calma y buscar un enfoque paso a paso.", type: "S" },
      { text: "Investigar las causas raíz antes de proponer cualquier solución.", type: "C" }
    ]
  },
  {
    id: 3,
    question: "Al comunicarte con tus compañeros de trabajo, prefieres:",
    options: [
      { text: "Ser directo, breve y al grano.", type: "D" },
      { text: "Ser expresivo, amigable y conversacional.", type: "I" },
      { text: "Ser cálido, paciente y mostrar interés genuino por ellos.", type: "S" },
      { text: "Ser preciso, lógico y basarte en hechos o documentos.", type: "C" }
    ]
  },
  {
    id: 4,
    question: "¿Qué ambiente de trabajo te resulta más motivador?",
    options: [
      { text: "Un entorno competitivo, dinámico y lleno de retos.", type: "D" },
      { text: "Un entorno interactivo, social y con reconocimiento público.", type: "I" },
      { text: "Un entorno estable, armonioso y predecible.", type: "S" },
      { text: "Un entorno estructurado, ordenado y con reglas claras.", type: "C" }
    ]
  },
  {
    id: 5,
    question: "Al enfrentar un conflicto con un colega, tiendes a:",
    options: [
      { text: "Confrontarlo directamente para resolver el problema de inmediato.", type: "D" },
      { text: "Usar tu persuasión para suavizar la situación y llegar a un acuerdo verbal.", type: "I" },
      { text: "Evitar la confrontación directa para mantener la paz en la oficina.", type: "S" },
      { text: "Referirte a las políticas de la empresa o a los hechos objetivos.", type: "C" }
    ]
  },
  {
    id: 6,
    question: "Cuando se implementa un gran cambio en la empresa, tú:",
    options: [
      { text: "Lo impulsas si crees que mejorará los resultados.", type: "D" },
      { text: "Te entusiasmas y convences a otros de los aspectos positivos.", type: "I" },
      { text: "Te sientes incómodo al principio y necesitas tiempo para adaptarte.", type: "S" },
      { text: "Cuestionas la lógica del cambio y pides pruebas de que funcionará.", type: "C" }
    ]
  },
  {
    id: 7,
    question: "Si tuvieras que delegar una tarea, te enfocarías en:",
    options: [
      { text: "El resultado final; no te importa mucho cómo lo hagan mientras se logre.", type: "D" },
      { text: "Explicar la visión general y motivar a la persona para que lo haga.", type: "I" },
      { text: "Dar apoyo continuo y asegurar que se sientan cómodos con la tarea.", type: "S" },
      { text: "Proveer instrucciones detalladas, estándares de calidad y manuales.", type: "C" }
    ]
  },
  {
    id: 8,
    question: "Lo que más te molesta en el trabajo es:",
    options: [
      { text: "La indecisión, la lentitud y la falta de resultados.", type: "D" },
      { text: "La rutina, el aislamiento y la falta de reconocimiento.", type: "I" },
      { text: "La inestabilidad, los cambios bruscos y la agresividad.", type: "S" },
      { text: "La falta de lógica, el desorden y los errores por descuido.", type: "C" }
    ]
  },
  {
    id: 9,
    question: "Tus compañeros de trabajo te describirían principalmente como:",
    options: [
      { text: "Decidido, competitivo y orientado a la acción.", type: "D" },
      { text: "Sociable, entusiasta y persuasivo.", type: "I" },
      { text: "Paciente, leal y buen oyente.", type: "S" },
      { text: "Analítico, detallista y perfeccionista.", type: "C" }
    ]
  },
  {
    id: 10,
    question: "Cuando tomas una decisión importante, te basas en:",
    options: [
      { text: "Tu instinto y la necesidad de actuar rápidamente.", type: "D" },
      { text: "Cómo afectará la moral del equipo y qué pensarán los demás.", type: "I" },
      { text: "El consenso del equipo y la experiencia pasada.", type: "S" },
      { text: "Datos, métricas, pros, contras y análisis profundo.", type: "C" }
    ]
  },
  {
    id: 11,
    question: "Frente a una fecha límite muy ajustada, tú:",
    options: [
      { text: "Tomas el mando, exiges resultados y trabajas bajo presión sin problema.", type: "D" },
      { text: "Mantienes el ánimo alto y buscas formas creativas de terminar a tiempo.", type: "I" },
      { text: "Trabajas de manera constante, metódica y prefieres que no te apresuren.", type: "S" },
      { text: "Te estresas si la prisa compromete la calidad o salta los procedimientos.", type: "C" }
    ]
  },
  {
    id: 12,
    question: "En un proyecto a largo plazo, tu mayor fortaleza es:",
    options: [
      { text: "Mantener el impulso y empujar los bloqueos del camino.", type: "D" },
      { text: "Mantener al equipo inspirado y vender la idea a otros departamentos.", type: "I" },
      { text: "Ser constante, confiable y hacer el trabajo de fondo sin quejarte.", type: "S" },
      { text: "Asegurar que cada etapa cumpla con los estándares más altos de calidad.", type: "C" }
    ]
  },
  {
    id: 13,
    question: "Para ti, el éxito profesional significa:",
    options: [
      { text: "Alcanzar el poder, lograr metas difíciles y vencer a la competencia.", type: "D" },
      { text: "Tener prestigio, popularidad y una amplia red de contactos.", type: "I" },
      { text: "Lograr seguridad, armonía y ser apreciado genuinamente por el equipo.", type: "S" },
      { text: "Ser reconocido como un experto absoluto en tu área.", type: "C" }
    ]
  },
  {
    id: 14,
    question: "Cuando explicas un concepto nuevo a alguien, sueles:",
    options: [
      { text: "Dar solo el resumen ejecutivo y lo que necesitan hacer.", type: "D" },
      { text: "Usar historias, anécdotas y un tono muy dinámico.", type: "I" },
      { text: "Explicarlo con paciencia, paso a paso, comprobando si entienden.", type: "S" },
      { text: "Proporcionar todos los detalles técnicos, gráficos y documentación.", type: "C" }
    ]
  },
  {
    id: 15,
    question: "Tu mayor miedo en el entorno laboral es:",
    options: [
      { text: "Perder el control o ser visto como vulnerable.", type: "D" },
      { text: "El rechazo social o perder influencia sobre los demás.", type: "I" },
      { text: "La pérdida de seguridad o enfrentarse a cambios súbitos.", type: "S" },
      { text: "Que se critique tu trabajo o equivocarte públicamente.", type: "C" }
    ]
  },
  {
    id: 16,
    question: "Al recibir retroalimentación (feedback) crítica:",
    options: [
      { text: "Te pones a la defensiva o la usas como un reto para mejorar rápidamente.", type: "D" },
      { text: "Lo tomas muy a pecho personal y buscas reafirmación inmediata.", type: "I" },
      { text: "Lo aceptas calladamente pero puede que te sientas herido en silencio.", type: "S" },
      { text: "Pides ejemplos concretos, datos y analizas si la crítica es lógicamente válida.", type: "C" }
    ]
  },
  {
    id: 17,
    question: "En situaciones de crisis, tú aportas:",
    options: [
      { text: "Dirección clara y acción inmediata.", type: "D" },
      { text: "Optimismo y capacidad para aliviar la tensión.", type: "I" },
      { text: "Calma, estabilidad y apoyo emocional.", type: "S" },
      { text: "Perspectiva objetiva y soluciones racionales.", type: "C" }
    ]
  },
  {
    id: 18,
    question: "Prefieres ser evaluado por:",
    options: [
      { text: "Los resultados finales y objetivos alcanzados.", type: "D" },
      { text: "Tus contribuciones creativas y tu habilidad para interactuar.", type: "I" },
      { text: "Tu lealtad, tu consistencia y cómo ayudas al equipo.", type: "S" },
      { text: "La exactitud, calidad técnica y el rigor de tu trabajo.", type: "C" }
    ]
  },
  {
    id: 19,
    question: "Tu espacio de trabajo o escritorio suele ser:",
    options: [
      { text: "Funcional; solo lo necesario para ser productivo, a menudo con proyectos amontonados.", type: "D" },
      { text: "Desordenado, colorido, con fotos y recuerdos personales.", type: "I" },
      { text: "Acogedor, organizado y con toques personales amigables.", type: "S" },
      { text: "Impecable, muy organizado, con sistemas de archivo claros.", type: "C" }
    ]
  },
  {
    id: 20,
    question: "Al planificar tu semana laboral:",
    options: [
      { text: "Haces una lista de los grandes objetivos a vencer.", type: "D" },
      { text: "Tu agenda es flexible; prefieres ver qué reuniones o eventos surgen.", type: "I" },
      { text: "Te gusta tener una rutina clara y predecible de lunes a viernes.", type: "S" },
      { text: "Planificas cada bloque de tiempo al detalle para maximizar la eficiencia.", type: "C" }
    ]
  },
  {
    id: 21,
    question: "En una negociación con un cliente difícil, tú:",
    options: [
      { text: "Presionas firmemente para obtener las mejores condiciones posibles.", type: "D" },
      { text: "Intentas ganarte su simpatía y buscar una conexión personal.", type: "I" },
      { text: "Buscas un compromiso pacífico donde ambas partes estén cómodas.", type: "S" },
      { text: "Le presentas datos, cláusulas y lógica irrefutable para convencerlo.", type: "C" }
    ]
  },
  {
    id: 22,
    question: "Si alguien de tu equipo comete un error, sueles:",
    options: [
      { text: "Señalarlo rápidamente para que no afecte el resultado.", type: "D" },
      { text: "Quitarle importancia para que la persona no se sienta mal.", type: "I" },
      { text: "Ayudarle a corregirlo en privado de forma empática.", type: "S" },
      { text: "Revisar por qué falló el proceso y cómo evitarlo en el futuro.", type: "C" }
    ]
  },
  {
    id: 23,
    question: "Lo que más te enorgullece en tu carrera es:",
    options: [
      { text: "Los obstáculos que superaste y las metas agresivas que lograste.", type: "D" },
      { text: "Las relaciones que construiste y las ideas innovadoras que propusiste.", type: "I" },
      { text: "El apoyo que diste a tu equipo durante años y tu confiabilidad.", type: "S" },
      { text: "La calidad impecable de tu trabajo y tu experiencia técnica.", type: "C" }
    ]
  },
  {
    id: 24,
    question: "Bajo mucho estrés, es probable que te vuelvas:",
    options: [
      { text: "Autoritario, exigente e impaciente.", type: "D" },
      { text: "Desorganizado, emocional y hablador en exceso.", type: "I" },
      { text: "Inseguro, excesivamente complaciente y resistente a actuar.", type: "S" },
      { text: "Aislado, crítico y paralizado por el análisis.", type: "C" }
    ]
  },
  {
    id: 25,
    question: "Cuando lideras un equipo, tu estilo es:",
    options: [
      { text: "Directivo: marcas el rumbo y esperas que te sigan sin dudar.", type: "D" },
      { text: "Carismático: inspiras con una visión y mucha energía.", type: "I" },
      { text: "Participativo: creas consensos y te aseguras de que todos estén bien.", type: "S" },
      { text: "Estructurado: defines reglas claras, procesos y estándares de calidad.", type: "C" }
    ]
  },
  {
    id: 26,
    question: "En una sesión de capacitación técnica, prefieres:",
    options: [
      { text: "Que vayan al grano rápido; solo quieres saber cómo te sirve esto.", type: "D" },
      { text: "Dinámicas de grupo interactivo y participación.", type: "I" },
      { text: "Tener tiempo suficiente para practicar sin sentirte presionado.", type: "S" },
      { text: "Material detallado, manuales escritos y un instructor experto que responda dudas técnicas.", type: "C" }
    ]
  },
  {
    id: 27,
    question: "Lo que más valoras en un colega es:",
    options: [
      { text: "Su capacidad de dar resultados rápidos y eficaces.", type: "D" },
      { text: "Su sentido del humor y actitud positiva.", type: "I" },
      { text: "Su lealtad, disposición a ayudar y sinceridad.", type: "S" },
      { text: "Su nivel de conocimiento, precisión y orden.", type: "C" }
    ]
  },
  {
    id: 28,
    question: "Cuando lees un correo electrónico largo:",
    options: [
      { text: "Lees solo la primera línea y vas directo a lo que te piden.", type: "D" },
      { text: "Lees por encima y respondes rápidamente o prefieres hacer una llamada.", type: "I" },
      { text: "Lo lees con calma y preparas una respuesta amable.", type: "S" },
      { text: "Lo lees detalladamente, analizas los datos y respondes punto por punto.", type: "C" }
    ]
  },
  {
    id: 29,
    question: "Tu ritmo de trabajo ideal es:",
    options: [
      { text: "Acelerado, siempre moviéndote a la siguiente meta.", type: "D" },
      { text: "Dinámico, con interacciones constantes y tareas variadas.", type: "I" },
      { text: "Relajado pero constante, prefieres hacer una cosa a la vez.", type: "S" },
      { text: "Metódico, pausado y con tiempo para revisar cada detalle.", type: "C" }
    ]
  },
  {
    id: 30,
    question: "La frase que mejor te define es:",
    options: [
      { text: "Vamos a hacerlo rápido y a mi manera.", type: "D" },
      { text: "Vamos a hacerlo juntos y que sea divertido.", type: "I" },
      { text: "Vamos a hacerlo sin presiones y ayudándonos.", type: "S" },
      { text: "Vamos a hacerlo de la manera correcta y sin errores.", type: "C" }
    ]
  }
];
