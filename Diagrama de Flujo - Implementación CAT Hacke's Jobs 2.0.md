# **Diagrama de Flujo: Implementación de Evaluaciones CAT**

*(Computerized Adaptive Testing \- Teoría de Respuesta al Ítem)*

## **1\. Representación Visual del Proceso**

---

| INICIO Configuración de parámetros iniciales |
| ----- |
| ↓ |
| **BANCO DE ÍTEMS CALIBRADOS** Base de datos con parámetros *a, b, c* (TRI) |
| ↓ |
| **ESTIMACIÓN INICIAL (θ0)** Nivel de habilidad base (media poblacional) |
| ↓ |
| **CICLO ADAPTATIVO (LOOP)** 1\. **Selección:** Buscar ítem con Máxima Información en θ actual. 2\. **Presentación:** Candidato responde la pregunta. 3\. **Actualización:** Recalcular θ usando Máxima Verosimilitud. |
| ↓ |
| **¿CRITERIO DE PARADA CUMPLIDO?** (Error estándar \< umbral O Tiempo agotado O Límite de ítems) |
|  **NO** → Volver al Ciclo **SÍ** ↓ Continuar  |
| **RESULTADO FINAL** Generación de Score θ y reporte de competencias |
| ↓ |
| **FIN** |

## **2\. Descripción Detallada de los Componentes**

---

**2.1 Banco de Ítems Calibrados:** Es el corazón del sistema CAT. Cada pregunta debe tener valores asignados mediante la Teoría de Respuesta al Ítem (TRI):

* **Parámetro a:** Discriminación (qué tan bien diferencia entre niveles de habilidad).  
* **Parámetro b:** Dificultad (punto en el que la probabilidad de éxito es 0.5).  
* **Parámetro c:** Pseudo-adivinación (probabilidad de acertar por azar).

**2.2 Selección Dinámica:** El sistema utiliza la *Función de Información del Ítem*. Si el candidato acierta, la siguiente pregunta es más difícil; si falla, es más fácil. El objetivo es mantener al candidato en una zona de desafío óptimo para estimar su habilidad real con el menor número de preguntas posible.

**2.3 Criterios de Parada:** A diferencia de las pruebas fijas, el CAT se detiene cuando la medición es estadísticamente confiable (Error Estándar de Medición \< 0.30, por ejemplo), optimizando la experiencia del usuario.

## **3\. Consideraciones Técnicas para Antigravity**

---

* **Latencia:** Los algoritmos de Máxima Verosimilitud (MLE) deben ejecutarse en \< 500ms entre preguntas.  
* **Seguridad:** El banco de ítems debe estar cifrado en reposo para evitar filtraciones de las pruebas psicométricas.  
* **Escalabilidad:** El motor de cálculo debe ser capaz de procesar múltiples sesiones CAT simultáneas sin degradar el rendimiento del ATS.