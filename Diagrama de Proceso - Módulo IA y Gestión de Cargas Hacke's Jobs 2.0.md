# **Diagrama de Proceso: IA y Gestión de Cargas \- Hacke's Jobs 2.0**

*Documento Técnico para Integración con Antigravity*

## **1\. Flujo de Procesamiento de IA (Pipeline NLP)**

---

| Etapa | Acción Técnica | Resultado esperado |
| ----- | ----- | ----- |
| **1\. Ingesta** | Carga de CV (PDF/DOCX) desde el portal o LinkedIn API. | Archivo almacenado en bucket seguro S3. |
| **2\. Parsing NLP** | Extracción de texto y Reconocimiento de Entidades Nombradas (NER). | JSON estructurado (Experiencia, Educación, Skills). |
| **3\. Vectorización** | Conversión del perfil a Embeddings vectoriales (text-embedding-3). | Vector de alta dimensionalidad en Vector DB. |
| **4\. Scoring** | Cálculo de similitud coseno contra la descripción del puesto. | Ranking de candidatos por % de compatibilidad. |

## **2\. Lógica de Gestión de Cargas y Créditos (Antigravity)**

---

Para garantizar la estabilidad del SaaS, el sistema implementa un "Gatekeeper" de créditos antes de ejecutar procesos pesados de IA:

| INICIO: Solicitud de Tarea de IA (Filtro masivo o videoentrevista) |
| ----- |
| ↓ |
| **CONSULTA API ANTIGRAVITY** Verificación de créditos disponibles |
| ↓ |
|  **¿CRÉDITOS \< UMBRAL?** Notificar Administrador y pausar cola. **¿CRÉDITOS OK?** Asignar tarea a Worker de IA.  |
| ↓ |
| **MONITOREO DE CARGA (CloudWatch)** Escalado horizontal de nodos si la latencia sube. |

## **3\. Especificaciones de Infraestructura**

---

* **Worker Nodes:** Microservicios aislados en contenedores para procesos de larga duración (calificación de videoentrevistas) para no afectar el tiempo de respuesta del dashboard principal.  
* **Webhooks:** Uso de callbacks para notificar al reclutador una vez que el análisis de IA haya finalizado, evitando el polling constante al servidor.  
* **Resiliencia:** Implementación de colas (RabbitMQ o AWS SQS) para reintentar tareas en caso de fallo de red o tiempo de espera excedido en las APIs externas.