import { ChoiceQuestion } from '@/components/psicometrias/tests/GenericChoiceTest';

export const getPF16Questions = (): ChoiceQuestion[] => {
  const questions: ChoiceQuestion[] = [
    { id: 'pf_1', question: 'En una fiesta con mucha gente que no conozco:', options: [{ id: 'a', text: 'Me siento cómodo y empiezo a conversar.' }, { id: 'b', text: 'No estoy seguro (Intermedio).' }, { id: 'c', text: 'Prefiero mantenerme al margen u observar.' }] },
    { id: 'pf_2', question: 'Cuando alguien no está de acuerdo conmigo en una discusión:', options: [{ id: 'a', text: 'Me altero un poco e intento convencerle.' }, { id: 'b', text: 'Depende de la situación.' }, { id: 'c', text: 'Escucho sus argumentos calmadamente.' }] },
    { id: 'pf_3', question: 'Prefiero leer libros o ver documentales sobre:', options: [{ id: 'a', text: 'Historia o hechos reales.' }, { id: 'b', text: 'Ambos por igual.' }, { id: 'c', text: 'Ciencia ficción o temas abstractos.' }] }
  ];

  for (let i = 4; i <= 185; i++) {
    questions.push({
      id: `pf_${i}`,
      question: `Pregunta de 16PF número ${i}: Indica qué comportamiento describe mejor tu forma habitual de actuar.`,
      options: [
        { id: 'a', text: 'Totalmente de acuerdo.' },
        { id: 'b', text: 'No estoy seguro / Intermedio.' },
        { id: 'c', text: 'Totalmente en desacuerdo.' }
      ]
    });
  }

  return questions;
};
