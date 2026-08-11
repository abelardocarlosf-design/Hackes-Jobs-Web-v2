# Auditoría de reparación — Hacke's Jobs Web v2

**Fecha:** 2026-08-10
**Fase:** 1 diagnóstico · 2 limpieza · 3 reparación · 4 CRM de reclutadores — **todas completadas**
**Método:** servidor de desarrollo levantado en `localhost:3000`; barrido de las 20 páginas públicas y 14 endpoints GET; pruebas end-to-end reales de registro (empresa y candidato); revisión de logs del servidor; `tsc --noEmit`; inspección del índice de git y de la base de datos.

---

## 0. Resumen ejecutivo

La web **está en mejor estado del que se creía**. El registro de empresas y de candidatos funciona correctamente de punta a punta, y las 20 páginas públicas responden 200. Los dos problemas reportados no eran lo que parecían:

- **"Registro de empresa roto"** — el flujo funciona en local (201 → sesión → dashboard). Lo que sí está roto es el envío de correo en producción (ver H-03), que es probablemente lo que se percibe como fallo.
- **"Subida de CV roto"** — la funcionalidad **no existe**. No hay formulario, ni endpoint, ni almacenamiento. El campo `Candidate.cvUrl` está en el schema pero ningún archivo del proyecto lo lee ni lo escribe.

En cambio, la auditoría encontró **cuatro secretos reales publicados en GitHub**, que es el problema más grave y urgente del proyecto.

| Severidad | Cantidad | Hallazgos |
|---|---|---|
| 🔴 Crítico | 3 | H-01, H-02, H-03 |
| 🟠 Alto | 3 | H-04, H-05, H-06 |
| 🟡 Medio | 4 | H-07, H-08, H-09, H-10 |
| ⚪ Basura | 5 | H-11 … H-15 |

### Estado actual de cada hallazgo

| # | Estado | Detalle |
|---|---|---|
| H-01 | ⚠️ **Parcial — requiere acción de Abelardo** | Secretos sacados del código y del índice de git. **El historial de git los conserva: la rotación de credenciales sigue pendiente y es obligatoria.** |
| H-02 | ✅ Resuelto | `api/test-env` eliminado (verificado: 404). |
| H-03 | ✅ Resuelto en código | `mailer.ts` lee de `process.env`. **Falta configurar `SMTP_*` en Vercel.** |
| H-04 | ✅ **Construido y verificado** | Subida de CV completa. Ver sección 11. |
| H-05 | ✅ **Reparado y verificado** | Ver sección 8. |
| H-06 | ⬜ Bloqueado | Requiere revisar los workflows en n8n antes de tocar código. |
| H-07 / H-08 | ✅ **Resueltos** | CRM construido sobre la API existente; el silo de datos quedó cerrado. Ver sección 13. |
| H-09 | ✅ Reevaluado y corregido | Ver sección 12: el diagnóstico original era impreciso; el riesgo real era otro. |
| H-10 | ✅ Resuelto | `PUBLIC_API_ROUTES` eliminado del middleware. |
| H-11 / H-12 | ✅ Resuelto | `api/hello` y `api/test-env` eliminados. |
| H-13 / H-14 | ✅ Resuelto | Temporales eliminados y cubiertos por `.gitignore`. El respaldo `prisma/dev.db.backup-*` **se conservó en disco** (es un punto de recuperación, no basura); solo se ignoró en git. |
| H-15 | ✅ Resuelto | `.env.example` reescrito en UTF-8 con todas las claves. |

---

## 1. 🔴 CRÍTICO — Atender antes que cualquier otra cosa

### H-01 · Credenciales reales publicadas en el repositorio de GitHub

El repositorio `abelardocarlosf-design/Hackes-Jobs-Web-v2` tiene **cuatro secretos reales commiteados y subidos**:

| Secreto | Ubicación | Estado |
|---|---|---|
| Contraseña SMTP de `abelardo.carlos@hackesjobs.com` | `src/lib/mailer.ts:9` — **hardcodeada en el código** | En HEAD, commit `f868b1a` |
| `SMTP_USER` + `SMTP_PASSWORD` | `.env.local.txt` | Rastreado por git |
| `DEEPSEEK_API_KEY` | `.env.local.txt` | Rastreado por git |
| `STRIPE_SECRET_KEY` (`sk_test_…`) | `.env` | Rastreado por git |

