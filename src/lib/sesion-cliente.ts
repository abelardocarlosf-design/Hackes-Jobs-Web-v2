'use client';

/**
 * Cierre de sesión desde el navegador.
 *
 * Existían tres copias de esta lógica (CrmShell, auth-context y el sidebar del
 * dashboard, donde además el botón no tenía onClick y no hacía nada). Una sola
 * implementación evita que vuelvan a desincronizarse.
 *
 * La navegación es dura, no `router.push`: la cookie hj_token es httpOnly y la
 * borra el servidor, así que hay que rehacer la petición para que el árbol de
 * React se reconstruya ya sin sesión.
 */
export async function cerrarSesion(destino = '/login') {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } finally {
    window.location.href = destino;
  }
}
