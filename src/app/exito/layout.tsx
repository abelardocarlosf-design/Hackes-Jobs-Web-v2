import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicitud recibida',
  robots: { index: false, follow: true },
};

export default function ExitoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
