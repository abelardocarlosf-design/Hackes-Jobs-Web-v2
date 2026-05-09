import { ChoiceQuestion } from '@/components/psicometrias/tests/GenericChoiceTest';

export const getMossQuestions = (): ChoiceQuestion[] => {
  const questions: ChoiceQuestion[] = [
    { id: 'm_1', question: 'Situación 1: Usted es el gerente de un departamento y nota que la moral del equipo está baja debido a exceso de trabajo. ¿Qué haría usted?', options: [{ id: 'a', text: 'Convocar una junta para escuchar quejas y reasignar tareas.' }, { id: 'b', text: 'Ofrecer bonos económicos a quienes trabajen horas extra.' }, { id: 'c', text: 'Ignorar la situación asumiendo que es temporal.' }, { id: 'd', text: 'Contratar más personal temporal de inmediato.' }] },
    { id: 'm_2', question: 'Situación 2: Dos de sus mejores empleados tienen un conflicto personal que afecta su rendimiento. ¿Cómo procede?', options: [{ id: 'a', text: 'Hablar con cada uno por separado para entender el problema.' }, { id: 'b', text: 'Reunirlos a ambos y exigirles que actúen como profesionales.' }, { id: 'c', text: 'Separarlos de proyecto para que no interactúen.' }, { id: 'd', text: 'Advertirles que si no se arreglan, habrá sanciones.' }] },
    { id: 'm_3', question: 'Situación 3: Un cliente clave está furioso por un retraso en la entrega. Usted debe:', options: [{ id: 'a', text: 'Culpar al departamento de envíos.' }, { id: 'b', text: 'Asumir la responsabilidad y ofrecer un descuento.' }, { id: 'c', text: 'Prometer que no volverá a ocurrir y pedir disculpas.' }, { id: 'd', text: 'Evitar sus llamadas hasta tener el producto listo.' }] }
  ];

  for (let i = 4; i <= 30; i++) {
    questions.push({
      id: `m_${i}`,
      question: `Situación Moss ${i}: Se presenta un desafío gerencial inesperado. ¿Cuál es su curso de acción más probable?`,
      options: [
        { id: 'a', text: 'Delegar la responsabilidad a un subordinado competente.' },
        { id: 'b', text: 'Tomar control total de la situación personalmente.' },
        { id: 'c', text: 'Consultar el manual de procedimientos de la empresa.' },
        { id: 'd', text: 'Pedir consejo a colegas de otras áreas.' }
      ]
    });
  }

  return questions;
};
