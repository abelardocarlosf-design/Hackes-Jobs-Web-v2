import Image from 'next/image';

type Tech = {
  slug: string;
  name: string;
  purpose: string;
};

const TECH: Tech[] = [
  { slug: 'n8n', name: 'n8n', purpose: 'Orquestación' },
  { slug: 'stripe', name: 'Stripe', purpose: 'Cobros MXN' },
  { slug: 'postgresql', name: 'PostgreSQL', purpose: 'Datos relacionales' },
  { slug: 'pinecone', name: 'Pinecone', purpose: 'Búsqueda vectorial' },
  { slug: 'openai', name: 'OpenAI', purpose: 'Modelos LLM' },
  { slug: 'gemini', name: 'Gemini', purpose: 'Modelos LLM' },
  { slug: 'anthropic', name: 'Anthropic', purpose: 'Modelos LLM' },
  { slug: 'claude', name: 'Claude', purpose: 'Asistente IA' },
  { slug: 'nextjs', name: 'Next.js', purpose: 'Frontend SSR' },
  { slug: 'google-antigravity', name: 'Antigravity', purpose: 'Cloud / IA' },
];

export function TechStackGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
      {TECH.map((tech) => (
        <div
          key={tech.slug}
          className="tech-tile group card-premium flex flex-col items-center justify-center gap-3 py-6 px-4 min-h-[120px] transition-all duration-300"
          title={`${tech.name} · ${tech.purpose}`}
        >
          <div className="relative w-full h-16 flex items-center justify-center">
            <picture className="tech-logo flex items-center justify-center w-full h-full">
              <source srcSet={`/assets/tech/${tech.slug}.avif`} type="image/avif" />
              <source srcSet={`/assets/tech/${tech.slug}.webp`} type="image/webp" />
              <Image
                src={`/assets/tech/${tech.slug}.png`}
                alt={tech.name}
                width={130}
                height={40}
                className="object-contain w-auto h-auto max-h-[40px] max-w-[130px] brightness-0 invert opacity-60 transition-all duration-300 ease-in-out group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] group-hover:scale-105"
                loading="lazy"
              />
            </picture>
          </div>
          <div className="text-center transition-transform duration-300 group-hover:-translate-y-0.5">
            <div className="text-white font-bold text-xs tracking-tight">{tech.name}</div>
            <div className="text-slate-500 text-[9px] uppercase tracking-[0.2em] mt-0.5 font-bold">
              {tech.purpose}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
