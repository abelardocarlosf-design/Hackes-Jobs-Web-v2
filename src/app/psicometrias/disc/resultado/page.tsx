"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
// import PDFDownloadButton from '@/components/PDFDownloadButton';
import { Illustration } from '@/components/Illustration';

const PDFDownloadButton = dynamic(() => import('@/components/PDFDownloadButton'), { 
  ssr: false,
  loading: () => <div className="h-12 w-32 bg-slate-200 animate-pulse rounded-xl"></div>
});

function ResultsContent() {
  const searchParams = useSearchParams();
  const D = parseInt(searchParams.get('D') || '0', 10);
  const I = parseInt(searchParams.get('I') || '0', 10);
  const S = parseInt(searchParams.get('S') || '0', 10);
  const C = parseInt(searchParams.get('C') || '0', 10);

  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch('/api/disc/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ D, I, S, C })
        });

        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        if (data.success) {
          setAnalysisText(data.analysis);
        } else {
          throw new Error('Analysis unsuccessful');
        }
      } catch (error) {
        console.error("Failed to fetch analysis", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (D + I + S + C > 0) {
      fetchAnalysis();
    } else {
      setIsLoading(false);
    }
  }, [D, I, S, C]);

  const scores = [
    { type: 'Dominancia (D)', val: D, color: 'bg-brand-orange', desc: 'Orientado a resultados, directo, competitivo.' },
    { type: 'Influencia (I)', val: I, color: 'bg-brand-blue', desc: 'Sociable, comunicativo, entusiasta.' },
    { type: 'Estabilidad (S)', val: S, color: 'bg-brand-blue', desc: 'Paciente, confiable, jugador de equipo.' },
    { type: 'Cumplimiento (C)', val: C, color: 'bg-brand-blue', desc: 'Analítico, preciso, estructurado.' }
  ];

  const sorted = [...scores].sort((a, b) => b.val - a.val);
  const primary = sorted[0];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header with mini illustration */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-brand-black p-8 rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 md:w-2/3 text-left">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 uppercase leading-none">Resultados <br /> <span className="text-brand-orange">Psicométricos</span></h1>
          <p className="text-slate-400 font-medium">Análisis profundo del perfil conductual basado en metodología DISC.</p>
        </div>
        <div className="md:w-1/3 flex justify-center relative z-10">
          <Illustration
            src="/images/dashboard-illustration.png"
            alt="Dashboard de resultados"
            width={200}
            height={150}
            className="w-40 border-white/5"
          />
        </div>
      </div>

      {/* Name Input Section */}
      <Card className="border-none shadow-xl rounded-[2rem] bg-white">
        <CardContent className="p-8">
          <label className="block text-sm font-black text-brand-black mb-4 uppercase tracking-widest">Ingresa tu nombre para el reporte:</label>
          <input
            type="text"
            placeholder="Ej. Juan Pérez"
            className="w-full p-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-black"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Main Results Display */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 p-8 sm:p-16 text-center">
        <div className="w-24 h-24 bg-brand-orange/10 text-brand-orange rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-3 shadow-lg shadow-brand-orange/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-brand-black mb-6 tracking-tighter uppercase">Tu Perfil <br /> <span className="text-brand-blue">Psicométrico</span></h2>
        <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
          Basado en tus respuestas, tu estilo de comportamiento predominante es <span className="text-brand-orange font-black italic underline decoration-brand-blue decoration-4 underline-offset-8 uppercase">{primary.type.split(' ')[0]}</span>.
        </p>

        {/* Result Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 text-left">
          {scores.map((s) => (
            <Card key={s.type} className={`border-none shadow-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] rounded-[2.5rem] bg-white ${s.val === primary.val ? 'ring-4 ring-brand-orange/20' : ''}`}>
              <CardContent className="p-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-brand-black tracking-tight uppercase text-lg">{s.type}</span>
                  <span className="text-3xl font-black text-brand-blue italic">{s.val} <small className="text-[10px] uppercase text-slate-300 not-italic">pts</small></span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-4 mb-6 overflow-hidden border border-slate-100 shadow-inner">
                  <div
                    className={`${s.val === primary.val ? 'bg-brand-orange' : 'bg-brand-blue'} h-full rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${(s.val / 30) * 100}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analysis Section */}
        <div className="bg-slate-50 text-left rounded-[3rem] border border-slate-100 overflow-hidden max-w-5xl mx-auto shadow-inner">
          <div className="bg-brand-black px-10 py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              {isLoading ? 'Generando análisis...' : 'Informe de Personalidad'}
            </h3>
            {!isLoading && analysisText && (
              <PDFDownloadButton
                data={{
                  D, I, S, C,
                  analysis: analysisText,
                  userName: userName || 'Candidato',
                  date: new Date().toLocaleDateString()
                }}
              />
            )}
          </div>

          <div className="p-10 sm:p-16">
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded-full w-full"></div>
                <div className="h-6 bg-slate-200 rounded-full w-full"></div>
                <div className="h-6 bg-slate-200 rounded-full w-3/4"></div>
                <div className="h-40 bg-slate-200 rounded-[2rem] w-full mt-10"></div>
              </div>
            ) : hasError ? (
              <div className="p-10 bg-red-50 text-red-500 rounded-[2rem] border border-red-100 font-black text-center uppercase tracking-widest">
                Ocurrió un error al cargar el análisis.
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="relative mb-12">
                  <h4 className="text-3xl font-black text-brand-black mb-4 uppercase tracking-tighter italic">Interpretación DeepSeek</h4>
                  <div className="w-20 h-2 bg-brand-orange rounded-full"></div>
                </div>
                <p className="text-slate-500 leading-relaxed text-xl font-medium whitespace-pre-line">
                  {analysisText}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-12">
        <Link href="/psicometrias">
          <Button variant="outline" className="border-brand-blue text-brand-blue font-black h-16 px-12 rounded-2xl hover:bg-brand-blue hover:text-white transition-all uppercase tracking-widest">
            Volver al catálogo
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-brand-orange/20 selection:text-brand-orange">
      <main className="flex-grow container mx-auto px-4 py-20 max-w-6xl">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-40 text-slate-300">
            <div className="w-20 h-20 border-8 border-slate-100 border-t-brand-orange rounded-full animate-spin mb-10"></div>
            <p className="font-black uppercase tracking-[0.4em] text-sm animate-pulse">Preparando reporte HJ...</p>
          </div>
        }>
          <ResultsContent />
        </Suspense>
      </main>
    </div>
  );
}
