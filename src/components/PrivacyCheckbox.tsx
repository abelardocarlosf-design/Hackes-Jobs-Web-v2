'use client';

import Link from 'next/link';

interface PrivacyCheckboxProps {
  type: 'reclutamiento' | 'contacto comercial' | 'aplicación de evaluación psicométrica';
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PrivacyCheckbox({ type, checked, onChange }: PrivacyCheckboxProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-white/10 mt-6">
      <p className="text-xs text-slate-400 leading-relaxed text-justify">
        HACKES JOBS TECHNOLOGIES tratará sus datos personales para fines de {type}. 
        Sus datos pueden ser transferidos a clientes empresariales y proveedores tecnológicos conforme a nuestro 
        <Link href="/privacidad" target="_blank" className="text-brand-orange hover:underline mx-1">
          Aviso de Privacidad Integral
        </Link>
        disponible en www.hackesjobs.com.mx/privacidad. Al enviar este formulario usted manifiesta haberlo leído y aceptado.
      </p>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            required
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer appearance-none w-5 h-5 border-2 border-slate-500 rounded-md bg-transparent checked:bg-brand-orange checked:border-brand-orange focus:ring-2 focus:ring-brand-orange/50 focus:outline-none transition-all cursor-pointer"
          />
          <svg
            className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
          </svg>
        </div>
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          He leído y acepto el Aviso de Privacidad.
        </span>
      </label>
    </div>
  );
}
