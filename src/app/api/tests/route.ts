import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = cookies().get('hj_token')?.value;
    let candidateId = null;

    if (token) {
      const decoded = await verifyAuth(token);
      if (decoded && decoded.role === 'candidate') {
        const candidate = await prisma.candidate.findUnique({
          where: { userId: decoded.userId as string },
        });
        if (candidate) candidateId = candidate.id;
      }
    }

    const tests = await prisma.psychometricTest.findMany({
      where: { active: true },
      orderBy: { price: 'asc' }
    });

    // Si hay un candidato logueado, obtenemos sus compras para saber qué tests Premium ya desbloqueó
    let purchases: any[] = [];
    if (candidateId) {
      purchases = await prisma.testPurchase.findMany({
        where: {
          candidateId,
          status: 'completed'
        }
      });
    }

    const unlockedTestIds = purchases.map(p => p.testId);

    const enrichedTests = tests.map(test => ({
      ...test,
      isUnlocked: test.isPremium ? unlockedTestIds.includes(test.id) : true
    }));

    return NextResponse.json({ success: true, data: enrichedTests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener el catálogo de pruebas' },
      { status: 500 }
    );
  }
}