El `.gitignore` sí lista `.env*.local` y `.env.local.txt`, pero **`.gitignore` no tiene efecto sobre archivos que ya fueron añadidos al índice**. Por eso siguen rastreados.

La clave de Stripe es de modo test (`sk_test_`), lo que baja su severidad. Las credenciales de correo y la de DeepSeek son de producción.

**Acción requerida — la debe hacer Abelardo, no el agente:**
1. **Rotar ahora** la contraseña del buzón `abelardo.carlos@hackesjobs.com` en Hostinger. Está expuesta públicamente y permite enviar correo en nombre de la empresa.
2. Revocar y regenerar la API key de DeepSeek.
3. Rotar la clave de Stripe de test.
4. Verificar si el repositorio de GitHub es público o privado. Si es público, la urgencia es máxima.

**Acción del agente (fase 2):** sacar los secretos del código y del índice de git (`git rm --cached`), mover todo a variables de entorno, y documentar las claves en `.env.example`. Nota: esto limpia el estado actual pero **no borra el historial** — por eso la rotación de credenciales es obligatoria de todos modos.

### H-02 · `/api/test-env` expone información del servidor sin autenticación

`src/app/api/test-env/route.ts` es un endpoint público de depuración que devuelve la API key de DeepSeek parcialmente enmascarada y la ruta absoluta del servidor:

```json
{"status":"ok","isLoaded":true,"maskedKey":"sk-3...995f","cwd":"C:\\Users\\santin\\Documents\\..."}
```

**Acción:** eliminar el archivo completo en la fase 2.

### H-03 · El correo se rompe en producción (causa raíz del "registro roto")

Las credenciales SMTP viven en **`.env.local.txt`**, un nombre de archivo que **Next.js no carga**. Solo funciona porque `src/app/api/empresas/solicitar-talento/route.ts` implementa un parser propio que lee ese archivo del disco en tiempo de ejecución (líneas 29-61).

En Vercel **ese archivo no existe en el disco**, por lo que:
- `/api/empresas/solicitar-talento` (formulario `LeadForm`) devuelve **500 "Faltan credenciales de correo"** en producción.
- `src/lib/mailer.ts` no usa variables de entorno en absoluto — tiene las credenciales quemadas, así que "funciona" pero por la razón equivocada.

**Acción:** unificar en `SMTP_*` como variables de entorno reales, cargarlas con `process.env`, eliminar el parser manual de disco y configurarlas en Vercel.

---

## 2. 🟠 ALTO — Funcionalidad rota o inexistente

### H-04 · La subida de CV no existe (no está rota)

No hay ningún formulario de carga de CV en el proyecto. Verificado:
- `/candidatos` (`src/app/candidatos/page.tsx`) es una landing de marketing; sus dos botones llevan a `/register?role=candidate` y `/vacantes`.
- `grep` de `cvUrl` en todo `src/`: **cero coincidencias**. El campo del schema está huérfano.
- No existe endpoint de subida, ni manejo de `FormData`/`multipart`, ni estrategia de almacenamiento.

**Acción (fase 3):** construir la funcionalidad desde cero. Decisión pendiente: almacenamiento en Vercel Blob (recomendado, ya que el proyecto despliega en Vercel) vs. filesystem local. Debe escribir en `Candidate.cvUrl` y, para el CRM, también alimentar el modelo `Candidato`.

### H-05 · La generación de PDF de bienvenida falla siempre

En cada registro de candidato el servidor lanza:

```
[PDF Email Error]: TypeError: a.Component is not a constructor
    at node_modules/@react-pdf/reconciler/lib/reconciler-23.js
    at renderToBuffer (@react-pdf/renderer)
    at POST (src/app/api/auth/register/route.tsx:121)
```

`@react-pdf/renderer@4.5.1` trae un reconciler incompatible con React 18 al ejecutarse en contexto RSC. El error está atrapado en un `try/catch`, así que el registro **sí se completa** (201) — pero el PDF y su correo **nunca se envían**. Falla en silencio desde que se implementó.

**Acción:** decidir entre (a) actualizar/reemplazar la librería de PDF, o (b) eliminar la función si ya no aporta valor. Requiere confirmación de Abelardo sobre si ese PDF se sigue queriendo.

