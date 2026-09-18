'use client';

import { GoogleLogin } from '@react-oauth/google';

/**
 * Botón de Google que simplemente no existe cuando no hay Client ID.
 *
 * Es una referencia literal a process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID a
 * propósito: Next la sustituye por su valor en tiempo de build, así que tiene
 * que aparecer escrita tal cual, no a través de una variable intermedia.
 */
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

interface Props {
  onSuccess: (credentialResponse: { credential?: string }) => void;
  onError: () => void;
}

export function BotonGoogle({ onSuccess, onError }: Props) {
  if (!CLIENT_ID) return null;

  return (
    <>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
          theme="filled_black"
          size="large"
          width="100%"
          text="continue_with"
          shape="pill"
        />
      </div>

      {/* El separador se va con el botón: sin Google no hay nada que separar. */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
          <span className="px-6 bg-transparent text-slate-500">O ingresa con email</span>
        </div>
      </div>
    </>
  );
}
