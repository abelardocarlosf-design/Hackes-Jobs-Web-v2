const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || 'https://api.hackesjobs.com.mx/webhook';

export type WebhookEvent = 'job-created' | 'new-application' | 'test-completed' | 'company-lead' | 'payment-completed';

interface WebhookResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

/**
 * Dispara un webhook a n8n con retry logic.
 * @param event - Tipo de evento
 * @param payload - Datos a enviar
 * @param maxRetries - Número máximo de reintentos (default: 3)
 */
export async function triggerWebhook(
  event: WebhookEvent,
  payload: Record<string, unknown>,
  maxRetries = 3
): Promise<WebhookResult> {
  const url = `${WEBHOOK_BASE_URL}/${event}`;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Webhook] Enviando ${event} (intento ${attempt}/${maxRetries}) → ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event,
          'X-Webhook-Source': 'hackesjobs-saas',
          'X-Webhook-Secret': process.env.WEBHOOK_SECRET || '',
        },
        body: JSON.stringify({
          event,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      });

      if (response.ok) {
        console.log(`[Webhook] ✅ ${event} enviado exitosamente (${response.status})`);
        return { success: true, statusCode: response.status };
      }

      console.warn(`[Webhook] ⚠️ ${event} respondió ${response.status} en intento ${attempt}`);
      
      // No reintentar errores 4xx (excepto 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return { success: false, statusCode: response.status, error: `HTTP ${response.status}` };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      console.error(`[Webhook] ❌ ${event} falló en intento ${attempt}: ${errorMsg}`);

      if (attempt === maxRetries) {
        return { success: false, error: errorMsg };
      }
    }

    // Backoff exponencial: 1s, 2s, 4s
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }

  return { success: false, error: 'Max retries exceeded' };
}

/**
 * Dispara un webhook sin esperar respuesta (fire-and-forget).
 * Útil para no bloquear la respuesta de la API.
 */
export function triggerWebhookAsync(event: WebhookEvent, payload: Record<string, unknown>): void {
  triggerWebhook(event, payload).catch(err => {
    console.error(`[Webhook Async] Error en ${event}:`, err);
  });
}