### H-06 · Los webhooks de alta de usuario apuntan a workflows inexistentes

Cada registro dispara dos webhooks que devuelven **404**:

```
[Webhook] ⚠️ crear-usuario-hj respondió 404
[Webhook] ⚠️ company-lead respondió 404
```

Destino: `https://hackesjobs-n8n.3hrktu.easypanel.host/webhook/{evento}`. Los workflows `crear-usuario-hj` y `company-lead` no existen o están despublicados en n8n. Ningún registro nuevo está llegando a n8n.

**Acción:** verificar en n8n si esos workflows deben existir. Si sí, publicarlos; si no, quitar las llamadas. **No es un cambio de código unilateral** — depende de qué haya en n8n.

---

## 3. 🟡 MEDIO — Deuda técnica y huecos

### H-07 · El CRM ya tiene backend, pero es inalcanzable

Existe una capa de API de CRM **bien construida y sin usar** (archivos sin rastrear en git):

`/api/clientes`, `/api/requisiciones`, `/api/candidatos`, `/api/procesos` (+ sus rutas `[id]`)

Calidad: validación con `zod`, paginación, filtros, búsqueda, control de rol vía `requireAuth(request, ['admin','recruiter'])` y bloqueo de creación sin consentimiento LFPDPPP. Es una base sólida para la fase 4.

Problemas que la hacen inservible hoy:
1. **No hay ninguna UI** que la consuma.
2. **No se pueden crear usuarios reclutadores**: `/api/auth/register` solo acepta `role: 'company' | 'candidate'` (el enum de zod los limita). Existe 1 usuario `recruiter` en la base, creado a mano.
3. Las cuatro tablas están **vacías**: `cliente: 0`, `requisicion: 0`, `candidato: 0`, `proceso: 0`.

### H-08 · Doble modelo de datos sin puente

Hay dos universos de datos paralelos que nunca se tocan:

| Universo SaaS (con login) | Universo agencia/CRM (sin login) |
|---|---|
| `User`, `Company`, `Candidate` | `Cliente`, `Requisicion`, `Candidato`, `Proceso` |
| 1 admin, 1 candidate, 3 company, 1 recruiter | todas vacías |

Además, el formulario público de requisición (`/api/webhooks/perfilador`) **no escribe en la base de datos** — solo hace de proxy hacia n8n. Por eso `requisicion: 0` pese a que el flujo funciona. La fase 4 debe cerrar este puente, tal como pide el prompt ("no crees silos de datos paralelos").

### H-09 · `/admin/blog` no está protegido por el middleware

El middleware (`src/middleware.ts`) solo cubre `/dashboard/:path*`, `/login` y `/register`. La ruta real de administración es `/admin/blog`, que **responde 200 sin sesión**.

Mitigación existente: la página tiene una verificación en cliente y las APIs que consume (`/api/admin/users`, `/api/admin/subscribers`) sí devuelven 401. El dato está protegido; la carcasa no. Riesgo moderado, pero debe alinearse.

Relacionado: el middleware protege `/dashboard/admin`, ruta que **no existe** en el proyecto.

### H-10 · Código muerto en el middleware

`PUBLIC_API_ROUTES` (líneas 13-18) se declara y nunca se usa: el `matcher` no incluye `/api/*`, así que la lista no tiene efecto. Induce a error a quien lea el archivo creyendo que las APIs pasan por ahí.

---

## 4. ⚪ BASURA — Limpieza de fase 2

| # | Elemento | Estado | Acción |
|---|---|---|---|
| H-11 | `src/app/api/hello/route.ts` | Endpoint de prueba, responde `"Hello from Hackes Jobs API"` | Eliminar |
| H-12 | `src/app/api/test-env/route.ts` | Fuga de datos (ver H-02) | Eliminar |
| H-13 | `CAMBIOS.tmp` | Prompt de auditoría viejo, sin rastrear, codificación corrupta | Eliminar + `.gitignore` |
| H-14 | `.next-dev.log`, `prisma/dev.db-journal`, `prisma/dev.db.backup-20260701194746` | Temporales sin rastrear | Eliminar + `.gitignore` |
| H-15 | `.env.example` | **Codificado en UTF-16** (ilegible como texto normal) y desactualizado: le faltan `DATABASE_URL`, `JWT_SECRET`, `N8N_API_KEY`, `WEBHOOK_*`, `SMTP_*`, `DEEPSEEK_API_KEY` | Reescribir en UTF-8 completo |

