import json

def generate_mock_cat_items():
    """
    Genera un archivo JSON con preguntas de prueba para el banco de ítems CAT.
    Estas preguntas están calibradas con la Teoría de Respuesta al Ítem (TRI).
    """
    items = [
        {
            "questionText": "Si la probabilidad de que un evento ocurra es de 0.2, ¿cuál es la probabilidad de que no ocurra en 3 intentos independientes?",
            "options": json.dumps([
                {"id": "a", "text": "0.512"},
                {"id": "b", "text": "0.008"},
                {"id": "c", "text": "0.800"},
                {"id": "d", "text": "0.488"}
            ]),
            "correctOptionId": "a",
            "parameterA": 1.5, # Alta discriminación
            "parameterB": 1.2, # Dificultad media-alta
            "parameterC": 0.25 # Probabilidad de adivinación (1 de 4)
        },
        {
            "questionText": "¿Cuál de las siguientes estructuras de datos ofrece una complejidad temporal O(1) promedio para búsqueda, inserción y eliminación?",
            "options": json.dumps([
                {"id": "a", "text": "Árbol Binario de Búsqueda"},
                {"id": "b", "text": "Lista Enlazada"},
                {"id": "c", "text": "Tabla Hash (Hash Map)"},
                {"id": "d", "text": "Cola de Prioridad (Min-Heap)"}
            ]),
            "correctOptionId": "c",
            "parameterA": 1.8, # Muy alta discriminación
            "parameterB": -0.5, # Dificultad baja (conocimiento básico)
            "parameterC": 0.25
        },
        {
            "questionText": "En el contexto de microservicios, ¿cuál es el propósito principal del patrón 'Circuit Breaker'?",
            "options": json.dumps([
                {"id": "a", "text": "Balancear la carga entre múltiples instancias"},
                {"id": "b", "text": "Prevenir fallas en cascada y permitir la recuperación del sistema"},
                {"id": "c", "text": "Cifrar la comunicación entre servicios"},
                {"id": "d", "text": "Descubrir nuevos servicios dinámicamente"}
            ]),
            "correctOptionId": "b",
            "parameterA": 1.3,
            "parameterB": 0.8, # Dificultad media
            "parameterC": 0.25
        }
    ]
    
    with open('mock_cat_items.json', 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        
    print("Archivo mock_cat_items.json generado. Úsalo para poblar tu base de datos SQLite.")

if __name__ == "__main__":
    generate_mock_cat_items()
