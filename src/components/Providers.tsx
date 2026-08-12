'use client';

import { AuthProvider } from '@/lib/auth-context';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  // OJO: process.env.NEXT_PUBLIC_* se inlinea en tiempo de BUILD. Poner la
  // variable en Vercel no surte efecto hasta que se redespliegue.
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {/* Solo montamos el proveedor de Google si hay Client ID. Antes se le
          pasaba clientId="" y Google Identity Services no puede inicializarse
          con eso: el botón salía roto y One Tap llenaba la consola de errores. */}
      {clientId ? (
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>{children}</AuthProvider>
        </GoogleOAuthProvider>
      ) : (
        <AuthProvider>{children}</AuthProvider>
      )}
    </ThemeProvider>
  );
}
