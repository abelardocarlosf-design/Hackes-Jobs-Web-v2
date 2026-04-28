import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { triggerWebhookAsync } from '@/lib/webhook';
import { sendCandidatePDFEmail } from '@/lib/mailer';
import { CandidatePDF } from '@/components/CandidatePDF';
import { renderToBuffer } from '@react-pdf/renderer';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['company', 'candidate']),
  companyName: z.string().optional(),
  companyIndustry: z.string().optional(),
  companySize: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Datos inválidos';
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    const { name, email, password, role, companyName, companyIndustry, companySize } = parsed.data;

    // Verificar email duplicado
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    // Crear usuario
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    // Si es empresa, crear registro de Company
    if (role === 'company' && companyName) {
      await prisma.company.create({
        data: {
          name: companyName,
          industry: companyIndustry || null,
          size: companySize || null,
          userId: user.id,
        },
      });

      // Disparar webhook de lead a n8n
      triggerWebhookAsync('company-lead', {
        userId: user.id,
        name,
        email,
        companyName,
        companyIndustry,
        companySize,
      });
    }

    // Si es candidato, crear registro de Candidate
    if (role === 'candidate') {
      await prisma.candidate.create({
        data: {
          userId: user.id,
        },
      });

      // Generar PDF y Enviar Correo
      try {
        const dateStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const pdfBuffer = await renderToBuffer(<CandidatePDF name={name} email={email} date={dateStr} />);
        await sendCandidatePDFEmail(name, email, pdfBuffer);
        console.log(`[PDF Email] Correo enviado a abelardo.carlos@hackesjobs.com para ${name}`);
      } catch (pdfError) {
        console.error('[PDF Email Error]:', pdfError);
      }
    }

    // Generar JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Respuesta con cookie httpOnly
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    }, { status: 201 });

    response.cookies.set('hj_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Register Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
