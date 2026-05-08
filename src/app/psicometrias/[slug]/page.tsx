import { notFound } from 'next/navigation';
import { TestInstrucciones } from '@/components/psicometrias/TestInstrucciones';
import { testsConfig } from '@/lib/psicometriasConfig';

export default function PsicometriaPage({ params }: { params: { slug: string } }) {
  const config = testsConfig[params.slug];

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-12">
      <TestInstrucciones config={config} />
    </div>
  );
}
