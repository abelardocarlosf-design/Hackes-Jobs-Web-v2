import os
import requests

def verify_antigravity_credits(tenant_id: str) -> bool:
    """
    Verifica si el tenant tiene créditos de software suficientes
    disponibles en la plataforma Antigravity antes de ejecutar procesos pesados.
    """
    if tenant_id == "demo_no_credits":
        return False
        
    api_url = os.environ.get("NEXTJS_BACKEND_URL", "http://localhost:3000")
    
    try:
        response = requests.get(
            f"{api_url}/api/v1/antigravity/check-credits",
            params={"tenantId": tenant_id},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("hasCredits", False)
        else:
            print(f"[Gatekeeper] API devolvió status {response.status_code}. Permitiendo paso por default local.")
            return True # Fallback en desarrollo
    except Exception as e:
        print(f"[Gatekeeper] Error conectando con backend Antigravity: {e}. Fallback a True.")
        return True
