import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Para candidatos · Empleo industrial con proceso transparente',
  description:
    'Aplica a vacantes en empresas industriales del corredor Toluca–Lerma–Metepec–CDMX. Evaluaciones con scoring objetivo y feedback estructurado, no decisiones a ciegas.',
  alternates: { canonical: '/candidatos' },
};

export default function CandidatosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
