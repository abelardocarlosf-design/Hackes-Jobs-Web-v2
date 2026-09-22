# Pendientes totales — Hacke's Jobs Web v2

**Fecha:** 2026-09-18
**Método:** estado real de git (rama vs `origin/main`), sondas HTTP contra
`https://www.hackesjobs.com.mx`, lectura del código que hay publicado en `main`,
`npm run build` y `tsc --noEmit` locales, y reconciliación de
`docs/AUDITORIA-REPARACION.md` con `docs/CHECKLIST-DESPLIEGUE.md`.

---

## El diagnóstico, en una frase

**Producción no corre este código.** Todo el trabajo de las sesiones anteriores
—CRM, Postgres, portal, mi-empresa, subida de CV, endpoints de n8n— vive en la
rama `feat/crm-reclutadores-y-reparaciones`, cuyo PR (#1) lleva **abierto desde
el 12 de agosto sin mergear**. Lo que hay desplegado es `main`, que sigue siendo
la versión de antes de la reparación.

Por eso «el CRM no funciona»: no es que falle, es que **no existe en el sitio
publicado**.

### Lo que devuelve el sitio ahora mismo

| Ruta | Producción | Motivo |
|---|---|---|
| `/crm`, `/portal`, `/mi-empresa` | **404** | No existen en `main` |
| `POST /api/auth/login` | **500** | La base de datos está rota (ver P0-2) |
| `/api/n8n/*` (los 5) | **404** | No existen en `main` |
| `/api/test-env`, `/api/hello` | **200** | Endpoints de depuración vivos |
| `/`, `/blog`, `/vacantes`, `/psicometrias` | 200 | Son páginas estáticas o de archivo |

Y al revés: **la rama está sana**. `tsc --noEmit` pasa sin errores y
`npm run build` compila limpio contra la rama `dev` de Neon (73 páginas). El
problema no es de código; es que nunca se publicó.

---

## P0 · Crítico — atender antes que nada

| # | Pendiente | Evidencia |
|---|---|---|
| **P0-1** | **El panel de administración de producción está abierto con credenciales públicas.** `src/app/api/admin/login/route.ts` en `main` cae a `admin` / `hackesjobs2025` si faltan `BLOG_ADMIN_USER`/`BLOG_ADMIN_PASS` — y la fase 3 §22 de la guía confirma que **esas variables nunca se cargaron en Vercel**. Con esa pareja cualquiera obtiene una cookie `hj_admin_token` firmada con `role:'admin'`. | Endpoint vivo (`405` a GET, o sea acepta POST). Código en `main`. |
| **P0-2** | **La base de datos de producción está caída.** `main` declara `provider = "sqlite"` en `prisma/schema.prisma`, pero Vercel sirve una `DATABASE_URL` de Neon (Postgres). Todo lo que toca base falla: login, registro, dashboard, altas de newsletter, usuarios. | `POST /api/auth/login` → `500 {"success":false,"message":"Error interno del servidor"}` |
| **P0-3** | **`/api/test-env` sigue expuesto en producción** y devuelve la ruta del servidor y la clave de DeepSeek enmascarada. `/api/hello` también. Ambos se borraron en la rama; en `main` siguen. | `GET /api/test-env` → `200 {"cwd":"/vercel/path0",…}` |
| **P0-4** | **La contraseña SMTP sigue quemada en el código publicado** (`src/lib/mailer.ts` de `main`, en claro). Ya está rotada en Hostinger, así que el daño hoy es el inverso: **en producción no sale ni un correo**. | Lectura directa del archivo en `origin/main` |
| **P0-5** | **`JWT_SECRET` tiene un valor por defecto escrito en el repositorio** (`src/lib/jwt.ts` y `src/middleware.ts` de `main`). Hoy está mitigado porque la variable sí existe en Vercel; el día que falte, cualquiera se firma un token de admin. | Código en `main` |
| **P0-6** | **Los 5 endpoints `api/n8n/*` no están desplegados.** La auditoría los daba por «zona intocable de producción», pero sólo existen en la rama. Si algún workflow de n8n los llama, lleva meses recibiendo 404. | `GET /api/n8n/requisiciones/pendientes` → 404 |

> P0-1 a P0-5 se resuelven **con el propio merge** (la rama ya arregla los cinco).
> El merge es, por tanto, la acción de seguridad más rentable del proyecto.

---

## P1 · Desbloquear el merge

| # | Pendiente | Detalle |
|---|---|---|
| **P1-1** | **5 commits locales sin subir** | `780a783`, `11a577c`, `14c1fc6`, `4e29953`, `87f9e54`. El PR #1 sólo tiene 17 de los 22 commits de la rama. |
| **P1-2** | **El despliegue de Preview del PR está en FAIL** | `gh pr checks 1` → Vercel `fail`. El build local pasa limpio, así que lo más probable es que sea un build viejo de cuando aún no existía `DATABASE_URL` en Vercel. Se confirma solo al subir P1-1 y redesplegar. |
| **P1-3** | **`main` avanzó 6 commits que la rama no tiene** | 4 artículos de blog (`data/blog/*.json`), una subida de imágenes a `public/uploads/blog/` y el borrado de `.env.local.txt`. Hay que integrar `main` en la rama antes de mergear. |
| **P1-4** | **Los 4 artículos nuevos se perderían al mergear** | En `main` el blog se sirve de archivos JSON (producción muestra **17** artículos); en la rama se sirve de Postgres, sembrado con **13**. Tras el merge hay que correr `seed-blog.ts` para meter los 4 nuevos, o `/blog` perderá contenido. |
| **P1-5** | **Migrar y sembrar la rama principal de Neon ANTES del merge** | Fase 5, paso 27 de la guía. Si se mergea contra una base sin esquema, el build de producción se cae al prerenderizar `/blog` y tumba el despliegue entero. |

---

## P2 · Credenciales y variables (fases 1 y 3 de la guía, a medias)

| # | Pendiente | Consecuencia si no se hace |
|---|---|---|
| **P2-1** | Pegar la **contraseña SMTP nueva** en `SMTP_PASSWORD` (`.env.local`) y cargarla en Vercel | Sin correo en local ni en producción: ni aviso de registro, ni PDF de alta, ni formulario de solicitud de talento. El archivo sigue con la vieja (8 caracteres, la del historial; `.env.local` no se toca desde el 17 de agosto). |
| **P2-2** | Pegar la **API key nueva de DeepSeek** en `DEEPSEEK_API_KEY` y cargarla en Vercel | `/api/disc/analyze` roto. |
| **P2-3** | **Rotar `STRIPE_SECRET_KEY`** (sigue sin rotar y se comprobó que la publicada aún es válida) | Única de las cuatro credenciales filtradas que sigue viva. |
| **P2-4** | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` y `STRIPE_WEBHOOK_SECRET` están **vacías** | La página de precios y el checkout no funcionan. Decidir si se dejan vivos o se retiran. |
| **P2-5** | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` está **vacía** | El botón «Entrar con Google» no aparece. |

> Recordatorio de la guía: cualquier valor con `#` va **entre comillas dobles** en
> un `.env`, o dotenv lo corta y el fallo aparece como `535 authentication failed`.

---

## P3 · Fases de la guía nunca empezadas

| # | Pendiente | Fase |
|---|---|---|
| **P3-1** | Crear el OAuth client ID de Google y publicar la pantalla de consentimiento en **Production** (si se queda en *Testing* sólo entran usuarios listados a mano) | 4 · pasos 23-25 |
| **P3-2** | Resolver los **3 workflows de n8n en 404**: `crear-usuario-hj`, `company-lead` y `proceso-etapa-cambiada`. Hoy ningún alta de usuario llega a n8n. Decisión pendiente tuya: publicarlos o quitar las llamadas del código | 4 · paso 26 |
| **P3-3** | Comprobar que el workflow `wf-002-requisicion` **llama de vuelta** a `/api/n8n/requisiciones/intake`. Si no, la cartera del CRM nunca se llena sola (ver P4-2) | 4 |
| **P3-4** | Migrar y sembrar la rama **principal** de Neon: `migrate deploy` + los 4 seeds + `migrar-cat-items.ts --aplicar` | 5 · paso 27 |
| **P3-5** | Abrir/actualizar y **mergear el PR #1** | 6 · paso 29 |
| **P3-6** | Recorrer las **9 comprobaciones de producción** de la fase 7 | 7 · paso 30 |
| **P3-7** | **Cambiar la contraseña del administrador** desde «Mi perfil». La inicial es aleatoria y está escrita en `.env` | 2, tarea abierta |

---

## P4 · Funcionalidad a medias y deuda de producto

| # | Pendiente | Detalle |
|---|---|---|
| **P4-1** | **Las postulaciones no entran al CRM** | `PostularButton` abre WhatsApp. Quien se postula a una vacante no queda registrado en ninguna parte. |
| **P4-2** | **Las requisiciones públicas tampoco** | `/api/webhooks/perfilador` sigue siendo un proxy puro hacia n8n: no escribe en `Requisicion`. El silo de datos (H-08 de la auditoría) sólo se cerró para el formulario de CV. |
| **P4-3** | **Las vacantes son un archivo estático** | `src/data/vacantes.ts`, 5 vacantes, se publican por commit. No salen del CRM ni de la base. |
| **P4-4** | **El banco de ítems CAT es de relleno** | 23 ítems que se reducen a 6 textos distintos, tres de ellos genéricos repetidos en las 8 pruebas. Escribir ítems reales es trabajo de producto. |
| **P4-5** | **El PDF de bienvenida no está confirmado en producción** | `AUDITORIA-REPARACION.md` §8 lo da por reparado; `PUESTA-EN-MARCHA-NEON.md` lo lista como pendiente. Está dentro de un `try/catch`, así que si falla, falla en silencio. Sólo se resuelve probándolo en el entorno real (y depende de P2-1). |
| **P4-6** | **Dos testimonios vacíos** | `src/components/Testimonials.tsx`, con `nombre`, `cargo` y `empresa` en blanco. |
| **P4-7** | **Faltan logos de clientes** | Truper, Sirga y Zorro en `src/components/brand/ClientsMarquee.tsx`. |
| **P4-8** | **El límite de intentos no es compartido** | Vive en la memoria del proceso: frena el caso normal, no a un atacante repartido entre instancias. Un límite estricto necesita Upstash Redis. |
| **P4-9** | **Frente de diseño/tipografía sin confirmar** | No se sabe dónde vive. Hasta aclararlo, no tocar `layout.tsx` ni `globals.css`. |
| **P4-10** | **Sin feedback real de reclutadores** | Lo construido salió de cruzar el código con las capturas de referencia, no de fricciones reportadas en campo. |
| **P4-11** | **Ideas evaluadas y descartadas** | No están en la referencia, pero son razonables si alguien las pide: selección múltiple, acciones en lote, exportar CSV, etiquetas libres. Y la capa de IA: extracción de datos del CV, matching semántico, resúmenes. |

---

## Orden sugerido

1. **P2-1, P2-2, P2-3** — pegar las dos claves rotadas y rotar la de Stripe. Son
   cinco minutos tuyos y desbloquean el correo, DeepSeek y la última fuga viva.
2. **P1-1 y P1-3** — subir los 5 commits e integrar `main` en la rama.
3. **P1-5 / P3-4** — migrar y sembrar la rama principal de Neon. *Antes* del merge.
4. **P3-5** — mergear el PR #1. Aquí caen de golpe P0-1 a P0-6 y aparece el CRM
   en producción.
5. **P1-4** — sembrar los 4 artículos nuevos del blog.
6. **P3-6** — las 9 comprobaciones en producción.
7. **P3-1, P3-2, P3-3** — Google y los workflows de n8n.
8. **P4** — por impacto de negocio; P4-1 y P4-2 son los que más valen porque son
   los que llenan el CRM solo.
