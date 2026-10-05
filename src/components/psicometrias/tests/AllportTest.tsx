'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { TestAplicacionBase, irAlPanelDeEnvio } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { useAvancePrueba } from '@/lib/psicometrias/progreso';

const VERSION_BANCO = 'allport-2026-10';

/** T Teórico · E Económico · A Estético · S Social · P Político · R Religioso */
type Valor = 'T' | 'E' | 'A' | 'S' | 'P' | 'R';
const VALORES: Record<Valor, string> = {
  T: 'Teórico', E: 'Económico', A: 'Estético', S: 'Social', P: 'Político', R: 'Religioso',
};

interface Opcion { id: string; text: string; valor: Valor }
interface Reactivo { id: string; question: string; options: Opcion[] }

const o = (id: string, valor: Valor, text: string): Opcion => ({ id, valor, text });

// Parte 1: elección forzada entre dos valores. Cada una de las 15 parejas de
// valores aparece exactamente dos veces, así cada valor se presenta 10 veces.
const ALLPORT_PART_1: Reactivo[] = [
  { id: 'p1_1', question: '¿Cuál de estos dos logros te parece más importante?', options: [o('a', 'T', 'Descubrir una nueva teoría científica.'), o('b', 'S', 'Mejorar las condiciones de vida de la sociedad.')] },
  { id: 'p1_2', question: 'Si tuvieras tiempo libre extra, preferirías:', options: [o('a', 'A', 'Visitar museos, galerías o conciertos.'), o('b', 'S', 'Participar en un proyecto comunitario.')] },
  { id: 'p1_3', question: '¿Qué te atrae más de un trabajo?', options: [o('a', 'P', 'El poder e influencia que me otorga.'), o('b', 'E', 'El salario y los beneficios económicos.')] },
  { id: 'p1_4', question: '¿Qué valoras más en una persona?', options: [o('a', 'R', 'Su vida espiritual y la coherencia con su fe.'), o('b', 'E', 'Su habilidad práctica para generar recursos.')] },
  { id: 'p1_5', question: 'Si heredaras una gran fortuna, ¿qué harías con buena parte de ella?', options: [o('a', 'S', 'Donarla a organizaciones que ayudan a otros.'), o('b', 'E', 'Invertirla en negocios rentables.')] },
  { id: 'p1_6', question: '¿Cuál de los siguientes libros preferirías leer?', options: [o('a', 'T', '"El origen de las especies" de Darwin.'), o('b', 'P', '"El arte de la guerra" de Sun Tzu.')] },
  { id: 'p1_7', question: '¿En qué actividad preferirías pasar la tarde?', options: [o('a', 'A', 'Asistir a un recital de música clásica.'), o('b', 'R', 'Orar o meditar en silencio.')] },
  { id: 'p1_8', question: 'Al elegir tus amistades cercanas, valoras más:', options: [o('a', 'T', 'Su curiosidad intelectual y capacidad analítica.'), o('b', 'S', 'Su generosidad y espíritu solidario.')] },
  { id: 'p1_9', question: '¿Cuál consideras la mayor contribución que puede hacer una persona?', options: [o('a', 'S', 'Llevar bienestar real a quienes más lo necesitan.'), o('b', 'A', 'Crear una obra de arte que perdure siglos.')] },
  { id: 'p1_10', question: 'Si pudieras elegir tu ocupación ideal, preferirías ser:', options: [o('a', 'T', 'Científico investigador de alto nivel.'), o('b', 'P', 'Líder político con influencia nacional.')] },
  { id: 'p1_11', question: '¿Cuál de estas dos metas te parece más valiosa para la sociedad?', options: [o('a', 'E', 'El desarrollo económico e industrial.'), o('b', 'A', 'El cultivo de las artes y la belleza.')] },
  { id: 'p1_12', question: '¿Cómo prefieres usar tus ahorros?', options: [o('a', 'A', 'En experiencias culturales u obras de arte.'), o('b', 'E', 'En negocios o activos que generen rendimiento.')] },
  { id: 'p1_13', question: '¿Cuál de estas actividades disfrutarías más?', options: [o('a', 'P', 'Liderar un equipo hacia una meta ambiciosa.'), o('b', 'R', 'Reflexionar sobre el sentido espiritual de la vida.')] },
  { id: 'p1_14', question: 'En una conversación, te interesa más hablar sobre:', options: [o('a', 'T', 'Descubrimientos científicos recientes.'), o('b', 'R', 'Temas de fe y espiritualidad.')] },
  { id: 'p1_15', question: '¿Cuál de estas afirmaciones refleja mejor tu punto de vista?', options: [o('a', 'E', 'La prosperidad material es una señal clara de éxito.'), o('b', 'R', 'La vida espiritual es el mayor logro humano.')] },
  { id: 'p1_16', question: 'Al escoger una película, preferirías:', options: [o('a', 'T', 'Un documental sobre ciencia o historia.'), o('b', 'A', 'Una película visualmente bella y con gran música.')] },
  { id: 'p1_17', question: '¿Cuál de estos puestos valoras más en una organización?', options: [o('a', 'P', 'El director general, con autoridad y visión.'), o('b', 'S', 'El responsable del bienestar del personal.')] },
  { id: 'p1_18', question: '¿Qué tipo de noticias te interesa más seguir?', options: [o('a', 'T', 'Avances científicos y descubrimientos.'), o('b', 'E', 'Economía, inversiones y tendencias de mercado.')] },
  { id: 'p1_19', question: '¿Cuál de estas experiencias disfrutarías más?', options: [o('a', 'A', 'Visitar una exhibición de arte contemporáneo.'), o('b', 'R', 'Asistir a un retiro espiritual.')] },
  { id: 'p1_20', question: 'Si tuvieras que elegir un proyecto de vida, optarías por:', options: [o('a', 'E', 'Crear una empresa exitosa y rentable.'), o('b', 'S', 'Dedicarte al servicio comunitario.')] },
  { id: 'p1_21', question: '¿Qué crees que da mayor sentido a la existencia humana?', options: [o('a', 'T', 'La búsqueda de la verdad y el conocimiento.'), o('b', 'R', 'La conexión con lo sagrado o trascendente.')] },
  { id: 'p1_22', question: 'En tu tiempo libre, preferirías:', options: [o('a', 'P', 'Influir en decisiones públicas o de tu comunidad.'), o('b', 'A', 'Diseñar, pintar o crear algo bello.')] },
  { id: 'p1_23', question: '¿A cuál de estas dos figuras admiras más?', options: [o('a', 'T', 'Un pensador que explicó cómo funciona el universo.'), o('b', 'E', 'Un empresario que generó miles de empleos.')] },
  { id: 'p1_24', question: '¿Cuál de estos legados te parece más valioso?', options: [o('a', 'S', 'Haber construido hospitales y escuelas para todos.'), o('b', 'P', 'Haber gobernado y transformado un país entero.')] },
  { id: 'p1_25', question: 'Cuando enfrentas una decisión difícil, ¿qué te orienta más?', options: [o('a', 'S', 'Lo que más beneficie a las personas involucradas.'), o('b', 'R', 'Tus convicciones espirituales.')] },
  { id: 'p1_26', question: '¿En cuál de estas profesiones te gustaría destacar?', options: [o('a', 'A', 'Diseñador, arquitecto o artista.'), o('b', 'P', 'Director con mando sobre una gran organización.')] },
  { id: 'p1_27', question: '¿Qué te motivaría más a trabajar duro?', options: [o('a', 'P', 'Alcanzar reconocimiento, estatus y posición.'), o('b', 'E', 'Lograr riqueza y seguridad financiera.')] },
  { id: 'p1_28', question: '¿Cuál de estas actividades te parece más significativa?', options: [o('a', 'T', 'Investigar los misterios del universo y la materia.'), o('b', 'A', 'Componer una sinfonía o escribir una novela.')] },
  { id: 'p1_29', question: 'Para resolver los problemas sociales, ¿qué crees más efectivo?', options: [o('a', 'P', 'Líderes fuertes con autoridad y recursos.'), o('b', 'R', 'La fe y los principios espirituales compartidos.')] },
  { id: 'p1_30', question: '¿Cuál de estas frases describe mejor tu ideal de vida?', options: [o('a', 'R', '"La fe da sentido a todo lo demás."'), o('b', 'S', '"Dar sin esperar nada a cambio."')] },
];