`scratch/` contiene documentos de auditoría de psicometrías y scripts de conversión de logos. **No es basura evidente** — se deja intacto salvo instrucción contraria.

---

## 5. ✅ Verificado como FUNCIONAL (zona intocable)

Todo esto se probó y responde correctamente. No debe romperse:

| Área | Evidencia |
|---|---|
| **Requisición de perfiles** | `/api/webhooks/perfilador` — proxy a n8n `wf-002-requisicion` con clave de idempotencia, timeout de 15 s y manejo de errores por código. Código de buena calidad. |
| **Psicometrías** | 9 tests registrados en `psychometryDispatcher` (WF-001…WF-009) con contrato v1, cola offline en `localStorage` y reintentos. Base de datos: 12 tests, 43 ítems CAT, 46 sesiones CAT — en uso real. |
| **Endpoints n8n** | Los 5 `/api/n8n/*` autentican bien: 401 sin `x-api-key`, 200 con la clave correcta (`N8N_API_KEY` sí está en `.env.local`). |
| **Registro y login** | Empresa: 201 → cookie `hj_token` → `/api/auth/me` 200 → `/dashboard` 200. Candidato: 201. Ambos verificados en vivo. |
| **Páginas públicas** | Las 20 responden 200 (o 307 correcto en rutas protegidas). |
| **Blog** | 200, acentos correctos. *(Una sospecha inicial de doble codificación UTF-8 resultó ser un artefacto de la consola de PowerShell, no un bug real.)* |
| **TypeScript** | `tsc --noEmit` pasa sin errores. |

---

## 6. Plan propuesto para las fases siguientes

**Fase 2 — Limpieza + seguridad** (requiere autorización, incluye borrados)
1. Purgar secretos: `git rm --cached .env .env.local.txt`, quitar credenciales de `mailer.ts`.
2. Eliminar `api/hello`, `api/test-env`, `CAMBIOS.tmp`, logs y backups temporales.
3. Reescribir `.env.example` en UTF-8 con todas las claves.
4. Ampliar `.gitignore` (`*.tmp`, `*.log`, `dev.db-journal`, `dev.db.backup-*`).
5. Limpiar código muerto del middleware.
6. Verificar que `npm run build` pasa.

**Fase 3 — Reparación**
1. Unificar SMTP en variables de entorno (arregla H-03 en producción).
2. Construir la subida de CV desde cero (H-04).
3. Resolver el PDF de bienvenida (H-05) — requiere decisión de negocio.
4. Alinear la protección de `/admin/blog` (H-09).
5. Los webhooks 404 (H-06) requieren revisión en n8n antes de tocar código.

**Fase 4 — CRM de reclutadores**
Aprovechar la API existente (H-07). Trabajo pendiente: rol `recruiter` en el registro/alta, UI bajo `/dashboard/crm` (listado, detalle, pipeline por etapas), seguimientos automáticos, y el puente de datos que elimine el silo de H-08. Las 18 capturas de referencia están en `docs/referencias-crm/`.

---

## 8. Reparación de H-05 — el PDF de bienvenida

Tres fallos encadenados, cada uno oculto detrás del anterior:

1. **El PDF no se generaba.** `next.config.mjs` tenía `transpilePackages: ['@react-pdf/renderer']`, lo que fuerza a la librería a pasar por el bundler dentro de la capa RSC, donde `react` resuelve al build de servidor (sin `React.Component`). Cambiado a `experimental.serverComponentsExternalPackages`.
2. **Credenciales muertas.** Al arreglar lo anterior emergió `535 authentication failed`: la contraseña quemada en `mailer.ts` era de la cuenta `@hackesjobs.com`, pero la cuenta que existe y autentica es `@hackesjobs.com.mx`. `mailer.ts` reescrito para leer de `process.env`, sin secretos en el código.
3. **El `#` de la contraseña.** Ya con variables de entorno seguía fallando: la contraseña contiene `#`, y en un `.env` el `#` inicia un comentario, así que dotenv la truncaba. Se resolvió entrecomillándola en `.env.local`.

