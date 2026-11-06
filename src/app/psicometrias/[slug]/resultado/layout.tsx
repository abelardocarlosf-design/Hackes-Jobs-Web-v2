import type { Metadata } from 'next';

// Paso interno de la prueba: no debe indexarse.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
