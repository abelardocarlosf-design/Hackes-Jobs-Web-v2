"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { DiscTest } from '@/components/DiscTest';

export default function DiscTestPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navigation / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link href="/psicometrias" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Volver al catálogo
            </Link>
          </div>
          <div className="text-sm font-bold text-slate-900">
            Evaluación DISC
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 sm:py-20 max-w-4xl">
        {!isStarted ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center text-white">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">Bienvenido al Test DISC</h1>
              <p className="text-blue-100 text-lg max-w-xl mx-auto font-medium">
                Esta evaluación nos ayudará a entender tu perfil de comportamiento natural en el entorno de trabajo.
              </p>
            </div>

            {/* Instructions */}
            <div className="p-8 sm:p-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                Instrucciones antes de comenzar
              </h2>
              
              <ul className="space-y-5 mb-10 text-slate-600 font-medium">
                <li className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                  <p><strong>Sé honesto:</strong> No hay respuestas correctas o incorrectas. Responde cómo eres realmente, no cómo crees que deberías ser.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                  <p><strong>Sé rápido:</strong> Tu primera impresión suele ser la más acertada. Evita pensar demasiado tus elecciones.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <p><strong>Entorno laboral:</strong> Al responder, piensa exclusivamente en cómo te comportas en tu trabajo actual o más reciente.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm">4</div>
                  <p><strong>Formato:</strong> Encontrarás 30 preguntas con 4 opciones. Selecciona la opción que <strong>mejor te describe</strong>.</p>
                </li>
              </ul>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10 flex gap-4">
                <svg className="text-amber-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <p className="text-amber-800 font-medium">Asegúrate de contar con <strong>15 a 20 minutos sin interrupciones</strong>. Una vez iniciada la evaluación, tu progreso no se guardará si cierras la ventana.</p>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => setIsStarted(true)} 
                  size="lg" 
                  className="h-16 px-12 text-xl font-bold rounded-2xl bg-slate-900 hover:bg-blue-600 text-white transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-blue-600/30 hover:-translate-y-1"
                >
                  Comenzar evaluación
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500">
            <DiscTest />
          </div>
        )}
      </main>
    </div>
  );
}