> **Regla general que se desprende de esto:** cualquier valor con `#` en un archivo `.env` debe ir entre comillas dobles. Esto explica también por qué `/api/empresas/solicitar-talento` funcionaba: tiene un parser propio que no interpreta comentarios. Funcionaba por accidente.

**Verificación:** PDF generado de 2541 bytes con cabecera `%PDF-`, correo entregado (`[PDF Email] Correo de alta enviado`), `npm run build` en verde y sin regresiones en registro de empresa, páginas públicas ni autenticación n8n.

## 9. Limpieza de fase 2 — qué se hizo

- Eliminados `src/app/api/hello/` y `src/app/api/test-env/` (verificado: ambos 404).
- `git rm --cached .env .env.local.txt` — fuera del índice, intactos en disco.
- `.gitignore` ampliado: `.env`, `*.log`, `*.tmp`, `prisma/*.db-journal`, `prisma/*.db.backup-*`.
- Eliminados `CAMBIOS.tmp` y `.next-dev.log`.
- `PUBLIC_API_ROUTES` (código muerto) eliminado del middleware.
- **6 dependencias sin uso desinstaladas:** `@pinecone-database/pinecone`, `@google/generative-ai`, `ioredis`, `@ai-sdk/openai`, `ai`, `@stripe/stripe-js`. Se conservaron `stripe` (usado en `src/lib/stripe.ts`), `openai` (usado en `api/disc/analyze`) y `dotenv` (usado en `scratch/mint-test-token.mjs`).

## 11. Subida de CV (H-04) — construida desde cero

No existía nada: no había formulario, endpoint, almacenamiento ni escritura a `cvUrl`.

**Piezas nuevas**

| Archivo | Qué hace |
|---|---|
| `src/lib/cv-storage.ts` | Guarda, lee y borra CVs. Dos backends: carpeta local `storage/` en desarrollo, Vercel Blob **privado** en producción. |
| `src/app/api/candidatos/cv/route.ts` | Endpoint público de subida. Valida tipo, tamaño y consentimiento; alimenta el CRM. |
| `src/app/api/candidatos/[id]/cv/route.ts` | Descarga autenticada. Único camino de acceso al archivo. |
| `src/components/CVUploadForm.tsx` | Formulario en `/candidatos`, sección `#enviar-cv`. |
| `prisma/migrations/20260810_candidato_cv/` | Campos `cvKey`, `cvNombreArchivo`, `cvSubidoEn` en `Candidato`. |

**Decisiones de diseño**

- **Los CVs no viven en `public/`.** Ahí quedarían accesibles por URL sin autenticación. Son dato personal bajo LFPDPPP, así que se guardan fuera del árbol servido y solo salen por el endpoint autenticado, con nombre UUID impredecible y `Cache-Control: no-store, private`.
- **Alimenta el CRM directamente.** Cada envío crea o actualiza un `Candidato` con `fuente: 'formulario'`. No se duplica por persona: si el correo ya existe, se actualiza la ficha. Si además tiene cuenta en la plataforma, se refleja en su `Candidate.cvUrl`. Esto ataca de raíz el silo descrito en H-08.
- **Al reemplazar un CV se borra el anterior.** Detectado durante las pruebas: sin esto se acumulaban archivos huérfanos, que además es retención innecesaria de dato personal.
- **Producción necesita `BLOB_READ_WRITE_TOKEN`.** El filesystem de Vercel es de solo lectura salvo `/tmp`, que es efímero. Sin ese token las subidas se perderían en producción — es el mismo patrón de error que H-03.

**Verificación** (todo probado en el navegador con archivos reales)

| Caso | Resultado |
|---|---|
| Subida válida desde el formulario | 201, archivo en disco, ficha creada en el CRM |
| Descarga sin sesión | 401 |
| Descarga con rol `recruiter` | 200, `application/pdf`, contenido íntegro |
| Descarga con rol `candidate` | 403 |
| Archivo `.exe` | 415 |
| Sin aceptar privacidad | 400 |
| Correo inválido / sin archivo | 400 |
| Mismo correo dos veces | 200, actualiza sin duplicar y borra el CV anterior |

## 12. Acceso administrativo (H-09) — corrección del diagnóstico

