import { notFound, redirect } from 'next/navigation';
import { testsConfig } from '@/lib/psicometriasConfig';
import dynamic from 'next/dynamic';

// Carga dinámica de los componentes específicos de cada test
const LuscherTest = dynamic(() => import('@/components/psicometrias/tests/LuscherTest'), { ssr: false });
const DiscTest = dynamic(() => import('@/components/psicometrias/tests/DiscTest'), { ssr: false });
const AllportTest = dynamic(() => import('@/components/psicometrias/tests/AllportTest'), { ssr: false });
const MossTest = dynamic(() => import('@/components/psicometrias/tests/MossTest'), { ssr: false });
const ZavicTest = dynamic(() => import('@/components/psicometrias/tests/ZavicTest'), { ssr: false });
const KostickTest = dynamic(() => import('@/components/psicometrias/tests/KostickTest'), { ssr: false });
const RavenTest = dynamic(() => import('@/components/psicometrias/tests/RavenTest'), { ssr: false });
const TermanTest = dynamic(() => import('@/components/psicometrias/tests/TermanTest'), { ssr: false });
const PF16Test = dynamic(() => import('@/components/psicometrias/tests/PF16Test'), { ssr: false });
const MMPITest = dynamic(() => import('@/components/psicometrias/tests/MMPITest'), { ssr: false });

export default function AplicacionPage({ params }: { params: { slug: string } }) {
  const config = testsConfig[params.slug];

  if (!config) {
    notFound();
  }

  // Pruebas marcadas como "Próximamente" se redirigen al detalle (que muestra el banner)
  if (config.comingSoon) {
    redirect(`/psicometrias/${params.slug}`);
  }

  // Renderizado condicional según el slug
  return (
    <>
      {params.slug === 'luscher' && <LuscherTest config={config} />}
      {params.slug === 'disc' && <DiscTest config={config} />}
      {params.slug === 'allport' && <AllportTest config={config} />}
      {params.slug === 'moss' && <MossTest config={config} />}
      {params.slug === 'zavic' && <ZavicTest config={config} />}
      {params.slug === 'kostick' && <KostickTest config={config} />}
      {params.slug === 'raven' && <RavenTest config={config} />}
      {params.slug === 'terman' && <TermanTest config={config} />}
      {params.slug === '16pf' && <PF16Test config={config} />}
      {params.slug === 'mmpi' && <MMPITest config={config} />}
    </>
  );
}
