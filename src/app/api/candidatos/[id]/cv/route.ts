import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-helpers';
import { leerCV, guardarCV, borrarCV, MAX_CV_BYTES, TIPOS_CV_PERMITIDOS } from '@/lib/cv-storage';

const TIPOS_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/**
 * Entrega el CV de un candidato. Único camino de acceso al archivo: los CVs
 * viven fuera de `public/` justamente para que pasen por aquí y no queden
 * expuestos por URL adivinable (LFPDPPP).
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const candidato = await prisma.candidato.findUnique({
    where: { id: params.id },
    select: { cvKey: true, cvNombreArchivo: true, nombre: true },
  });

  if (!candidato) {
    return NextResponse.json({ success: false, message: 'Candidato no encontrado.' }, { status: 404 });
  }

  if (!candidato.cvKey) {
    return NextResponse.json(
      { success: false, message: 'Este candidato no tiene CV cargado.' },
      { status: 404 }
    );
  }

  const archivo = await leerCV(candidato.cvKey);
  if (!archivo) {
    return NextResponse.json(
      { success: false, message: 'El archivo ya no está disponible en el almacenamiento.' },
      { status: 410 }
    );
  }

  const nombreDescarga =
    candidato.cvNombreArchivo || `CV_${candidato.nombre.replace(/\s+/g, '_')}.pdf`;
  const extension = nombreDescarga.split('.').pop()?.toLowerCase() || 'pdf';

  return new NextResponse(new Uint8Array(archivo), {
    status: 200,
    headers: {
      'Content-Type': TIPOS_MIME[extension] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(nombreDescarga)}"`,
      'Content-Length': String(archivo.length),
      // Nunca cachear: es dato personal servido tras validar sesión.
      'Cache-Control': 'no-store, private',
    },
  });
}

/** Sube o reemplaza el CV de un candidato desde el CRM. */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const candidato = await prisma.candidato.findUnique({ where: { id: params.id } });
  if (!candidato) {
    return NextResponse.json({ success: false, message: 'Candidato no encontrado.' }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud debe enviarse como formulario con archivo.' },
      { status: 400 }
    );
  }

  const archivo = form.get('cv');
  if (!archivo || typeof archivo === 'string') {
    return NextResponse.json({ success: false, message: 'Adjunta un archivo.' }, { status: 400 });
  }

  const extension = TIPOS_CV_PERMITIDOS[archivo.type];
  if (!extension) {
    return NextResponse.json(
      { success: false, message: 'Formato no admitido. Usa PDF, DOC o DOCX.' },
      { status: 415 }
    );
  }
  if (archivo.size === 0) {
    return NextResponse.json({ success: false, message: 'El archivo está vacío.' }, { status: 400 });
  }
  if (archivo.size > MAX_CV_BYTES) {
    return NextResponse.json({ success: false, message: 'El archivo supera los 5 MB.' }, { status: 413 });
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const clave = await guardarCV(buffer, extension, archivo.type);

  const anterior = candidato.cvKey;
  const actualizado = await prisma.candidato.update({
    where: { id: params.id },
    data: { cvKey: clave, cvNombreArchivo: archivo.name, cvSubidoEn: new Date() },
  });

  if (anterior && anterior !== clave) await borrarCV(anterior);

  return NextResponse.json({ success: true, data: { cvNombreArchivo: actualizado.cvNombreArchivo } });
}

/** Elimina el CV sin borrar la ficha del candidato. */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const candidato = await prisma.candidato.findUnique({ where: { id: params.id } });
  if (!candidato) {
    return NextResponse.json({ success: false, message: 'Candidato no encontrado.' }, { status: 404 });
  }
  if (!candidato.cvKey) {
    return NextResponse.json({ success: false, message: 'Este candidato no tiene CV.' }, { status: 404 });
  }

  await borrarCV(candidato.cvKey);
  await prisma.candidato.update({
    where: { id: params.id },
    data: { cvKey: null, cvNombreArchivo: null, cvSubidoEn: null },
  });

  return NextResponse.json({ success: true, data: { id: params.id } });
}
