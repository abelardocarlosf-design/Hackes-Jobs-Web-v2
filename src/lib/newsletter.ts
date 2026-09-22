import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { Subscriber } from './newsletter.types';

export * from './newsletter.types';

// Las suscripciones se guardaban en `data/subscribers.json` con `fs`. En Vercel
// el disco es de solo lectura, así que `writeFileSync` lanzaba y la ruta
// devolvía "Error al guardar la suscripción" — o, peor, en las lecturas el
// catch devolvía `[]` y la pérdida pasaba desapercibida. Ahora van a Postgres.

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const filas = await prisma.subscriber.findMany({ orderBy: { date: 'desc' } });
  return filas.map((fila) => ({
    email: fila.email,
    date: fila.date.toISOString(),
  }));
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  // Se normaliza antes de escribir: el índice único de Postgres distingue
  // mayúsculas, así que sin esto "Ana@X.com" y "ana@x.com" entrarían las dos.
  const normalizado = email.trim().toLowerCase();

  const yaEsta = await prisma.subscriber.findUnique({
    where: { email: normalizado },
    select: { email: true },
  });
  if (yaEsta) {
    return { success: false, message: 'Este correo ya está suscrito.' };
  }

  try {
    await prisma.subscriber.create({ data: { email: normalizado } });
    return { success: true, message: '¡Gracias por suscribirte!' };
  } catch (error) {
    // Entre la lectura de arriba y esta escritura hay una ventana en la que dos
    // peticiones con el mismo correo pasan las dos. El índice único de la tabla
    // la cierra, y P2002 es cómo se ve esa colisión desde aquí: no es un fallo,
    // es el mismo caso de "ya estaba" llegando por la vía rápida.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, message: 'Este correo ya está suscrito.' };
    }
    console.error('[newsletter addSubscriber]:', error);
    return { success: false, message: 'Error al guardar la suscripción.' };
  }
}
