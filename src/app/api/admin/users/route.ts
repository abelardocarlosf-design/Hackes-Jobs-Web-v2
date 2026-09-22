import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { requireAuth, errorResponse, successResponse } from '@/lib/api-helpers';

// Convención: todo lo que cuelga de /api/admin/* exige rol `admin` con la cookie
// hj_token. Antes existía una segunda sesión (hj_admin_token) sobre un JSON en
// disco; se eliminó porque no se podía crear reclutadores desde ninguna pantalla
// y las contraseñas se guardaban en texto plano.

// Los cuatro roles del sistema. Coincide con el default de User.role en Prisma
// y con CRM_ROLES del middleware.
const ROLES = ['admin', 'recruiter', 'company', 'candidate'] as const;

const nuevoUsuarioSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(ROLES),
});

// Nunca seleccionamos passwordHash: así el hash no sale de la base siquiera.
const CAMPOS_PUBLICOS = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  authProvider: true,
  createdAt: true,
} as const;

export async function GET(request: Request) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    const usuarios = await prisma.user.findMany({
      select: CAMPOS_PUBLICOS,
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(usuarios);
  } catch (error) {
    console.error('[admin/users GET]:', error);
    return errorResponse('Error al obtener usuarios', 500);
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    const parsed = nuevoUsuarioSchema.safeParse(await request.json());
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos');
    }
    const { name, email, password, role } = parsed.data;

    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) return errorResponse('Este email ya está registrado', 409);

    // El endpoint recibe la contraseña en claro y la hashea aquí. El cliente
    // nunca envía un hash: si lo hiciera, cualquiera podría postear el hash
    // robado de otra persona y autenticarse con él.
    const usuario = await prisma.user.create({
      data: { name, email, passwordHash: await hashPassword(password), role },
      select: CAMPOS_PUBLICOS,
    });

    // Los paneles de empresa y candidato leen su perfil relacionado al cargar.
    // Sin estas filas la cuenta existe pero su panel revienta al primer acceso.
    if (role === 'company') {
      await prisma.company.create({ data: { name, userId: usuario.id } });
    } else if (role === 'candidate') {
      await prisma.candidate.create({ data: { userId: usuario.id } });
    }

    return successResponse(usuario, 201);
  } catch (error) {
    console.error('[admin/users POST]:', error);
    return errorResponse('Error al crear usuario', 500);
  }
}
