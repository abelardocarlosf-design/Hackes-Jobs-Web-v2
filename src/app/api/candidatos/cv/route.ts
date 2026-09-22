import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { guardarCV, borrarCV, MAX_CV_BYTES, TIPOS_CV_PERMITIDOS } from '@/lib/cv-storage';
import { triggerWebhookAsync } from '@/lib/webhook';
import { getAuthUser } from '@/lib/api-helpers';

const FUENTES = ['whatsapp', 'scraping', 'formulario', 'referido', 'otro'];

// Endpoint público: lo usa el candidato desde /candidatos, sin sesión.
// Alimenta directamente el modelo Candidato del CRM para que el reclutador
// vea la postulación sin pasos intermedios.

const camposSchema = z.object({
  nombre: z.string().min(2, 'Escribe tu nombre completo'),
  email: z.string().email('El correo no es válido'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  zona: z.string().optional(),
  puestoInteres: z.string().optional(),
  consentimientoLFPDPPP: z.literal(true, {
    message: 'Debes aceptar el Aviso de Privacidad para enviar tu CV',
  }),
});

export async function POST(request: Request) {
  try {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, message: 'La solicitud debe enviarse como formulario con archivo.' },
        { status: 400 }
      );
    }

    const parsed = camposSchema.safeParse({
      nombre: form.get('nombre'),
      email: form.get('email'),
      telefono: form.get('telefono'),
      zona: form.get('zona') || undefined,
      puestoInteres: form.get('puestoInteres') || undefined,
      consentimientoLFPDPPP: form.get('consentimientoLFPDPPP') === 'true',
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }

    const archivo = form.get('cv');
    if (!archivo || typeof archivo === 'string') {
      return NextResponse.json(
        { success: false, message: 'Adjunta tu CV.' },
        { status: 400 }
      );
    }

    const extension = TIPOS_CV_PERMITIDOS[archivo.type];
    if (!extension) {
      return NextResponse.json(
        { success: false, message: 'Formato no admitido. Envía tu CV en PDF, DOC o DOCX.' },
        { status: 415 }
      );
    }

    if (archivo.size === 0) {
      return NextResponse.json({ success: false, message: 'El archivo está vacío.' }, { status: 400 });
    }

    if (archivo.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { success: false, message: 'El archivo supera el límite de 5 MB.' },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await archivo.arrayBuffer());
    const clave = await guardarCV(buffer, extension, archivo.type);

    const { nombre, email, telefono, zona, puestoInteres } = parsed.data;
    const emailNormalizado = email.trim().toLowerCase();

    // La fuente solo la puede fijar un reclutador dando de alta desde el CRM.
    // Un envío público siempre queda marcado como 'formulario': si no, cualquiera
    // podría hacer pasar su envío por un referido interno.
    const usuarioCrm = await getAuthUser(request);
    const puedeFijarFuente = usuarioCrm && ['admin', 'recruiter'].includes(usuarioCrm.role);
    const fuenteSolicitada = String(form.get('fuente') || '');
    const fuente =
      puedeFijarFuente && FUENTES.includes(fuenteSolicitada) ? fuenteSolicitada : 'formulario';

    // Si ya existe un Candidato con ese correo, se actualiza en vez de duplicar:
    // el reclutador debe ver una ficha por persona, no una por envío.
    const existente = await prisma.candidato.findFirst({
      where: { email: emailNormalizado },
      orderBy: { createdAt: 'desc' },
    });

    const datos = {
      nombre: nombre.trim(),
      email: emailNormalizado,
      telefono: telefono.trim(),
      zona: zona?.trim() || null,
      puestoInteres: puestoInteres?.trim() || null,
      fuente,
      consentimientoLFPDPPP: true,
      cvKey: clave,
      cvNombreArchivo: archivo.name,
      cvSubidoEn: new Date(),
    };

    const candidato = existente
      ? await prisma.candidato.update({ where: { id: existente.id }, data: datos })
      : await prisma.candidato.create({ data: datos });

    // Sustituir el CV deja el archivo anterior huérfano en el almacenamiento.
    if (existente?.cvKey && existente.cvKey !== clave) {
      await borrarCV(existente.cvKey);
    }

    // Si la persona además tiene cuenta en la plataforma, se refleja en su perfil.
    const usuario = await prisma.user.findUnique({
      where: { email: emailNormalizado },
      include: { candidate: true },
    });
    if (usuario?.candidate) {
      await prisma.candidate.update({
        where: { id: usuario.candidate.id },
        data: { cvUrl: clave, phone: telefono.trim() },
      });
    }

    triggerWebhookAsync('cv-recibido', {
      candidatoId: candidato.id,
      nombre: candidato.nombre,
      email: candidato.email,
      telefono: candidato.telefono,
      zona: candidato.zona,
      puestoInteres: candidato.puestoInteres,
      actualizacion: !!existente,
    });

    return NextResponse.json(
      {
        success: true,
        message: existente
          ? 'Actualizamos tu CV. Nuestro equipo te contactará.'
          : 'Recibimos tu CV. Nuestro equipo te contactará.',
        data: { candidatoId: candidato.id },
      },
      { status: existente ? 200 : 201 }
    );
  } catch (error) {
    console.error('[CV Upload Error]:', error);
    return NextResponse.json(
      { success: false, message: 'No pudimos procesar tu CV. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}