El hallazgo original decía que `/admin/blog` debía protegerse en el middleware. **Al implementarlo se vio que era incorrecto:** esa página *es* el formulario de login, así que bloquearla impediría iniciar sesión. Los datos ya estaban protegidos server-side (`/api/admin/*` valida la cookie `hj_admin_token`).

El riesgo real estaba al lado, en `src/app/api/admin/login/route.ts`: las credenciales tenían **valores por defecto** (`admin` / `hackesjobs2025`). Si `BLOG_ADMIN_USER` o `BLOG_ADMIN_PASS` no estaban configuradas en el servidor, el panel quedaba abierto con credenciales públicas y adivinables. Ahora **falla cerrado**: sin configuración devuelve 503 y no autentica a nadie.

Pendiente menor: el login administrativo no tiene límite de intentos.

## 13. CRM de reclutadores (fase 4)

Construido sobre la API que ya existía (H-07), que solo carecía de interfaz y de forma de crear reclutadores.

**Referencia.** Se leyeron las capturas de `docs/referencias-crm/` (el CRM "Hormia AI"). Se replicaron sus patrones de interfaz —barra superior con cajón lateral, migas de pan, encabezado con borde de acento, acción primaria arriba a la derecha, tablero de pipeline con contadores por etapa, listas con búsqueda y fichas de estado— con la identidad de Hacke's Jobs (negro + naranja en lugar del azul de la referencia).

**Rutas** (todas bajo `/crm`, protegidas por middleware para `admin` y `recruiter`)

| Ruta | Contenido |
|---|---|
| `/crm` | Panel: contadores por etapa, cifras de cartera, seguimientos vencidos, últimos candidatos |
| `/crm/candidatos` | Listado con búsqueda por nombre/correo/teléfono/puesto, filtro por etapa y por "solo con CV", paginación |
| `/crm/candidatos/[id]` | Ficha: pipeline, seguimientos, contacto, expediente, descarga de CV, estado LFPDPPP |
| `/crm/candidatos/nuevo` | Alta manual con CV opcional y selector de fuente |
| `/crm/requisiciones` | Cartera de vacantes filtrable por estatus |
| `/crm/requisiciones/[id]` | Tablero de pipeline por columnas + datos del puesto y contacto del cliente |
| `/crm/seguimientos` | Bandeja de tareas: pendientes, vencidos, completados |

**Modelo nuevo:** `Seguimiento` (`prisma/migrations/20260810b_seguimientos/`) — tipo, nota, fecha límite, completado, y bandera `automatico`.

**Los seguimientos automáticos** son la pieza que pedía el encargo. Al mover un candidato de etapa, el backend agenda solo la siguiente tarea según `SEGUIMIENTO_AUTOMATICO` en `src/lib/crm.ts`: pasar a Filtro CV agenda una llamada a 2 días; a Psicometría, enviar la liga a 1 día; a Entrevista, agendarla a 3 días; a Terna, pedir documentos a 2 días. No se duplica si ya hay una tarea abierta del mismo tipo, para que mover una tarjeta ida y vuelta no llene la bandeja. Además se dispara el webhook `proceso-etapa-cambiada` para que n8n mande los mensajes al candidato.

**Decisiones**

- **El tablero se mueve con flechas, no arrastrando.** Es más confiable en móvil y accesible por teclado, que es como el reclutador trabaja en planta.
- **`src/lib/crm.ts` no puede tocar APIs de servidor.** Lo importan componentes de cliente; la sesión vive aparte en `crm-session.ts`. Se detectó al probar en el navegador (ver abajo).
- **La fuente del candidato solo la fija un reclutador autenticado.** Un envío público siempre queda como `formulario`: si no, cualquiera podría hacer pasar su envío por un referido interno.

**Verificación** (con sesión real de reclutador en el navegador)

| Caso | Resultado |
|---|---|
| `/crm` sin sesión | 307 a login |
| `/crm` con rol `candidate` | 307 a dashboard |
| `/crm` con rol `recruiter` | 200 |
| Panel | Contadores correctos contra la base |
| Mover etapa en el tablero | Candidato cambia de columna y se agenda el seguimiento automático |
| Agendar seguimiento manual | Creado y visible en ficha y bandeja |
| Completar seguimiento | Sale de pendientes, contador de vencidos baja |
| Búsqueda de candidatos | Filtra correctamente |