// Parte 2: ordenar 4 opciones de mayor (1) a menor (4) preferencia.
const ALLPORT_PART_2: Reactivo[] = [
  { id: 'p2_1', question: 'Si tuvieras que elegir una carrera, ordena tus preferencias:', options: [o('a', 'T', 'Investigador científico'), o('b', 'A', 'Artista o diseñador'), o('c', 'P', 'Político o líder'), o('d', 'E', 'Empresario')] },
  { id: 'p2_2', question: 'Al leer un periódico, ¿qué sección buscas primero? Ordena de mayor a menor interés:', options: [o('a', 'E', 'Negocios y finanzas'), o('b', 'A', 'Cultura y arte'), o('c', 'P', 'Política'), o('d', 'T', 'Ciencia y tecnología')] },
  { id: 'p2_3', question: 'Si pudieras asistir a uno de estos eventos, ¿cuál elegirías primero? Ordénalos:', options: [o('a', 'E', 'Conferencia sobre economía global'), o('b', 'A', 'Exposición de escultura contemporánea'), o('c', 'P', 'Foro de liderazgo y gestión pública'), o('d', 'R', 'Encuentro de reflexión espiritual')] },
  { id: 'p2_4', question: 'Ordena estas metas de vida según su importancia para ti:', options: [o('a', 'R', 'Vivir en armonía con mis creencias espirituales'), o('b', 'S', 'Contribuir al bienestar de mi comunidad'), o('c', 'P', 'Alcanzar una posición de poder e influencia'), o('d', 'E', 'Lograr riqueza y estabilidad económica')] },
  { id: 'p2_5', question: '¿Cuál es la característica más valiosa en un líder? Ordena de mayor a menor:', options: [o('a', 'P', 'Visión estratégica y capacidad de mando'), o('b', 'T', 'Conocimiento técnico y analítico profundo'), o('c', 'S', 'Empatía y preocupación genuina por otros'), o('d', 'R', 'Una fe sólida que guíe sus decisiones')] },
  { id: 'p2_6', question: 'Si tuvieras un año para dedicarte a una sola actividad, ¿cuál priorizarías? Ordena:', options: [o('a', 'A', 'Escribir una novela o componer música'), o('b', 'E', 'Fundar y hacer crecer una empresa rentable'), o('c', 'S', 'Hacer voluntariado en zonas vulnerables'), o('d', 'T', 'Estudiar un posgrado en ciencias')] },
  { id: 'p2_7', question: '¿Qué tipo de reconocimiento valoras más? Ordena de mayor a menor:', options: [o('a', 'S', 'Por mi generosidad y servicio a los demás'), o('b', 'T', 'Por mi inteligencia y mis ideas'), o('c', 'E', 'Por mi éxito económico'), o('d', 'R', 'Por mi devoción y mi fe')] },
  { id: 'p2_8', question: 'Ordena estas fuentes de satisfacción personal (1 = la que más te satisface):', options: [o('a', 'P', 'Lograr una posición de autoridad en mi campo'), o('b', 'A', 'Crear algo hermoso que otros disfruten'), o('c', 'R', 'Vivir de acuerdo con mi fe'), o('d', 'S', 'Ayudar a quien más lo necesita')] },
  { id: 'p2_9', question: '¿Qué factores pesan más al elegir dónde vivir? Ordena de mayor a menor prioridad:', options: [o('a', 'A', 'Acceso a museos y centros culturales'), o('b', 'P', 'Poder participar en las decisiones de la ciudad'), o('c', 'R', 'Una comunidad religiosa activa'), o('d', 'T', 'Universidades y centros de investigación')] },
  { id: 'p2_10', question: 'Si pudieras influir en la política de un país, ¿qué priorizarías? Ordena:', options: [o('a', 'A', 'Fomento de las artes y la cultura'), o('b', 'R', 'Respeto a la libertad religiosa y a los valores espirituales'), o('c', 'S', 'Programas sólidos de asistencia social'), o('d', 'E', 'Crecimiento económico y empleo')] },
  { id: 'p2_11', question: '¿Cuál de estos libros leerías primero? Ordena según tu preferencia:', options: [o('a', 'E', 'Biografía de un gran empresario'), o('b', 'T', 'Ensayo de filosofía o ciencia'), o('c', 'R', 'Libro de espiritualidad o fe'), o('d', 'S', 'Historia de una comunidad que salió adelante')] },
  { id: 'p2_12', question: '¿Cuál de estos proyectos te gustaría liderar? Ordena de mayor a menor interés:', options: [o('a', 'R', 'Construir un espacio espiritual para la comunidad'), o('b', 'P', 'Ganar una elección y dirigir una ciudad'), o('c', 'A', 'Abrir una galería de arte internacional'), o('d', 'E', 'Lanzar una empresa de alto crecimiento')] },
  { id: 'p2_13', question: 'Ordena estos valores según su importancia para ti en el trabajo:', options: [o('a', 'A', 'Creatividad y cuidado estético del resultado'), o('b', 'E', 'Eficiencia, rentabilidad y resultados medibles'), o('c', 'S', 'Justicia e impacto positivo en las personas'), o('d', 'T', 'Rigor intelectual y análisis profundo')] },
  { id: 'p2_14', question: 'Si pudieras conversar con una de estas figuras históricas, ¿con cuál primero? Ordena:', options: [o('a', 'T', 'Albert Einstein'), o('b', 'S', 'Madre Teresa de Calcuta'), o('c', 'A', 'Leonardo da Vinci'), o('d', 'P', 'Alejandro Magno')] },
  { id: 'p2_15', question: '¿Cuál de estas frases resuena más con tu visión del éxito? Ordena de mayor a menor:', options: [o('a', 'E', '"El éxito es la prosperidad."'), o('b', 'A', '"El éxito es crear algo bello."'), o('c', 'P', '"El éxito es dirigir y decidir."'), o('d', 'T', '"El éxito es comprender."')] },
];

