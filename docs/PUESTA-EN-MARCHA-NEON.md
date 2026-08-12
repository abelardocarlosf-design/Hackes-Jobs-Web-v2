# Puesta en marcha: Neon, Google y despliegue

Estado: **el código está listo y verificado en local**. Falta provisionar Neon y
cargar tres variables de entorno. Hasta entonces `npm run dev` **no arranca**,
porque `DATABASE_URL` está vacía a propósito (antes apuntaba a SQLite, y ese era
el origen del fallo al crear usuarios en producción).

---

## 1. Neon (Marketplace de Vercel)

Dashboard de Vercel → proyecto `hackes-jobs-web-v2` → **Storage** → **Neon** →
Create, y conéctalo a Production, Preview y Development. O bien:

```bash
vercel integration add neon
```

La integración inyecta `DATABASE_URL`, `DATABASE_URL_UNPOOLED` y varias `PG*`.

**Dos cosas que hay que hacer a mano:**

1. Crear en Vercel la variable **`DIRECT_URL`** con el mismo valor que
   `DATABASE_URL_UNPOOLED`. Prisma exige ese nombre y la integración no lo crea.
2. Comprobar que `DATABASE_URL` termine en
   `?sslmode=require&pgbouncer=true&connection_limit=1`.
   Sin `pgbouncer=true`, Prisma emite sentencias `PREPARE` que PgBouncer rechaza
   en modo transacción: falla de forma intermitente y solo bajo carga.

Crea también una rama **`dev`** en la consola de Neon para desarrollo local.

---

## 2. Variables de entorno

### `.env` local (ignorado por git)

Ya está creado con los nombres correctos. Rellena:

