import Link from 'next/link';
import { CrmHeader } from '@/components/crm/CrmShell';
import { NuevoCandidatoForm } from '@/components/crm/NuevoCandidatoForm';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NuevoCandidatoPage() {
  return (
    <>
      <nav className="flex items-center gap-2 text-xs font-bold mb-6">
        <Link href="/crm/candidatos" className="text-brand-orange hover:text-orange-400 transition-colors">
          Candidatos
        </Link>
        <ChevronRight size={13} className="text-slate-700" />
        <span className="text-slate-500">Alta de candidato</span>
      </nav>

      <CrmHeader
        titulo="Alta de candidato"
        subtitulo="Registra un perfil que llegó por WhatsApp, referido o cualquier canal fuera de la web."
      />

      <div className="max-w-3xl">
        <NuevoCandidatoForm />
      </div>
    </>
  );
}
