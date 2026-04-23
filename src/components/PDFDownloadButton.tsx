"use client";

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DISCPdfDocument from './DISCPdfDocument';

interface PDFDownloadButtonProps {
  data: {
    D: number;
    I: number;
    S: number;
    C: number;
    analysis: string;
    userName?: string;
    date: string;
  };
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <PDFDownloadLink
      document={<DISCPdfDocument data={data} />}
      fileName={`Resultado_DISC_${data.userName || 'Usuario'}.pdf`}
      className="bg-secondary hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 flex items-center gap-2"
    >
      {({ loading }) => (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {loading ? 'Preparando PDF...' : 'Descargar PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
