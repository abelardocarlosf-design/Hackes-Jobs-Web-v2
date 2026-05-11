'use client';

import React, { useState, useEffect } from 'react';
import { TestAplicacionBase } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';

const ALLPORT_PART_1 = [
  { id: 'p1_1', question: '¿Cuál de estos dos logros te parece más importante?', options: [{ id: 'a', text: 'Descubrir una nueva teoría científica.' }, { id: 'b', text: 'Mejorar las condiciones de vida de la sociedad.' }] },
  { id: 'p1_2', question: 'Si tuvieras tiempo libre extra, preferirías:', options: [{ id: 'a', text: 'Leer libros sobre filosofía y arte.' }, { id: 'b', text: 'Participar en un proyecto comunitario.' }] },
  { id: 'p1_3', question: '¿Qué te atrae más de un trabajo?', options: [{ id: 'a', text: 'El poder e influencia que me otorga.' }, { id: 'b', text: 'El salario y los beneficios económicos.' }] },
  { id: 'p1_4', question: '¿Qué valoras más en una persona?', options: [{ id: 'a', text: 'Su devoción religiosa o espiritual.' }, { id: 'b', text: 'Su sentido del humor y practicidad.' }] },
  { id: 'p1_5', question: 'Si heredaras una gran fortuna, ¿qué harías con parte de ella?', options: [{ id: 'a', text: 'Donarla a organizaciones benéficas.' }, { id: 'b', text: 'Invertirla en negocios rentables.' }] },
  { id: 'p1_6', question: '¿Cuál de los siguientes libros preferirías leer?', options: [{ id: 'a', text: '"El origen de las especies" de Darwin.' }, { id: 'b', text: '"El arte de la guerra" de Sun Tzu.' }] },
  { id: 'p1_7', question: '¿En qué actividad preferirías pasar la tarde?', options: [{ id: 'a', text: 'Asistir a un recital de música clásica.' }, { id: 'b', text: 'Orar o meditar en silencio.' }] },
  { id: 'p1_8', question: 'Al elegir tus amistades cercanas, valoras más:', options: [{ id: 'a', text: 'Su curiosidad intelectual y capacidad analítica.' }, { id: 'b', text: 'Su generosidad y espíritu solidario.' }] },
  { id: 'p1_9', question: '¿Cuál consideras la mayor contribución que puede hacer una persona?', options: [{ id: 'a', text: 'Llevar bienestar real a quienes más lo necesitan.' }, { id: 'b', text: 'Crear una obra de arte que perdure siglos.' }] },
  { id: 'p1_10', question: 'Si pudieras elegir tu ocupación ideal, preferirías ser:', options: [{ id: 'a', text: 'Científico investigador de alto nivel.' }, { id: 'b', text: 'Líder político con influencia nacional.' }] },
  { id: 'p1_11', question: '¿Cuál de estas dos metas te parece más valiosa para la sociedad?', options: [{ id: 'a', text: 'El desarrollo tecnológico e industrial.' }, { id: 'b', text: 'El cultivo de las artes y la belleza.' }] },
  { id: 'p1_12', question: '¿Cómo prefieres invertir tu dinero?', options: [{ id: 'a', text: 'En experiencias culturales o colecciones de arte.' }, { id: 'b', text: 'En negocios o activos que generen retorno.' }] },
  { id: 'p1_13', question: '¿Cuál de estas actividades disfrutarías más?', options: [{ id: 'a', text: 'Liderar un equipo hacia una meta ambiciosa.' }, { id: 'b', text: 'Reflexionar sobre el sentido profundo de la vida.' }] },
  { id: 'p1_14', question: 'En una conversación, te interesa más hablar sobre:', options: [{ id: 'a', text: 'Descubrimientos científicos recientes.' }, { id: 'b', text: 'Iniciativas de ayuda a comunidades vulnerables.' }] },
  { id: 'p1_15', question: '¿Cuál de estas afirmaciones refleja mejor tu punto de vista?', options: [{ id: 'a', text: 'La riqueza material es un indicador claro de éxito.' }, { id: 'b', text: 'La virtud espiritual es el mayor logro humano.' }] },
  { id: 'p1_16', question: 'Al escoger una película, preferirías:', options: [{ id: 'a', text: 'Un documental sobre naturaleza, ciencia o historia.' }, { id: 'b', text: 'Un drama con impacto emocional y estético.' }] },
  { id: 'p1_17', question: '¿Cuál de estas posiciones valoras más en una organización?', options: [{ id: 'a', text: 'El director general con autoridad y visión.' }, { id: 'b', text: 'El responsable de bienestar y clima del equipo.' }] },
  { id: 'p1_18', question: '¿Qué tipo de noticias te interesa más seguir?', options: [{ id: 'a', text: 'Avances tecnológicos y descubrimientos científicos.' }, { id: 'b', text: 'Reformas económicas y tendencias de mercado.' }] },
  { id: 'p1_19', question: '¿Cuál de estas experiencias disfrutarías más?', options: [{ id: 'a', text: 'Visitar una exhibición de arte contemporáneo.' }, { id: 'b', text: 'Asistir a un retiro espiritual o de meditación.' }] },
  { id: 'p1_20', question: 'Si tuvieras que elegir un proyecto de vida, optarías por:', options: [{ id: 'a', text: 'Crear una empresa exitosa y escalable.' }, { id: 'b', text: 'Dedicarte al servicio comunitario o voluntariado.' }] },
  { id: 'p1_21', question: '¿Cuál consideras que da mayor sentido a la existencia humana?', options: [{ id: 'a', text: 'La búsqueda constante de la verdad y el conocimiento.' }, { id: 'b', text: 'La conexión con lo sagrado o trascendente.' }] },
  { id: 'p1_22', question: 'En tu tiempo libre, preferirías:', options: [{ id: 'a', text: 'Influir en decisiones políticas o sociales relevantes.' }, { id: 'b', text: 'Diseñar, pintar o crear algo estéticamente bello.' }] },
  { id: 'p1_23', question: '¿Cuál de estas dos figuras admiras más?', options: [{ id: 'a', text: 'Un filósofo que descifró misterios del cosmos.' }, { id: 'b', text: 'Un empresario que generó miles de empleos.' }] },
  { id: 'p1_24', question: '¿Cuál de los siguientes legados te parece más valioso?', options: [{ id: 'a', text: 'Haber construido hospitales y escuelas para todos.' }, { id: 'b', text: 'Haber gobernado y transformado un país entero.' }] },
  { id: 'p1_25', question: 'Cuando enfrentas una decisión difícil, ¿qué te orienta más?', options: [{ id: 'a', text: 'La lógica, los datos y el análisis objetivo.' }, { id: 'b', text: 'Tus convicciones espirituales o morales profundas.' }] },
  { id: 'p1_26', question: '¿En cuál de estas profesiones te gustaría destacar?', options: [{ id: 'a', text: 'Diseñador industrial, arquitecto o artista.' }, { id: 'b', text: 'Director de una gran corporación o empresa.' }] },
  { id: 'p1_27', question: '¿Qué te motivaría más a trabajar duro?', options: [{ id: 'a', text: 'Alcanzar reconocimiento, estatus y posición social.' }, { id: 'b', text: 'Acumular riqueza y seguridad financiera sólida.' }] },
  { id: 'p1_28', question: '¿Cuál de estas actividades te parece más significativa?', options: [{ id: 'a', text: 'Investigar los misterios del universo y la materia.' }, { id: 'b', text: 'Crear una sinfonía o una novela memorable.' }] },
  { id: 'p1_29', question: 'En la solución de problemas sociales, ¿qué crees más efectivo?', options: [{ id: 'a', text: 'Líderes fuertes con autoridad y recursos claros.' }, { id: 'b', text: 'La fe y los principios morales compartidos.' }] },
  { id: 'p1_30', question: '¿Cuál de las siguientes frases describe mejor tu ideal de vida?', options: [{ id: 'a', text: '"Conocer es poder": el saber transforma al mundo.' }, { id: 'b', text: '"Dar sin esperar nada a cambio": el servicio da sentido.' }] },
];

