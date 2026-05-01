import math
from typing import List, Dict, Any

def calculate_item_information(a: float, b: float, c: float, theta: float) -> float:
    """
    Calcula la Información de Fisher para un ítem dado en el nivel de habilidad actual (theta).
    Utilizando la Función de Respuesta al Ítem (IRT) de 3 parámetros (3PL).
    """
    D = 1.702 # Constante de escalamiento métrico normal
    
    # Probabilidad de respuesta correcta P(theta)
    exponent = -D * a * (theta - b)
    P = c + (1 - c) / (1 + math.exp(exponent))
    
    # Derivada de P con respecto a theta
    Q = 1 - P
    P_star = 1 / (1 + math.exp(exponent)) # Probabilidad sin adivinación
    
    # Información del ítem
    information = (D**2 * a**2 * Q / P) * (P_star**2) * ((1 - c)**2)
    return information

def select_next_item(available_items: List[Dict[str, Any]], current_theta: float) -> Dict[str, Any]:
    """
    Selecciona el ítem que maximiza la información matemática para la estimación de la habilidad.
    """
    best_item = None
    max_info = -1.0
    
    for item in available_items:
        # Extraemos los parámetros de Prisma (asumimos que vienen como floats)
        a = item.get('parameterA', 1.0)
        b = item.get('parameterB', 0.0)
        c = item.get('parameterC', 0.0)
        
        info = calculate_item_information(a, b, c, current_theta)
        
        if info > max_info:
            max_info = info
            best_item = item
            
    return best_item

def update_theta_mle(responses: List[Dict[str, Any]], current_theta: float) -> float:
    """
    Actualiza el nivel de habilidad (theta) usando Estimación de Máxima Verosimilitud (MLE).
    Por simplicidad, en este mock usamos una aproximación heurística si hay pocas respuestas,
    o descenso de gradiente para encontrar el theta que maximiza la log-verosimilitud.
    
    responses: [{"a": 1.2, "b": 0.5, "c": 0.2, "is_correct": True}, ...]
    """
    if not responses:
        return current_theta
        
    # Implementación simplificada del Newton-Raphson para MLE
    D = 1.702
    theta = current_theta
    
    # Realizamos un máximo de 5 iteraciones
    for _ in range(5):
        first_derivative = 0.0
        second_derivative = 0.0
        
        for resp in responses:
            a = resp['a']
            b = resp['b']
            c = resp['c']
            u = 1 if resp['is_correct'] else 0
            
            exponent = -D * a * (theta - b)
            # Prevenir overflow
            if exponent > 50: exponent = 50
            if exponent < -50: exponent = -50
                
            P = c + (1 - c) / (1 + math.exp(exponent))
            Q = 1 - P
            P_star = 1 / (1 + math.exp(exponent))
            
            # Cálculo de derivadas parciales para la log-verosimilitud
            term1 = D * a * P_star * (1 - c) / P
            first_derivative += term1 * (u - P)
            
            # Segunda derivada (Información observada)
            second_derivative -= (D**2 * a**2 * Q / P) * (P_star**2) * ((1 - c)**2)
            
        if second_derivative == 0:
            break
            
        # Actualización Newton-Raphson
        delta = first_derivative / second_derivative
        
        # Limitar el salto para evitar divergencia
        if delta > 1.0: delta = 1.0
        if delta < -1.0: delta = -1.0
            
        theta -= delta
        
        # Restringir theta a un rango razonable [-4.0, 4.0]
        if theta > 4.0: theta = 4.0
        if theta < -4.0: theta = -4.0
            
    return theta

def calculate_standard_error(responses: List[Dict[str, Any]], theta: float) -> float:
    """
    Calcula el Error Estándar (SE) de la medición actual de theta.
    SE = 1 / sqrt(Test Information)
    """
    if not responses:
        return 1.0
        
    total_info = sum([calculate_item_information(r['a'], r['b'], r['c'], theta) for r in responses])
    
    if total_info <= 0:
        return 1.0
        
    return 1.0 / math.sqrt(total_info)
