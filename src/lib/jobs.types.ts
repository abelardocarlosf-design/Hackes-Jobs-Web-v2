export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Presencial' | 'Remoto' | 'Híbrido';
  description: string;
  requirements: string[];
  date: string;
  active: boolean;
  category: string;
}