const ALLPORT_PART_2 = [
  { id: 'p2_1', question: 'Si tuvieras que elegir una carrera, ordena tus preferencias (1 = Mayor, 4 = Menor):', options: [{ id: 'a', text: 'Investigador Científico' }, { id: 'b', text: 'Artista o Diseñador' }, { id: 'c', text: 'Político o Líder' }, { id: 'd', text: 'Empresario' }] },
  { id: 'p2_2', question: 'Al leer un periódico, ¿qué sección buscas primero? Ordena de mayor a menor interés:', options: [{ id: 'a', text: 'Negocios y Finanzas' }, { id: 'b', text: 'Cultura y Arte' }, { id: 'c', text: 'Política Internacional' }, { id: 'd', text: 'Ciencia y Tecnología' }] },
  { id: 'p2_3', question: 'Si pudieras asistir a uno de estos eventos, ¿cuál elegirías primero? Ordénalos:', options: [{ id: 'a', text: 'Conferencia sobre economía global' }, { id: 'b', text: 'Exposición de escultura contemporánea' }, { id: 'c', text: 'Foro de liderazgo y gestión política' }, { id: 'd', text: 'Simposio de investigación científica' }] },
  { id: 'p2_4', question: 'Ordena estas metas de vida según su importancia para ti (1 = más importante):', options: [{ id: 'a', text: 'Vivir en armonía con tus creencias espirituales' }, { id: 'b', text: 'Contribuir al bienestar de tu comunidad' }, { id: 'c', text: 'Alcanzar una posición de poder e influencia' }, { id: 'd', text: 'Acumular riqueza y estabilidad económica' }] },
  { id: 'p2_5', question: '¿Cuál es la característica más valiosa en un líder? Ordena de mayor a menor:', options: [{ id: 'a', text: 'Visión estratégica y capacidad de mando' }, { id: 'b', text: 'Profundo conocimiento técnico y analítico' }, { id: 'c', text: 'Empatía y preocupación genuina por otros' }, { id: 'd', text: 'Principios morales y valores sólidos' }] },
  { id: 'p2_6', question: 'Si tuvieras un año para dedicarte a una sola actividad, ¿cuál prioritas? Ordena:', options: [{ id: 'a', text: 'Escribir una novela o componer música' }, { id: 'b', text: 'Fundar y escalar una empresa rentable' }, { id: 'c', text: 'Hacer trabajo voluntario en zonas vulnerables' }, { id: 'd', text: 'Estudiar un posgrado en ciencias puras' }] },
  { id: 'p2_7', question: '¿Qué tipo de reconocimiento valoras más? Ordena de mayor a menor:', options: [{ id: 'a', text: 'Ser reconocido por tu generosidad y altruismo' }, { id: 'b', text: 'Ser reconocido por tu inteligencia e innovación' }, { id: 'c', text: 'Ser reconocido por tu éxito económico' }, { id: 'd', text: 'Ser reconocido por tu devoción y fe' }] },
  { id: 'p2_8', question: 'Ordena estas fuentes de satisfacción personal (1 = más satisfactoria para ti):', options: [{ id: 'a', text: 'Lograr una posición de autoridad en mi campo' }, { id: 'b', text: 'Crear algo hermoso que otros disfruten' }, { id: 'c', text: 'Entender cómo funciona el mundo a profundidad' }, { id: 'd', text: 'Ayudar a quien más lo necesita en este momento' }] },
  { id: 'p2_9', question: '¿Qué factores pesan más al elegir dónde vivir? Ordena de mayor a menor prioridad:', options: [{ id: 'a', text: 'Acceso a centros culturales y museos de calidad' }, { id: 'b', text: 'Oportunidades de negocio e inversión accesibles' }, { id: 'c', text: 'Comunidades religiosas activas y valores compartidos' }, { id: 'd', text: 'Entornos académicos y de investigación de punta' }] },
  { id: 'p2_10', question: 'Si pudieras influir en la política de un país, ¿qué priorizarías? Ordena:', options: [{ id: 'a', text: 'Fomento de las artes y la cultura nacional' }, { id: 'b', text: 'Inversión en ciencia, educación y tecnología' }, { id: 'c', text: 'Programas robustos de asistencia social' }, { id: 'd', text: 'Crecimiento económico, empleo y exportaciones' }] },
  { id: 'p2_11', question: '¿Cuál de estos libros leerías primero? Ordena según tu preferencia:', options: [{ id: 'a', text: 'Biografía de un gran emprendedor o empresario' }, { id: 'b', text: 'Ensayo filosófico sobre la existencia y el ser' }, { id: 'c', text: 'Libro de espiritualidad, meditación o fe' }, { id: 'd', text: 'Historia de superación comunitaria o voluntariado' }] },
  { id: 'p2_12', question: '¿Cuál de estos proyectos te gustaría liderar? Ordena de mayor a menor interés:', options: [{ id: 'a', text: 'Construir un espacio espiritual o templo comunitario' }, { id: 'b', text: 'Ganar una elección y dirigir una ciudad importante' }, { id: 'c', text: 'Abrir una galería de arte contemporáneo internacional' }, { id: 'd', text: 'Lanzar una startup tecnológica de alto impacto' }] },
  { id: 'p2_13', question: 'Ordena estos valores según su importancia para ti en el trabajo:', options: [{ id: 'a', text: 'Creatividad e innovación estética en los entregables' }, { id: 'b', text: 'Eficiencia, rentabilidad y resultados medibles' }, { id: 'c', text: 'Justicia, equidad social e impacto en la comunidad' }, { id: 'd', text: 'Rigor intelectual, precisión y análisis profundo' }] },
  { id: 'p2_14', question: 'Si pudieras conversar con una de estas figuras históricas, ¿con cuál primero? Ordena:', options: [{ id: 'a', text: 'Albert Einstein' }, { id: 'b', text: 'Mahatma Gandhi' }, { id: 'c', text: 'Leonardo da Vinci' }, { id: 'd', text: 'Alejandro Magno' }] },
  { id: 'p2_15', question: '¿Cuál de estas frases resuena más con tu visión del éxito? Ordena de mayor a menor:', options: [{ id: 'a', text: '"Vivir bien es ganar bien": el éxito es prosperidad' }, { id: 'b', text: '"El arte es la más alta forma de esperanza"' }, { id: 'c', text: '"El poder real sirve cuando sirve al pueblo"' }, { id: 'd', text: '"La verdad te hará libre": el saber lo es todo' }] },
];

