# Prompt: Auditoría, reparación y CRM de reclutadores — Hacke's Jobs Web v2

> **Instrucción para Claude Code:** lee este documento completo antes de tocar código. Trabaja por fases, en orden. No avances a la siguiente fase sin dejar la anterior verificada y funcionando.

---

## 1. Contexto del proyecto

- **Stack:** Next.js 14 (App Router) + TypeScript, Prisma 5.22 (SQLite en dev: `prisma/dev.db`), Tailwind, framer-motion, auth propia con `jose`/`bcryptjs`, integraciones con n8n vía webhooks/API.
- **Modelos Prisma existentes:** `User`, `Company`, `Candidate`, `PsychometricTest`, `TestResult`, `TestPurchase`, `Subscription`, `Cliente`, `Requisicion`, `Candidato`, `Proceso`, `CatItem`, `CatSession` (revisa `prisma/schema.prisma` para el detalle real).
- **Autenticación de APIs internas:** `src/lib/api-auth.ts`.

### ✅ Lo que SÍ funciona y NO se debe romper (crítico)

Estos flujos están conectados a n8n y operan en producción. Cualquier cambio que los toque debe ser retro-compatible:

1. **Requisición de perfiles** — `src/app/empresas/requisicion/page.tsx`, `src/app/api/requisiciones/`, `src/app/api/empresas/solicitar-talento/` y los endpoints de n8n:
   - `src/app/api/n8n/requisiciones/intake/route.ts`
   - `src/app/api/n8n/requisiciones/pendientes/route.ts`
   - `src/app/api/n8n/candidatos/upsert/route.ts`
   - `src/app/api/n8n/procesos/avanzar/route.ts`
2. **Psicometrías (incluye CAT)** — `src/app/psicometrias/**`, `src/app/api/psicometrias/**` y `src/app/api/n8n/psicometrias/resultado/route.ts`.

**Regla:** no cambies contratos (shape de request/response, headers de auth, rutas) de ningún endpoint `api/n8n/*` sin documentarlo explícitamente y sin mantener compatibilidad hacia atrás.

### ❌ Lo que está roto (reportado por el dueño; verifica y amplía la lista)

- **Subir CV como candidato** está roto (flujo en `src/app/candidatos/page.tsx` y su API correspondiente).
- **Registro de empresas** está roto (`src/app/register/page.tsx`, `src/app/api/auth/*`).
- Hay más cosas rotas y basura acumulada — la Fase 1 es precisamente encontrar todo.

---

## 2. Fase 1 — Auditoría completa (no repares todavía, solo diagnostica)

Levanta el dev server y recorre **todas** las páginas y **todos** los endpoints. Para cada uno clasifica: **FUNCIONA / ROTO / MUERTO (basura) / INCOMPLETO**.

1. Páginas a probar en navegador (todas las de `src/app/**/page.tsx`): home, vacantes, candidatos, empresas, requisición, psicometrías, blog, login, register, dashboard, admin, precios, contacto, etc.
2. Endpoints a revisar (todos los `src/app/api/**/route.ts`). Presta atención a:
   - Endpoints de prueba/basura evidentes: `api/hello`, `api/test-env`.
   - Endpoints que referencian servicios sin configurar (Stripe, Pinecone, OpenAI, Google, Redis/ioredis, nodemailer): determina cuáles se usan de verdad y cuáles son código muerto.
3. Prueba los flujos end-to-end críticos: registro de candidato + subida de CV, registro/login de empresa, creación de requisición, aplicación a vacante, compra/aplicación de psicometría.
4. Revisa archivos basura en el repo: `CAMBIOS.tmp`, `.next-dev.log`, `prisma/dev.db-journal`, `prisma/dev.db.backup-*`, `scratch/`, y cualquier componente/página huérfana sin rutas que la usen.
5. Revisa el estado de Prisma: si `schema.prisma` y `prisma/migrations/` están sincronizados con `dev.db`.

**Entregable de la fase:** escribe `docs/AUDITORIA-REPARACION.md` con la tabla completa de hallazgos (ruta, estado, causa raíz si está roto, acción propuesta). Preséntame el resumen antes de pasar a Fase 2.

---

## 3. Fase 2 — Limpieza de basura

Con base en la auditoría:

1. Elimina endpoints de prueba (`api/hello`, `api/test-env`) y todo código muerto confirmado (páginas huérfanas, componentes sin uso, dependencias de `package.json` que nadie importa).
2. Elimina archivos temporales del repo y agrégalos a `.gitignore` (`*.tmp`, `*.log`, `dev.db-journal`, `dev.db.backup-*`).
3. **No borres nada relacionado con n8n, requisiciones, procesos, candidatos o psicometrías** aunque parezca sin uso — pregunta primero.
4. Verifica que `npm run build` pasa limpio después de la limpieza.

---

## 4. Fase 3 — Reparación de flujos rotos

Repara en este orden de prioridad:

1. **Subida de CV de candidato** — el flujo completo: formulario, validación, almacenamiento del archivo (define una estrategia real: filesystem en dev + Vercel Blob o similar en prod), registro en base de datos y confirmación al usuario.
2. **Registro y login de empresas** — alta de cuenta, hash de contraseña, sesión con cookie (`jose`), y redirección al dashboard correcto según rol.
3. **Todo lo demás marcado como ROTO en la auditoría**, de mayor a menor impacto en el negocio.

Reglas:

- Cada reparación se verifica en el navegador (flujo completo, no solo que compile) antes de darla por terminada.
- Maneja errores con mensajes claros al usuario (nada de pantallas en blanco o errores silenciosos).
- Valida inputs con `zod` en cada endpoint que toques.

---

## 5. Fase 4 — CRM de reclutadores (funcionalidad nueva)

Construir un CRM interno para que los **reclutadores** de Hacke's Jobs trabajen dentro de la plataforma.

### Referencia visual

En `docs/referencias-crm/` hay **capturas de pantalla de un CRM con IA de otra empresa** que usamos como referencia de UX y funcionalidad. **Lee todas las imágenes de esa carpeta antes de diseñar.** No copies el branding: replica los patrones de interfaz y funcionalidad adaptados a la identidad visual actual de Hacke's Jobs (revisa `src/components/motion` y la home como referencia de estilo).

### Alcance funcional mínimo

1. **Autenticación de reclutadores** — rol `RECLUTADOR` (extiende el modelo `User` o crea uno nuevo, según lo que sea más limpio con el schema actual), login con sesión, rutas protegidas bajo `/crm` o `/dashboard/crm`.
2. **Gestión de candidatos** — alta manual de candidatos por el reclutador (con CV adjunto), listado con búsqueda y filtros (puesto, estado, requisición asignada), vista de detalle con historial.
3. **Pipeline de procesos** — tablero por etapas (usa/extiende el modelo `Proceso` existente) donde el reclutador mueve candidatos entre etapas de una requisición.
4. **Seguimientos automáticos** — recordatorios y acciones programadas por candidato (ej. "contactar en 3 días", "enviar psicometría", "pedir documentos"). Los disparos automáticos deben integrarse con n8n vía los endpoints `api/n8n/*` existentes o nuevos endpoints con el mismo patrón de auth (`src/lib/api-auth.ts`).
5. **Vínculo con lo existente** — los candidatos que suben su CV desde la web pública y las requisiciones que llegan desde `empresas/requisicion` deben aparecer en el CRM automáticamente; no crees silos de datos paralelos.

### Reglas de diseño técnico

- Reutiliza los modelos `Candidato`, `Requisicion`, `Proceso`, `Cliente` existentes; migra el schema con `prisma migrate` (nunca edites `dev.db` a mano).
- Server Components por defecto; client components solo donde haya interactividad real.
- La IA (matching, resúmenes de CV, sugerencias de seguimiento) es **fase posterior**: deja los puntos de extensión listos (campos, endpoints), pero primero entrega el CRM funcional sin IA.

---

## 6. Reglas generales de trabajo

1. **Commits por fase**, con mensajes descriptivos en español. No mezcles limpieza con features en el mismo commit.
2. **No toques producción ni claves**: si falta una variable de entorno, documéntala en `.env.example` y avísame; no inventes valores.
3. **Verificación real**: cada flujo entregado debe probarse en el navegador de punta a punta. "Compila" no es "funciona".
4. **Ante la duda de borrar algo conectado a n8n, pregunta primero.**
5. Al terminar cada fase, dame un resumen corto: qué se hizo, qué se verificó y qué queda pendiente.
