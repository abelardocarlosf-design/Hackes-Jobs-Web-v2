import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth Me Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno' },
      { status: 500 }
    );
  }
}