## 14. Segunda pasada: herramientas de la referencia y flujo de candidatos

Tras revisar las 18 capturas completas se implementó lo que faltaba.

**Match y clasificación de calidad.** `Proceso.scoreMatch` ya no está vacío: se calcula al asignar un candidato y se puede recalcular en masa desde la requisición ("Recalcular match" → `POST /api/requisiciones/[id]/evaluar`). El cálculo es **por reglas, no por IA**: puesto (45), zona (25), expediente con CV (15) y experiencia (15). Es determinista y auditable — el reclutador puede entender de dónde sale el número. Se clasifica en Sobresaliente (≥70) / Potencial (≥40) / Descartable, con chips de reparto en la requisición igual que la referencia.

> **Bug encontrado al probar:** la normalización partía `"producción"` en `produccio` + `n` porque la tilde se sustituía por espacio, así que escribir con o sin acento dejaba de coincidir — justo el caso normal al capturar en español. Corregido filtrando por punto de código (rango U+0300–U+036F). Un candidato pasó de 38% a 60% con el arreglo.

**Flujo de candidatos, completado**

| Antes | Ahora |
|---|---|
| Ficha de solo lectura | Edición en línea de todos los campos |
| Sin forma de borrar | Borrado con confirmación, que **también elimina el CV** del almacenamiento (LFPDPPP) |
| CV solo desde el formulario público | Subir, reemplazar, descargar y quitar desde la ficha |
| Sin LinkedIn, experiencia ni notas | Campos añadidos (migración `20260810c_candidato_perfil`) |
| Alta de uno en uno | Carga masiva de hasta 20 CVs |

**Otras piezas de la referencia**

- **Carga masiva** (`/crm/candidatos/carga`): crea una ficha por archivo usando el nombre del fichero. **No extrae datos del PDF** — la referencia lo hace con un modelo; aquí la captura la hace una persona. Las fichas quedan marcadas sin consentimiento LFPDPPP y la pantalla lo advierte, para que nadie las meta a un proceso sin completarlas.
- **Bolsa de talento**: filtro de candidatos sin vacante asignada, como el "Talento" de la referencia.
- **Menú de avatar** con Mi perfil / Cerrar sesión, y **`/crm/perfil`** con datos de cuenta y **cambio de contraseña** (`POST /api/auth/password`, exige la contraseña actual).
- **Tiempo transcurrido** ("hace 3 días") y **descarga rápida de CV** en listados y tablero.

**Verificación**

| Caso | Resultado |
|---|---|
| Match de perfil alineado / no alineado | 100% Sobresaliente / 0% Descartable |
| Recalcular tras editar datos | 38% → 60%, un proceso actualizado |
| Editar ficha desde la interfaz | Campos guardados y reflejados |
| Carga masiva (2 PDF + 1 `.exe`) | 2 fichas creadas, `.exe` rechazado con motivo |
| Borrar candidato | Ficha y archivo de CV eliminados del disco |
| Cambio de contraseña | Contraseña actual errónea 403 · corta 400 · igual a la actual 400 · válida 200 y login con la nueva 200 |
| Bolsa de talento | Muestra solo los candidatos sin proceso |

**Fuera de alcance, deliberadamente:** los planes de suscripción y el portal de pagos Stripe de la referencia. Hormia AI es un SaaS que se vende a reclutadores; el CRM de Hacke's Jobs es una herramienta interna de la agencia, así que cobrar por asientos no aplica. Tampoco se implementó la extracción de datos del CV con IA ni la búsqueda semántica.

## 10. Notas de la auditoría

- **Efecto secundario:** la prueba del formulario `LeadForm` envió un correo real de "Solicitud de Talento" a `abelardo.carlos@hackesjobs.com.mx` con datos ficticios ("ACME QA"). Puede ignorarse.
- Se crearon 3 usuarios de prueba durante el diagnóstico y **se eliminaron después**; la base quedó en su estado original (1 admin, 1 candidate, 3 company, 1 recruiter).
- **No se disparó ninguna psicometría de prueba** contra n8n, para no contaminar producción con resultados falsos ni generar correos a clientes. Ese módulo se verificó por código.
