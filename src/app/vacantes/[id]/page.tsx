import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Calendar, Banknote, CheckCircle2, Star } from 'lucide-react';
import { vacanteById, vacantesActivas, type Vacante } from '@/data/vacantes';
import { EmpresaLogo } from '@/components/vacantes/EmpresaLogo';
import { PostularButton } from '@/components/vacantes/PostularButton';

interface RouteParams {
  params: { id: string };
}

// Pre-render every active vacancy at build time → instant load + best SEO
export function generateStaticParams() {
  return vacantesActivas().map((v) => ({ id: v.id }));
}

export function generateMetadata({ params }: RouteParams): Metadata {
  const v = vacanteById(params.id);
  if (!v) return { title: 'Vacante no encontrada' };

  const description = v.descripcion.slice(0, 158);
  const title = `${v.titulo} en ${v.empresa} · ${v.ubicacion.split(',')[0]}`;
  const url = `/vacantes/${v.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: "Hacke's Jobs Technologies",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: v.activa !== false, follow: true },
  };
}

// Map our modalidad to Schema.org employmentType
const MODALITY_TO_EMPLOYMENT: Record<Vacante['modalidad'], string> = {
  Presencial: 'FULL_TIME',
  Híbrido: 'FULL_TIME',
  Remoto: 'FULL_TIME',
};

const MODALITY_TO_LOCATION_TYPE: Record<Vacante['modalidad'], string | undefined> = {
  Presencial: undefined,
  Híbrido: undefined,
  Remoto: 'TELECOMMUTE',
};

function buildJobPostingSchema(v: Vacante) {
  const datePosted = v.fechaPublicacion || new Date().toISOString().slice(0, 10);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: v.titulo,
    description: [
      v.descripcion,
      v.responsabilidades?.length ? `\n\nResponsabilidades:\n- ${v.responsabilidades.join('\n- ')}` : '',
      v.requisitos?.length ? `\n\nRequisitos:\n- ${v.requisitos.join('\n- ')}` : '',
      v.ofrecemos?.length ? `\n\nBeneficios:\n- ${v.ofrecemos.join('\n- ')}` : '',
    ]
      .join('')
      .trim(),
    identifier: { '@type': 'PropertyValue', name: v.empresa, value: v.id },
    datePosted,
    validThrough: new Date(new Date(datePosted).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: MODALITY_TO_EMPLOYMENT[v.modalidad],
    hiringOrganization: {
      '@type': 'Organization',
      name: v.empresa,
      sameAs: 'https://hackesjobs.com.mx',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: v.ubicacion.split(',')[0].trim(),
        addressRegion: v.ubicacion.split(',')[1]?.trim() || 'Estado de México',
        addressCountry: 'MX',
      },
    },
    directApply: false,
  };

  const locType = MODALITY_TO_LOCATION_TYPE[v.modalidad];
  if (locType) (schema as Record<string, unknown>).jobLocationType = locType;

  if (v.salario && /\d/.test(v.salario)) {
    // Soft attempt to parse "$X,XXX - $Y,YYY MXN/mes" → BaseSalary
    const nums = v.salario.replace(/[^\d-]/g, '').split('-').map(Number).filter((n) => !Number.isNaN(n));
    if (nums.length >= 1) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: 'MXN',
        value: {
          '@type': 'QuantitativeValue',
          unitText: 'MONTH',
          ...(nums.length === 2
            ? { minValue: nums[0], maxValue: nums[1] }
            : { value: nums[0] }),
        },
      };
    }
  }

  return schema;
}

export default function VacanteDetailPage({ params }: RouteParams) {
  const v = vacanteById(params.id);
  if (!v || v.activa === false) notFound();

  const jsonLd = buildJobPostingSchema(v);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-orange/40 selection:text-white pb-32">
      <div className="page-overlay" />
      <div className="page-dotgrid" />

      {/* JSON-LD for Google Jobs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-28 pb-16 md:pt-36 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            href="/vacantes"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-[11px] font-black uppercase tracking-[0.3em] mb-10 transition-colors"
          >
            <ArrowLeft size={14} /> Volver al catálogo
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Header */}
              <header className="space-y-6">
                <div className="flex items-start gap-5">
                  <EmpresaLogo empresa={v.empresa} size="lg" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        {v.categoria}
                      </span>
                      {v.destacada && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[9px] font-black uppercase tracking-[0.2em]">
                          <Star size={10} className="fill-brand-orange" /> Destacada
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                      {v.titulo}
                    </h1>
                    <p className="text-slate-400 font-bold text-base">{v.empresa}</p>
                  </div>
                </div>

                {/* Meta strip */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-bold">
                    <MapPin size={13} className="text-brand-orange" /> {v.ubicacion}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-bold">
                    <Briefcase size={13} className="text-brand-orange" /> {v.modalidad}
                  </span>
                  {v.salario && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
                      <Banknote size={13} /> {v.salario}
                    </span>
                  )}
                  {v.fechaPublicacion && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold">
                      <Calendar size={13} className="text-slate-500" /> Publicada {v.fechaPublicacion}
                    </span>
                  )}
                </div>
              </header>

              {/* Description */}
              <article className="card-premium p-8 md:p-10 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">
                  Sobre la posición
                </h2>
                <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">{v.descripcion}</p>
              </article>

              {/* Responsabilidades */}
              {v.responsabilidades && v.responsabilidades.length > 0 && (
                <article className="card-premium p-8 md:p-10 space-y-5">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">
                    Responsabilidades
                  </h2>
                  <ul className="space-y-3">
                    {v.responsabilidades.map((r, i) => (
                      <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {/* Requisitos */}
              {v.requisitos && v.requisitos.length > 0 && (
                <article className="card-premium p-8 md:p-10 space-y-5">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">
                    Requisitos
                  </h2>
                  <ul className="space-y-3">
                    {v.requisitos.map((r, i) => (
                      <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {/* Lo que ofrecemos */}
              {v.ofrecemos && v.ofrecemos.length > 0 && (
                <article className="card-premium p-8 md:p-10 space-y-5">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">
                    Lo que ofrecemos
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {v.ofrecemos.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold"
                      >
                        <CheckCircle2 size={13} /> {b}
                      </span>
                    ))}
                  </div>
                </article>
              )}
            </div>

            {/* Sticky CTA aside */}
            <aside className="lg:col-span-1">
              <div className="card-premium p-7 sticky top-28 space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    Postulación
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                    ¿Te interesa esta vacante?
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Registra tu interés con un clic. Te contactamos por correo y WhatsApp para los siguientes pasos.
                  </p>
                </div>

                <PostularButton
                  vacanteId={v.id}
                  vacanteTitulo={v.titulo}
                  vacanteEmpresa={v.empresa}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
