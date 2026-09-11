/**
 * Contenido del home.
 *
 * Vive fuera de los componentes para que las secciones sean Server Components
 * sin arrastrar datos en el bundle de cliente, y para que cambiar una cifra o
 * una línea de copy no obligue a tocar markup.
 *
 * Nota de posicionamiento: el eje geográfico es Ciudad de México y las plazas
 * principales del país. La manufactura sigue siendo el núcleo de credibilidad
 * —es donde están los casos reales— pero ya no encabeza el mensaje.
 */

import { Brain, Workflow, Database, Cpu, ShieldCheck, Plug, type LucideIcon } from 'lucide-react';

export const SERVICIOS = [
  'Reclutamiento especializado',
  'Evaluación psicométrica',
  'Procesos operados con IA',
];

export const PROCESO = [
  {
    title: 'Requisición en 24 h',
    body: 'Levantamos el perfil real del puesto y confirmamos alcance dentro del mismo día hábil.',
  },
  {
    title: 'Evaluación psicométrica',
    body: 'Batería validada con scoring algorítmico y reporte ejecutivo en PDF, no un test crudo.',
  },
  {
    title: 'Terna con garantía',
    body: 'Entregamos finalistas con evidencia y respaldo de reposición durante 10 días.',
  },
];

export const KPIS = [
  { value: 500, prefix: '+', suffix: '', label: 'Evaluaciones procesadas' },
  { value: 50, prefix: '+', suffix: '', label: 'Empresas atendidas' },
  { value: 10, prefix: '', suffix: ' días', label: 'Garantía de reposición' },
  { value: 24, prefix: '', suffix: ' hrs', label: 'Respuesta a requisición' },
];

/** Los tres datos que sostienen la promesa del hero, bajo los CTAs. */
export const HERO_PRUEBAS = [
  { dato: '24 h', label: 'Respuesta a requisición' },
  { dato: '7–10 días', label: 'Terna evaluada' },
  { dato: '10 días', label: 'Garantía de reposición' },
];

export const STACK: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Workflow,
    title: 'n8n — Orquestación',
    body: 'Conecta automáticamente cada etapa del reclutamiento: requisición, atracción, envío de psicometrías, seguimiento por WhatsApp y entrega de terna. Sin pasos manuales perdidos en correos.',
  },
  {
    icon: Brain,
    title: 'Modelos IA (OpenAI · Anthropic)',
    body: 'Filtran cientos de currículums contra el perfil real del puesto en minutos, no en días. Solo llegan a entrevista los candidatos con compatibilidad técnica y conductual verificada.',
  },
  {
    icon: ShieldCheck,
    title: 'Suite psicométrica',
    body: 'Aplicamos baterías validadas con scoring algorítmico (DISC, 16PF, Moss, Zavic, Lüscher) y entrega de reporte ejecutivo. Tu gerente de RH recibe un PDF claro, no un test crudo.',
  },
  {
    icon: Database,
    title: 'PostgreSQL + Pinecone',
    body: 'Memoria operativa. Cada candidato evaluado y proceso cerrado queda registrado. Cuando vuelves a contratar para el mismo perfil, partimos de la experiencia previa, no de cero.',
  },
  {
    icon: Cpu,
    title: 'Stripe + CFDI 4.0',
    body: 'Cobro y facturación transparente. Pago seguro en MXN, facturación electrónica inmediata para México. Cero fricción contable para tu equipo de administración.',
  },
  {
    icon: Plug,
    title: 'Next.js + Cifrado AES-256',
    body: 'Plataforma propia, datos protegidos. La infraestructura es nuestra. Los datos de tus candidatos viven cifrados, bajo cumplimiento LFPDPPP, sin intermediarios.',
  },
];

/* ─── Ritmo compartido por las secciones del home ────────────────────── */

/** Gutter horizontal común. */
export const GUTTER = 'px-5 sm:px-8 md:px-12';

/** Shell de sección a viewport completo, con aire bajo el navbar fijo. */
export const VIEWPORT_SECTION =
  // `gap-10`: en móvil el contenido supera la altura del viewport y
  // `justify-between` deja de separar nada — la lista de servicios quedaba
  // pegada al badge.
  'relative flex min-h-screen supports-[height:100svh]:min-h-[100svh] flex-col justify-between gap-10 pt-24 pb-12 sm:pt-28 md:gap-0 md:pb-16';