export default function AllportTest({ config }: { config: TestInfoProps }) {
  const [answersPart1, setAnswersPart1] = useState<Record<string, string>>({});
  const [answersPart2, setAnswersPart2] = useState<Record<string, string[]>>({});
  const [currentStep, setCurrentStep] = useState(0); // 0 a 44 (30 + 15)
  const [isSaving, setIsSaving] = useState(false);

  const totalQuestions = ALLPORT_PART_1.length + ALLPORT_PART_2.length;
  const answeredCount = Object.keys(answersPart1).length + Object.keys(answersPart2).filter(k => answersPart2[k].length === 4).length;

  useEffect(() => {
    const saved = localStorage.getItem(`hj_test_${config.slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswersPart1(parsed.answersPart1 || {});
        setAnswersPart2(parsed.answersPart2 || {});
        setCurrentStep(parsed.currentStep || 0);
      } catch (e) {}
    }
  }, [config.slug]);

  const saveState = (p1: any, p2: any, step: number) => {
    setIsSaving(true);
    localStorage.setItem(`hj_test_${config.slug}`, JSON.stringify({ answersPart1: p1, answersPart2: p2, currentStep: step }));
    setTimeout(() => setIsSaving(false), 500);
  };

  const isPart1 = currentStep < ALLPORT_PART_1.length;
  const currentQuestionPart1 = isPart1 ? ALLPORT_PART_1[currentStep] : null;
  const currentQuestionPart2 = !isPart1 ? ALLPORT_PART_2[currentStep - ALLPORT_PART_1.length] : null;

  const handleSelectPart1 = (optionId: string) => {
    if (!currentQuestionPart1) return;
    const newAnswers = { ...answersPart1, [currentQuestionPart1.id]: optionId };
    setAnswersPart1(newAnswers);
    saveState(newAnswers, answersPart2, currentStep);
    
    // Auto-advance
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(s => s + 1);
        saveState(newAnswers, answersPart2, currentStep + 1);
      }
    }, 400);
  };

  const handleSelectPart2 = (optionId: string) => {
    if (!currentQuestionPart2) return;
    const qId = currentQuestionPart2.id;
    const currentAns = answersPart2[qId] || [];
    
    if (currentAns.includes(optionId)) {
      // Toggle off
      const newAnsArray = currentAns.filter(id => id !== optionId);
      const newAnswers = { ...answersPart2, [qId]: newAnsArray };
      setAnswersPart2(newAnswers);
      saveState(answersPart1, newAnswers, currentStep);
    } else if (currentAns.length < 4) {
      // Toggle on
      const newAnsArray = [...currentAns, optionId];
      const newAnswers = { ...answersPart2, [qId]: newAnsArray };
      setAnswersPart2(newAnswers);
      saveState(answersPart1, newAnswers, currentStep);
    }
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(s => s + 1);
      saveState(answersPart1, answersPart2, currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      saveState(answersPart1, answersPart2, currentStep - 1);
    }
  };

  const handleFinalSubmit = () => {
    // Flatten para que sea JSON clave-valor estricto
    const flatAnswers: Record<string, string> = { ...answersPart1 };
    
    Object.keys(answersPart2).forEach(qId => {
      // En parte 2 el valor guardado es un array de IDs ordenados: ej ['a', 'c', 'b', 'd']
      // donde el índice 0 es el de mayor preferencia (1) y el índice 3 es el menor (4).
      // Lo enviamos como un string unido por comas.
      flatAnswers[qId] = answersPart2[qId].join(',');
    });

    return flatAnswers;
  };

  const renderPart1 = () => {
    if (!currentQuestionPart1) return null;
    return (
      <div className="space-y-4 animate-in fade-in">
        <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug mb-8">
          {currentQuestionPart1.question}
        </h2>
        {currentQuestionPart1.options.map((opt) => {
          const isSelected = answersPart1[currentQuestionPart1.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectPart1(opt.id)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected ? 'border-brand-orange bg-brand-orange/10 text-white shadow-lg' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-orange' : 'border-slate-500'}`}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-brand-orange" />}
                </div>
                <span className="text-lg">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderPart2 = () => {
    if (!currentQuestionPart2) return null;
    const qId = currentQuestionPart2.id;
    const currentAns = answersPart2[qId] || [];
    
    return (
      <div className="space-y-4 animate-in fade-in">
        <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug mb-4">
          {currentQuestionPart2.question}
        </h2>
        <p className="text-brand-orange mb-8 text-sm uppercase tracking-widest font-bold">
          Selecciona las opciones en orden de preferencia (1 = Mayor, 4 = Menor)
        </p>
        <div className="space-y-3">
          {currentQuestionPart2.options.map((opt) => {
            const index = currentAns.indexOf(opt.id);
            const isSelected = index !== -1;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectPart2(opt.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${isSelected ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${isSelected ? 'bg-emerald-500 text-white' : 'bg-black/50 text-slate-500 border border-white/10'}`}>
                  {isSelected ? index + 1 : '-'}
                </div>
                <span className="text-lg flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={totalQuestions}
      answeredQuestions={answeredCount}
      onFinalSubmit={handleFinalSubmit}
      isSaving={isSaving}
    >
      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden mt-6">
        <div className="p-8 sm:p-12">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-4 uppercase tracking-widest">
              Parte {isPart1 ? '1' : '2'} - Pregunta {currentStep + 1} de {totalQuestions}
            </span>
          </div>

          <div className="min-h-[300px]">
            {isPart1 ? renderPart1() : renderPart2()}
          </div>

          <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
            <Button 
              variant="secondary" 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              className={`h-14 px-6 uppercase tracking-widest ${currentStep === 0 ? 'invisible' : 'bg-transparent border border-white/20'}`}
            >
              ← Anterior
            </Button>

            {!isPart1 && (
              <Button 
                variant="primary"
                onClick={handleNext} 
                disabled={!!(currentQuestionPart2 && (answersPart2[currentQuestionPart2.id]?.length !== 4))}
                className={`h-14 px-10 rounded-xl uppercase tracking-widest ${currentStep === totalQuestions - 1 ? 'hidden' : ''}`}
              >
                Siguiente →
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
