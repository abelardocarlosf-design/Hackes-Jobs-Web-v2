/**
 * Antigravity Gatekeeper Client
 *
 * Se encarga de validar los créditos de software disponibles
 * en la cuenta Antigravity del Tenant (Empresa) antes de
 * autorizar operaciones costosas de IA o Evaluaciones.
 */

export interface AntigravityQuota {
  availableCredits: number;
  isActive: boolean;
  tenantId: string;
}

/**
 * Consulta a la API de Antigravity (Mock para fase inicial)
 */
export async function checkAntigravityCredits(tenantId: string, requiredCredits: number = 1): Promise<boolean> {
  try {
    // 1. Simulación de llamada a la API externa de Antigravity
    // const res = await fetch(`https://api.antigravity.dev/v1/quota/${tenantId}`);
    // const data = await res.json();
    
    // Mock Response:
    const mockData: AntigravityQuota = {
      availableCredits: tenantId === 'demo_no_credits' ? 0 : 500,
      isActive: true,
      tenantId
    };

    if (!mockData.isActive) {
      console.warn(`[Gatekeeper] Cuenta suspendida en Antigravity para Tenant: ${tenantId}`);
      return false;
    }

    if (mockData.availableCredits < requiredCredits) {
      console.warn(`[Gatekeeper] Créditos insuficientes. Requeridos: ${requiredCredits}, Disponibles: ${mockData.availableCredits}`);
      return false;
    }

    // 2. Si hay créditos, se autoriza.
    // (En producción, esto puede hacer un hold/reserve de los créditos)
    return true;
  } catch (error) {
    console.error("[Gatekeeper] Error de comunicación con Antigravity", error);
    // Fall-open o Fall-closed dependiendo de la política del negocio.
    // Para SaaS, generalmente Fall-closed si hay error.
    return false;
  }
}

/**
 * Deduce los créditos de Antigravity después de que la IA
 * ha completado su ejecución exitosamente.
 */
export async function deductAntigravityCredits(tenantId: string, creditsToDeduct: number = 1): Promise<void> {
  console.log(`[Gatekeeper] Deduciendo ${creditsToDeduct} créditos de la cuenta ${tenantId}`);
  // Llamada a la API de facturación/créditos
}
