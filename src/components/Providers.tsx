'use client';

import { AuthProvider } from '@/lib/auth-context';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  // Obtenemos el client ID del env, si no está ponemos uno vacío para que no rompa en build
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
