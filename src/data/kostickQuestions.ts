import { ChoiceQuestion } from '@/components/psicometrias/tests/GenericChoiceTest';

export const getKostickQuestions = (): ChoiceQuestion[] => {
  const questions: ChoiceQuestion[] = [
    { id: 'k_1', question: 'Situación 1: En tu ambiente de trabajo, prefieres...', options: [{ id: 'a', text: 'Ser el líder que toma las decisiones difíciles.' }, { id: 'b', text: 'Ser un miembro del equipo que aporta ideas creativas.' }] },
    { id: 'k_2', question: 'Situación 2: Cuando enfrentas un problema complejo...', options: [{ id: 'a', text: 'Analizo meticulosamente todos los detalles antes de actuar.' }, { id: 'b', text: 'Confío en mi intuición y actúo rápidamente.' }] },
    { id: 'k_3', question: 'Situación 3: ¿Qué te motiva más?', options: [{ id: 'a', text: 'El reconocimiento público de mis logros.' }, { id: 'b', text: 'La satisfacción personal de un trabajo bien hecho.' }] },
    { id: 'k_4', question: 'Situación 4: En una discusión grupal...', options: [{ id: 'a', text: 'Defiendo mi punto de vista enérgicamente.' }, { id: 'b', text: 'Busco un consenso y evito el conflicto.' }] },
    { id: 'k_5', question: 'Situación 5: Respecto a las reglas de la empresa...', options: [{ id: 'a', text: 'Las sigo al pie de la letra sin cuestionarlas.' }, { id: 'b', text: 'Las adapto si encuentro una forma más eficiente.' }] },
  ];

  for (let i = 6; i <= 90; i++) {
    questions.push({
      id: `k_${i}`,
      question: `Situación Kostick ${i}: Elige la afirmación con la que más te identifiques en tu vida laboral.`,
      options: [
        { id: 'a', text: 'Prefiero tener todo bajo control y planificado.' },
        { id: 'b', text: 'Me adapto fácilmente a los cambios imprevistos.' }
      ]
    });
  }

  return questions;
};
