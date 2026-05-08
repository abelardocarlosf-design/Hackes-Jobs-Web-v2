import React from 'react';

export default function PsicometriaLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      {children}
    </>
  );
}
