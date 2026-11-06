import type { Metadata } from 'next';

// La landing es 'use client'; este layout de grupo fija su canonical y og:url
// sin heredarlos al resto del sitio.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
