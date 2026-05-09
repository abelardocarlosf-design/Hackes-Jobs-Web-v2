import { ChoiceQuestion } from '@/components/psicometrias/tests/GenericChoiceTest';

export const getRavenQuestions = (): ChoiceQuestion[] => {
  const questions: ChoiceQuestion[] = [
    { 
      id: 'raven_1', 
      question: 'Matriz progresiva 1: Elige la pieza que completa el patrón visual.', 
      imageUrl: '/images/raven/matriz_1.jpg',
      options: [
        { id: '1', text: 'Pieza 1' }, { id: '2', text: 'Pieza 2' }, { id: '3', text: 'Pieza 3' },
        { id: '4', text: 'Pieza 4' }, { id: '5', text: 'Pieza 5' }, { id: '6', text: 'Pieza 6' }
      ] 
    },
    { 
      id: 'raven_2', 
      question: 'Matriz progresiva 2: Identifica la figura faltante en la secuencia.', 
      imageUrl: '/images/raven/matriz_2.jpg',
      options: [
        { id: '1', text: 'Pieza 1' }, { id: '2', text: 'Pieza 2' }, { id: '3', text: 'Pieza 3' },
        { id: '4', text: 'Pieza 4' }, { id: '5', text: 'Pieza 5' }, { id: '6', text: 'Pieza 6' }
      ] 
    }
  ];

  for (let i = 3; i <= 60; i++) {
    questions.push({
      id: `raven_${i}`,
      question: `Matriz progresiva ${i}: Elige la pieza correcta para completar el diseño.`,
      imageUrl: `/images/raven/matriz_${i}.jpg`,
      options: [
        { id: '1', text: 'Pieza 1' },
        { id: '2', text: 'Pieza 2' },
        { id: '3', text: 'Pieza 3' },
        { id: '4', text: 'Pieza 4' },
        { id: '5', text: 'Pieza 5' },
        { id: '6', text: 'Pieza 6' }
      ]
    });
  }

  return questions;
};
