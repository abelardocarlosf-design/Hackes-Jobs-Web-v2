import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-helpers';
import { guardarCV, MAX_CV_BYTES, TIPOS_CV_PERMITIDOS } from '@/lib/cv-storage';

const MAX_ARCHIVOS = 20;

/**
 * Carga masiva de CVs. Crea una ficha provisional por archivo usando el nombre
 * del fichero como nombre del candidato, para que el reclutador la complete
 * después desde la ficha.
 *
 * NOTA: no extrae datos del PDF. La referencia hace eso con un modelo; aquí el
 * archivo se guarda y se indexa, pero nombre, correo y teléfono los captura una
 * persona. Prometer extracción automática sin tenerla dejaría fichas basura.
 */
export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud debe enviarse como formulario.' },
      { status: 400 }
    );
  }

  const archivos = form.getAll('cvs').filter((a): a is File => typeof a !== 'string');
  if (archivos.length === 0) {
    return NextResponse.json({ success: false, message: 'Adjunta al menos un CV.' }, { status: 400 });
  }
  if (archivos.length > MAX_ARCHIVOS) {
    return NextResponse.json(
      { success: false, message: `Máximo ${MAX_ARCHIVOS} archivos por carga.` },
      { status: 413 }
    );
  }

  const zona = String(form.get('zona') || '').trim() || null;
  const puestoInteres = String(form.get('puestoInteres') || '').trim() || null;
  const fuente = String(form.get('fuente') || 'otro');

  const creados: { id: string; nombre: string }[] = [];
  const errores: { archivo: string; motivo: string }[] = [];

  for (const archivo of archivos) {
    const extension = TIPOS_CV_PERMITIDOS[archivo.type];
    if (!extension) {
      errores.push({ archivo: archivo.name, motivo: 'Formato no admitido' });
      continue;
    }
    if (archivo.size === 0 || archivo.size > MAX_CV_BYTES) {
      errores.push({ archivo: archivo.name, motivo: 'Archivo vacío o mayor a 5 MB' });
      continue;
    }

    try {
      const buffer = Buffer.from(await archivo.arrayBuffer());
      const clave = await guardarCV(buffer, extension, archivo.type);

      // El nombre del archivo, sin extensión ni separadores, como nombre provisional.
      const provisional =
        archivo.name
          .replace(/\.[^.]+$/, '')
          .replace(/[_-]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 80) || 'Candidato sin nombre';

      const candidato = await prisma.candidato.create({
        data: {
          nombre: provisional,
          zona,
          puestoInteres,
          fuente,
          // El consentimiento no se puede presumir en una carga masiva: queda
          // en false y la ficha lo muestra como pendiente hasta confirmarlo.
          consentimientoLFPDPPP: false,
          cvKey: clave,
          cvNombreArchivo: archivo.name,
          cvSubidoEn: new Date(),
        },
      });
      creados.push({ id: candidato.id, nombre: candidato.nombre });
    } catch (e) {
      console.error('[Carga masiva] Error con', archivo.name, e);
      errores.push({ archivo: archivo.name, motivo: 'Error al guardar' });
    }
  }

  return NextResponse.json(
    { success: true, data: { creados, errores, total: archivos.length } },
    { status: creados.length > 0 ? 201 : 400 }
  );
}
