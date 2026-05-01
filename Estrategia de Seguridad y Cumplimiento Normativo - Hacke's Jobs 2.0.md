# **Estrategia de Seguridad y Cumplimiento Normativo: Hacke's Jobs 2.0**

*Protocolos de Protección de Datos y Estándares de Compliance para el SaaS*

## **1\. Arquitectura de Seguridad por Capas**

---

La seguridad se implementa bajo un modelo de **Defensa en Profundidad**, asegurando que la información de candidatos y empresas esté protegida en cada punto de contacto.

| Capa | Tecnología / Protocolo | Propósito |
| :---- | :---- | :---- |
| **Transporte** | TLS 1.3 / HSTS | Cifrado de datos en tránsito entre el navegador y el servidor. |
| **Aplicación** | OAuth2 / OpenID Connect | Autenticación segura y gestión de identidades (SSO). |
| **Datos** | AES-256 (En reposo) | Cifrado de bases de datos y archivos almacenados en el cloud. |
| **Infraestructura** | WAF / VPC Peering | Protección contra ataques de inyección (SQLi, XSS) y aislamiento de red. |

## **2\. Cumplimiento Legal (México y Global)**

---

Al manejar Datos Personales Sensibles (resultados psicométricos y videoentrevistas), el SaaS cumple con:

* **LFPDPPP (México):** Implementación de Avisos de Privacidad integrales, derechos ARCO automatizados y medidas de seguridad administrativas, técnicas y físicas.  
* **GDPR (Referencia):** Adopción de principios de "Privacy by Design" y minimización de datos para facilitar la expansión a mercados internacionales.  
* **NOM-035:** Herramientas para la identificación y prevención de factores de riesgo psicosocial en el trabajo.

## **3\. Gestión de Identidad y Acceso (IAM)**

---

| SISTEMA DE CONTROL DE ACCESO (RBAC) Definición de roles: Administrador, Reclutador, Cliente, Candidato. |
| :---: |
| ↓ |
| **AUTENTICACIÓN MULTIFACTOR (MFA)** Requisito obligatorio para cuentas administrativas y de empresas. |
| ↓ |
| **LOGS DE AUDITORÍA** Registro inmutable de cada acción sobre datos de candidatos para trazabilidad. |

## **4\. Protocolo de Respuesta a Incidentes**

* ---

  **Detección:** Monitoreo 24/7 mediante sistemas de detección de intrusos (IDS).  
* **Contención:** Aislamiento automático de segmentos de red afectados.  
* **Notificación:** Plan de comunicación inmediata a los titulares de los datos y autoridades competentes en caso de vulneración.