| Variable | De dónde sale |
|---|---|
| `DATABASE_URL` | Neon, rama `dev`, cadena **pooled** |
| `DIRECT_URL` | Neon, rama `dev`, cadena **sin pooler** |
| `JWT_SECRET` | ya tiene valor (se movió desde `.env.local`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Cloud Console (paso 4) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |

> **El CLI de Prisma lee `.env` y NO lee `.env.local`.** Si `DATABASE_URL`
> estuviera en los dos, las migraciones irían a una base y la aplicación a otra,
> y el error aparecería como "la tabla no existe" en runtime, no al migrar.
> Por eso se separaron: `.env` lleva base de datos, sesión y Google;
> `.env.local` lleva SMTP, n8n y webhooks.

Al hacer `vercel env pull`, **no lo dirijas a `.env.local`**: lo sobrescribe y
perderías SMTP y n8n. Usa `vercel env pull .env.vercel --environment=development`
y copia a mano.

### Vercel (los tres entornos)

Añadir: **`JWT_SECRET`** (crítica), `DIRECT_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`,
`NEXT_PUBLIC_APP_URL`, y `BLOB_READ_WRITE_TOKEN` si aún no está (sin él, los CV
que suba el CRM se pierden).

**Eliminar:** `BLOG_ADMIN_USER` y `BLOG_ADMIN_PASS`. Ya no se usan.

> `JWT_SECRET` es lo más urgente de toda la lista. Hasta ahora el código caía a
> un valor por defecto escrito en el repositorio, así que cualquiera que leyera
> el código podía firmarse un token con `role:'admin'` y entrar al CRM a ver
> CVs y teléfonos de candidatos. Genera uno con:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
> ```

---

## 3. Crear el esquema y sembrar

Con `.env` apuntando a la rama `dev` de Neon:

```bash
npx prisma migrate deploy
```

```bash
npx prisma db seed && npx tsx prisma/seed-tests.ts && npx tsx prisma/seed_cat.ts && npx tsx prisma/seed-blog.ts
```

Los cuatro seeds son idempotentes (antes `seed-tests.ts` usaba `create` y duplicaba
las 12 psicometrías en cada ejecución). `seed-blog.ts` importa a la base los 13
artículos de `data/blog/*.json` y los suscriptores de `data/subscribers.json`:
**si lo saltas, el blog sale vacío.** Salta lo que ya existe en vez de
sobrescribirlo, para que volver a correrlo no resucite un artículo borrado desde
el CMS ni pise una edición. A partir de esa importación **la base manda**: los
archivos de `data/` quedan solo como origen del arranque.

El seed crea tus dos cuentas
`abelardo.carlos@hackesjobs.com.mx` y `abelardo.carlosf@gmail.com` **con rol
`admin`** — en la base anterior estaban como `company`, y por eso el middleware
te negaba la entrada al CRM.

Puedes fijar la contraseña inicial con `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`
en `.env`. **Cámbiala desde "Mi perfil" en cuanto entres.**

Para producción, repite `migrate deploy` apuntando a la rama principal de Neon.
No se metió en el build a propósito: si una migración falla dentro del build,
tumba el deploy entero y no queda un rollback limpio.

---

## 4. Google Cloud Console

APIs & Services → Credentials → Create OAuth client ID → **Web application**.

- **Authorized JavaScript origins:**
  `http://localhost:3000`, `https://www.hackesjobs.com.mx`, `https://hackesjobs.com.mx`
- **Authorized redirect URIs:** ninguna. Google Identity Services usa origins,
  no redirect: este proyecto no hace el flujo de callback.
- **OAuth consent screen:** External, scopes `openid email profile`, y
  **publicar en Production**. Si se queda en "Testing", solo entran los usuarios
  de prueba que listes explícitamente.

Pega el Client ID en `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (local y Vercel).

⚠️ Las `NEXT_PUBLIC_*` se **inlinean en tiempo de build**: ponerla en Vercel no
surte efecto hasta que **redespliegues**.

Mientras esté vacía, el botón de Google simplemente no aparece y el acceso con
email y contraseña funciona con normalidad. No hay botón roto.

---

## 5. Qué comprobar después de desplegar

1. `/register` como candidato → **201 y aterriza en `/portal`** (antes: 500).
2. Entrar con tu cuenta → aterrizas en `/admin`, con "CRM de reclutamiento" en el
   menú lateral.
3. `/admin/equipo` → crear un reclutador; entrar con él → aterriza en `/crm`, y
   su menú **solo** tiene CRM.
4. `/crm` muestra **una sola** barra de navegación.
5. Botón de Google en `/login` **con estilos**. Si sale sin estilos, la CSP no se
   aplicó (`style-src` debe incluir `https://accounts.google.com`).
6. `/blog` muestra los 13 artículos. Si sale vacío, faltó `seed-blog.ts`.
7. Suscribirte desde el formulario del blog y verlo aparecer en
   `/admin/suscriptores`. Esto es lo que en producción fallaba en silencio.

---

## Fase 5 — completada

`src/lib/blog.ts` y `src/lib/newsletter.ts` escribían con `fs` dentro de `data/`.
En Vercel el disco es de solo lectura, así que el formulario de newsletter
descartaba cada suscripción en silencio y el CMS del blog no guardaba nada. No se
detectó antes porque en local `fs` sí escribe y todo parece funcionar.

Ya están en Postgres (modelos `BlogPost` y `Subscriber`, migración
`20260811010000_blog_newsletter`). Las cuatro funciones del blog conservan su
firma, así que las páginas y las rutas de API no cambiaron de forma.

Dos consecuencias que conviene tener presentes:

- **El build ahora necesita la base.** `/blog` y `/blog/[slug]` se prerenderizan
  desde Postgres. Con `DATABASE_URL` inalcanzable durante el build, el sitemap y
  la lista de slugs degradan a vacío en vez de tumbar el despliegue, pero `/blog`
  sí falla. En Vercel la variable está presente en build, así que es el caso
  normal; solo importa si Neon está caído justo en ese momento.
- **El blog se revalida cada 5 minutos**, y las rutas de API llaman a
  `revalidatePath` al guardar o borrar. Sin eso un artículo publicado desde
  `/admin/blog` no aparecería hasta el siguiente despliegue.

## Pendiente conocido

`renderToBuffer` de `@react-pdf/renderer` v4 es incompatible con React 18, así que
el correo de alta con PDF nunca llega. Está dentro de un try/catch, por lo que el
registro funciona igual.