const PUNTOS_RANGO = [4, 3, 2, 1]; // 1.º lugar = 4 puntos … 4.º lugar = 1 punto
const TOTAL = ALLPORT_PART_1.length + ALLPORT_PART_2.length;

interface Avance {
  answersPart1: Record<string, string>;
  answersPart2: Record<string, string[]>;
  currentStep: number;
}

const AVANCE_INICIAL = (): Avance => ({ answersPart1: {}, answersPart2: {}, currentStep: 0 });

function calificar(p1: Record<string, string>, p2: Record<string, string[]>) {
  const claves = Object.keys(VALORES) as Valor[];
  const puntos = Object.fromEntries(claves.map(v => [v, 0])) as Record<Valor, number>;
  const maximo = { ...puntos };

  for (const r of ALLPORT_PART_1) {
    r.options.forEach(op => { maximo[op.valor] += 1; });
    const elegida = r.options.find(op => op.id === p1[r.id]);
    if (elegida) puntos[elegida.valor] += 1;
  }
  for (const r of ALLPORT_PART_2) {
    r.options.forEach(op => { maximo[op.valor] += PUNTOS_RANGO[0]; });
    (p2[r.id] || []).forEach((id, lugar) => {
      const op = r.options.find(x => x.id === id);
      if (op) puntos[op.valor] += PUNTOS_RANGO[lugar] ?? 0;
    });
  }

  const porValor = Object.fromEntries(
    claves.map(v => [VALORES[v], { puntos: puntos[v], maximo: maximo[v], indice: Math.round((puntos[v] / maximo[v]) * 100) }])
  );
  const jerarquia = claves
    .map(v => ({ valor: VALORES[v], indice: porValor[VALORES[v]].indice }))
    .sort((a, b) => b.indice - a.indice)
    .map(x => x.valor);

  return {
    nota: 'Parte 1: 1 punto al valor elegido. Parte 2: 4/3/2/1 puntos según el lugar. Índice = puntos / máximo posible × 100; compara valores aunque aparezcan un número distinto de veces.',
    por_valor: porValor,
    jerarquia,
  };
}

