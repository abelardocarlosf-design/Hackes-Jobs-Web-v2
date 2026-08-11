import Link from 'next/link';
import { CrmHeader } from '@/components/crm/CrmShell';
import { CargaMasiva } from '@/components/crm/CargaMasiva';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CargaMasivaPage() {
  return (
    <>
      <nav className="flex items-center gap-2 text-xs font-bold mb-6">
        <Link href="/crm/candidatos" className="text-brand-orange hover:text-orange-400 transition-colors">
          Candidatos
        </Link>
        <ChevronRight size={13} className="text-slate-700" />
        <span className="text-slate-500">Carga masiva</span>
      </nav>

      <CrmHeader
        titulo="Carga masiva de CVs"
        subtitulo="Sube varios curriculums de una vez y completa las fichas después."
      />

      <div className="max-w-3xl">
        <CargaMasiva />
      </div>
    </>
  );
}
