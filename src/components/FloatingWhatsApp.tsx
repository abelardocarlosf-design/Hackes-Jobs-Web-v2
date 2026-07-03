'use client';

import { waUrl } from '@/lib/contact';

/**
 * Botón flotante global de WhatsApp — visible en todas las páginas públicas
 * (LayoutChrome lo excluye de login/register/dashboard). Verde WhatsApp
 * estándar para reconocimiento inmediato, sobre el fondo oscuro de la marca.
 */
export function FloatingWhatsApp() {
  const handleClick = () => {
    // Registrar conversión en backend (analytics/dashboard)
    fetch('/api/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'whatsapp_click', source: 'floating_button', label: 'Cotizar por WhatsApp' })
    }).catch(e => console.error(e));
  };

  return (
    <a
      href={waUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Cotizar una vacante por WhatsApp"
      className="fixed bottom-6 right-6 z-[90] group flex items-center gap-3"
    >
      <span className="hidden sm:block max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[220px] group-hover:opacity-100 group-hover:pr-1 transition-all duration-300 text-[11px] font-black uppercase tracking-widest text-white bg-[#0A0A0A]/90 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-md">
        Cotizar por WhatsApp
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,0.45)] ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-110 active:scale-95">
        {/* Ícono oficial de WhatsApp (glyph) */}
        <svg viewBox="0 0 32 32" width="28" height="28" fill="#0A0A0A" aria-hidden="true">
          <path d="M16.004 4.667c-6.253 0-11.337 5.084-11.337 11.337 0 1.999.523 3.951 1.517 5.671L4.667 27.333l5.792-1.486a11.28 11.28 0 0 0 5.541 1.447h.005c6.252 0 11.336-5.084 11.336-11.337 0-3.028-1.179-5.875-3.32-8.016a11.27 11.27 0 0 0-8.017-3.274zm0 20.72h-.004a9.4 9.4 0 0 1-4.792-1.312l-.344-.204-3.437.882.918-3.353-.224-.344a9.386 9.386 0 0 1-1.443-5.048c0-5.199 4.231-9.43 9.43-9.43 2.519 0 4.885.982 6.665 2.763a9.37 9.37 0 0 1 2.76 6.671c-.003 5.199-4.233 9.375-9.529 9.375zm5.174-7.058c-.283-.142-1.676-.827-1.936-.921-.26-.095-.449-.142-.638.141-.189.284-.732.921-.898 1.11-.165.19-.33.213-.614.071-.283-.142-1.196-.441-2.278-1.406-.842-.751-1.41-1.678-1.576-1.961-.165-.284-.018-.437.124-.578.128-.127.284-.331.426-.497.142-.165.189-.284.284-.473.094-.189.047-.355-.024-.497-.071-.142-.638-1.537-.874-2.105-.23-.552-.464-.477-.638-.486l-.543-.01c-.189 0-.497.071-.757.355-.26.284-.992.969-.992 2.364s1.016 2.742 1.157 2.932c.142.189 1.999 3.052 4.844 4.28.677.293 1.205.467 1.617.598.68.216 1.298.185 1.787.112.545-.081 1.676-.685 1.912-1.347.236-.662.236-1.229.165-1.347-.07-.118-.26-.189-.543-.331z" />
        </svg>
      </span>
    </a>
  );
}