export default function AllportTest({ config }: { config: TestInfoProps }) {
  const { estado, setEstado, listo, reanudado, guardando, reiniciar } =
    useAvancePrueba<Avance>(config.slug, VERSION_BANCO, AVANCE_INICIAL);
  const autoAvance = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { answersPart1, answersPart2 } = estado;
  const currentStep = Math.min(Math.max(0, estado.currentStep), TOTAL - 1);
  const isPart1 = currentStep < ALLPORT_PART_1.length;
  const reactivo = isPart1 ? ALLPORT_PART_1[currentStep] : ALLPORT_PART_2[currentStep - ALLPORT_PART_1.length];
  const respondido = (r: Reactivo) =>
    r.id.startsWith('p1_') ? !!answersPart1[r.id] : (answersPart2[r.id]?.length ?? 0) === 4;
  const todos = [...ALLPORT_PART_1, ...ALLPORT_PART_2];
  const answeredCount = todos.filter(respondido).length;

  useEffect(() => () => {
    if (autoAvance.current) clearTimeout(autoAvance.current);
  }, []);

  const irA = (paso: number) => {
    if (autoAvance.current) clearTimeout(autoAvance.current);
    setEstado(prev => ({ ...prev, currentStep: Math.min(Math.max(0, paso), TOTAL - 1) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPart1 = (optionId: string) => {
    const paso = currentStep;
    setEstado(prev => ({ ...prev, answersPart1: { ...prev.answersPart1, [reactivo.id]: optionId } }));
    if (autoAvance.current) clearTimeout(autoAvance.current);
    autoAvance.current = setTimeout(() => {
      setEstado(prev => (prev.currentStep === paso ? { ...prev, currentStep: paso + 1 } : prev));
    }, 350);
  };

  const handleSelectPart2 = (optionId: string) => {
    setEstado(prev => {
      const actual = prev.answersPart2[reactivo.id] || [];
      const siguiente = actual.includes(optionId)
        ? actual.filter(id => id !== optionId) // quitar y recorrer el orden
        : actual.length < 4 ? [...actual, optionId] : actual;
      return { ...prev, answersPart2: { ...prev.answersPart2, [reactivo.id]: siguiente } };
    });
  };

  const limpiarOrden = () =>
    setEstado(prev => ({ ...prev, answersPart2: { ...prev.answersPart2, [reactivo.id]: [] } }));

  const pendientes = useMemo(
    () =>
      todos
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => !respondido(r))
        .map(({ i }) => ({ clave: String(i), etiqueta: String(i + 1), onIr: () => irA(i) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answersPart1, answersPart2]
  );

  const handleFinalSubmit = () => {
    const detalle: Record<string, string> = {};
    for (const r of ALLPORT_PART_1) {
      const op = r.options.find(x => x.id === answersPart1[r.id]);
      if (op) detalle[r.id] = `${r.question} → ${op.text} [${VALORES[op.valor]}]`;
    }
    for (const r of ALLPORT_PART_2) {
      const orden = (answersPart2[r.id] || []).map(id => r.options.find(x => x.id === id)).filter(Boolean) as Opcion[];
      if (orden.length) detalle[r.id] = `${r.question} → ${orden.map((op, i) => `${i + 1}. ${op.text} [${VALORES[op.valor]}]`).join(' · ')}`;
    }
    return {
      formato: 'v2',
      puntajes: calificar(answersPart1, answersPart2),
      detalle,
      // Formato anterior (p1_1: "a", p2_1: "c,a,d,b") por compatibilidad.
      ...answersPart1,
      ...Object.fromEntries(Object.entries(answersPart2).map(([k, v]) => [k, v.join(',')])),
    };
  };

  if (!listo || !reactivo) return null;

  const esUltima = currentStep === TOTAL - 1;
  const ordenActual = answersPart2[reactivo.id] || [];

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={TOTAL}
      answeredQuestions={answeredCount}
      onFinalSubmit={handleFinalSubmit}
      isSaving={guardando}
      reanudado={reanudado}
      onReiniciar={reiniciar}
      pendientes={pendientes}
    >
      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-6 sm:p-12">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg uppercase tracking-widest">
              Parte {isPart1 ? '1' : '2'} · Pregunta {currentStep + 1} de {TOTAL}
            </span>
          </div>

          <div key={reactivo.id} className="min-h-[300px]">
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-4">
              {reactivo.question}
            </h2>

            {isPart1 ? (
              <div className="space-y-4 mt-8">
                {reactivo.options.map(opt => {
                  const isSelected = answersPart1[reactivo.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectPart1(opt.id)}
                      className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 transition-colors duration-200 ${isSelected ? 'border-brand-orange bg-brand-orange/10 text-white shadow-lg' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-brand-orange' : 'border-slate-500'}`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-brand-orange" />}
                        </div>
                        <span className="text-lg">{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                  <p className="text-brand-orange text-sm font-bold">
                    Toca las opciones en orden: la primera que toques será tu 1.º lugar (la que más prefieres) y la última, el 4.º.
                  </p>
                  {ordenActual.length > 0 && (
                    <button type="button" onClick={limpiarOrden} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white">
                      Reiniciar orden
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {reactivo.options.map(opt => {
                    const index = ordenActual.indexOf(opt.id);
                    const isSelected = index !== -1;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectPart2(opt.id)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-colors duration-200 flex items-center gap-4 ${isSelected ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black shrink-0 ${isSelected ? 'bg-emerald-500 text-white' : 'bg-black/50 text-slate-500 border border-white/10'}`}>
                          {isSelected ? index + 1 : '–'}
                        </div>
                        <span className="text-lg flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-8 mt-8 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => irA(currentStep - 1)}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              ← Anterior
            </Button>

            {esUltima ? (
              <Button variant="primary" onClick={irAlPanelDeEnvio}>
                Revisar y enviar ↓
              </Button>
            ) : (
              <Button variant="primary" onClick={() => irA(currentStep + 1)} disabled={!respondido(reactivo)}>
                Siguiente →
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
