'use client';

/**
 * "El motor": la infraestructura como una cadena de nodos por la que viaja
 * una señal, en el mismo orden en que interviene en un proceso. No es un muro
 * de logos: cada nodo dice qué resuelve para el cliente.
 */

import { Brain, Cpu, Database, Plug, ShieldCheck, Workflow, type LucideIcon } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/motion';

const NODOS: { icon: LucideIcon; titulo: string; tech: string; cuerpo: string }[] = [
  {
    icon: Workflow,
    titulo: 'Orquestación',
    tech: 'n8n',
    cuerpo: 'Encadena requisición, atracción, pruebas, seguimiento por WhatsApp y entrega de terna. Ningún paso se pierde en un correo.',
  },
  {
    icon: Brain,
    titulo: 'Filtrado con IA',
    tech: 'OpenAI · Anthropic',
    cuerpo: 'Compara cientos de currículums contra el perfil real en minutos. A entrevista solo llega quien encaja.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Suite psicométrica',
    tech: 'DISC · 16PF · Moss · Zavic · Lüscher',
    cuerpo: 'Scoring algorítmico y reporte ejecutivo en PDF. Tu equipo de RH recibe una conclusión, no un test crudo.',
  },
  {
    icon: Database,
    titulo: 'Memoria operativa',
    tech: 'PostgreSQL · Pinecone',
    cuerpo: 'Cada proceso cerrado queda registrado. Si vuelves a contratar el mismo perfil, partimos de lo aprendido.',
  },
  {
    icon: Cpu,
    titulo: 'Cobro y facturación',
    tech: 'Stripe · CFDI 4.0',
    cuerpo: 'Pago seguro en MXN y factura electrónica inmediata. Cero fricción para tu área de administración.',
  },
  {
    icon: Plug,
    titulo: 'Datos protegidos',
    tech: 'Next.js · AES-256 · LFPDPPP',
    cuerpo: 'Plataforma propia. Los datos de tus candidatos viven cifrados y sin intermediarios.',
  },
];

export function EngineMap() {
  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-6" stagger={0.08}>
      {NODOS.map(({ icon: Icon, titulo, tech, cuerpo }, i) => (
        <RevealItem key={titulo} className="relative">
          {/* Conector con señal hacia el siguiente nodo de la fila (solo lg). */}
          {i % 3 !== 2 && (
            <span className="hj-flow pointer-events-none absolute left-full top-10 hidden h-px w-10 lg:block" aria-hidden="true" />
          )}
          <div className="hj-panel group h-full rounded-2xl p-6 transition-colors duration-500 hover:border-hj-synapse/40">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hj-synapse/25 bg-hj-synapse/10 text-blue-200 transition-colors duration-500 group-hover:bg-hj-synapse group-hover:text-white">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-hj-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="hj-display mt-5 text-lg text-white">{titulo}</h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-hj-synapse">{tech}</p>
            <p className="mt-3 text-sm leading-relaxed text-hj-muted">{cuerpo}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
