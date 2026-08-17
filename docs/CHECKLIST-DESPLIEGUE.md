# Guía de despliegue, paso a paso

**Fecha:** 2026-08-17 (revisión contra Vercel y contra la base)
**Estado del código:** compila limpio (`tsc --noEmit` sin errores, 73/73 páginas
generadas). El único fallo del build es el prerender de `/blog`, y es por no
tener base de datos todavía. No queda nada pendiente de programar.

Treinta pasos en el orden exacto en que hay que hacerlos. Cada fase depende de la
anterior: saltarse el orden es lo que hace que un paso falle sin motivo aparente.

## Dónde estamos hoy

| Fase | Estado |
|---|---|
| 1 · Contener la fuga | ⛔ **Bloqueada.** Los pasos 2, 3 y 4 siguen sin hacer, y se comprobó una por una |
| 2 · Base de datos en Neon | ✅ Completada. Rama `dev` migrada y sembrada |
| 3 · Variables en Vercel | 🟡 **Casi.** 24 variables cargadas en los tres entornos; solo faltan las 3 que dependen de la fase 1 |
| 4 · Google y n8n | ⬜ Sin empezar |
| 5 · Base de producción | ⬜ Sin empezar |
| 6 · Publicar | ⬜ Rama subida, PR sin abrir |
| 7 · Verificar | ⬜ Sin empezar |

### Lo único que te toca a ti ahora

**Rotar las tres credenciales de los pasos 2, 3 y 4.** Son cuentas de terceros
—Hostinger, DeepSeek, Stripe— y no se pueden tocar desde el repositorio. Todo lo
demás de la fase 3 ya está cargado; esas tres son las que faltan, y hasta que se
roten **el correo no sale en producción**.

En cuanto las tengas, actualiza `.env.local` (SMTP y DeepSeek) y `.env` (Stripe),
y se cargan en Vercel en un minuto.

### Lo que cambió respecto a la revisión anterior

1. **Las tres credenciales filtradas siguen vivas.** No es una sospecha: se
   compararon los valores actuales de `.env` y `.env.local` contra los que están
   en el historial de git, y son **idénticos**. Detalle en la fase 1.
2. **Neon no dejó las variables donde la guía suponía.** La integración las creó
   con el prefijo `hackesjobs_`, así que `DATABASE_URL` y `DIRECT_URL` —los dos
   nombres que exige Prisma— no existían. Corregido: los pasos 8 y 9 se
   reescribieron como paso 15b, y ya están creados.
3. **Los tres entornos apuntaban a la misma rama de Neon**, la principal.
   Corregido: Production va a la principal, Preview y Development a `dev`.
4. **`gh` ya está instalado** (2.97.0, sesión iniciada). El paso 29 deja de ser
   manual.
5. **Hay un store de Blob**, privado, y el token en los tres entornos.

---

## Fase 1 · Contener la fuga de credenciales

Va primero porque no depende de nada y porque, mientras no se haga, hay cuatro
credenciales válidas publicadas. El código ya está limpio; lo que sigue expuesto
es el historial de git, y borrar un commit no revoca una contraseña.

**1. ~~Comprueba si el repositorio es público o privado.~~ RESUELTO: es privado.**
Comprobado con una lectura anónima: `git ls-remote` sin credenciales devuelve una
petición de usuario, y un repositorio público responde sin pedir nada. Eso baja la
urgencia, no la necesidad: los cuatro secretos siguen en el historial y los ve
cualquiera con acceso al repositorio, hoy o el día que se vuelva público.

> **Comprobado el 2026-08-17: los pasos 2, 3 y 4 siguen pendientes.** Se leyeron
> los valores de `.env` y `.env.local` y se compararon —por hash, sin imprimir el
> secreto— contra todas las revisiones de `.env` y `.env.local.txt` del
> historial. Las tres coinciden. No es que «falte confirmarlo»: son literalmente
> las mismas cadenas que están publicadas en el repositorio.
>
> | Clave | En el historial | Hoy en local | Veredicto |
> |---|---|---|---|
> | `SMTP_PASSWORD` | sí | igual | **sin rotar** |
> | `DEEPSEEK_API_KEY` | sí | igual | **sin rotar** |
> | `STRIPE_SECRET_KEY` | sí | igual | **sin rotar** |
> | `JWT_SECRET` | no | — | limpia (regenerada) |
> | `N8N_API_KEY`, `WEBHOOK_SECRET` | no | — | limpias, nunca se filtraron |
>
> Esto es lo que bloquea la fase 3: cargarlas en Vercel tal como están sería
> subir a producción tres credenciales que ya son públicas para cualquiera con
> acceso al repositorio. Los pasos 2, 3 y 4 son cuentas de terceros (Hostinger,
> DeepSeek, Stripe) y hay que hacerlos a mano; no se pueden automatizar desde
> aquí.

**2. Rota la contraseña del buzón de correo** (Hostinger).
`abelardo.carlos@hackesjobs.com.mx`. Es la más grave de las cuatro: permite
enviar correo en nombre de la empresa. Actualiza `SMTP_PASSWORD` en `.env.local`.

> Si la contraseña lleva `#`, en un `.env` **debe ir entre comillas dobles**. Sin
> comillas, dotenv corta el valor en el primer `#` y el correo falla con un
> `535 authentication failed` que no apunta a la causa real.

**3. Revoca y regenera la API key de DeepSeek.**
Actualiza `DEEPSEEK_API_KEY` en `.env.local`.

**4. Rota la clave secreta de Stripe.**
Es de modo test (`sk_test_`), así que la gravedad es menor, pero estuvo
commiteada. Actualiza `STRIPE_SECRET_KEY` en `.env`.

**5. ~~Borra `.env.local.txt`.~~ HECHO.**
Ya no lo leía nadie: era el archivo que Next.js nunca cargaba y que un parser
propio leía a mano del disco, lo que hacía que el formulario de solicitud de
talento funcionara en local y fallara en Vercel. Se borró tras comprobar que sus
cuatro valores —SMTP y DeepSeek— siguen en `.env.local`.

---

## Fase 2 · Levantar la base de datos en Neon — ✅ COMPLETADA (2026-08-17)

Estado final, verificado contra la base:

| Qué | Resultado |
|---|---|
| Proyecto | `neon-beige-lantern` (`delicate-recipe-63339563`), Postgres 17, `aws-us-east-1` |
| Rama de desarrollo | `dev` (`br-orange-tooth-au3gmzxd`), creada desde `main` |
| Migraciones | `init_postgres` y `blog_newsletter`, aplicadas |
| Contenido | 12 psicometrías · 23 ítems CAT · 13 artículos · 2 suscriptores |
| Cuentas | 2 administradores. **Ninguna cuenta demo** (`SEED_DEMO` sin definir) |

Comprobaciones que pasaron en local: `/blog` lista los 13 artículos · login con
rol `admin` · `/crm` responde 200 con sesión y 307 sin ella · el límite de
intentos corta con 429.

Reconsultado el 2026-08-17 contra la rama `dev`
(`ep-weathered-mode-auotuysy`): 2 usuarios, los 2 administradores, **23 ítems
CAT**, 13 artículos y 2 suscriptores. El traslado del banco CAT de la nota de
abajo ya se aplicó; no hay que volver a correrlo.

Queda una tarea abierta de esta fase: **cambiar la contraseña de administrador
desde «Mi perfil»**. La inicial es aleatoria y está en `.env`.

<details>
<summary>Los pasos originales, por si hay que repetirlos</summary>

Es el bloqueo real: sin base de datos el build falla al prerenderizar `/blog` y
no hay forma de probar nada de punta a punta. Primero la rama de desarrollo, para
equivocarse en local y no en producción.

**6. Provisiona Neon desde el Marketplace** (Vercel).
Proyecto `hackes-jobs-web-v2` → **Storage** → **Neon** → Create, conectado a
Production, Preview y Development. La integración inyecta sola `DATABASE_URL`,
`DATABASE_URL_UNPOOLED` y varias `PG*`.

**7. Crea una rama `dev`** en la consola de Neon.
Es la base contra la que trabajarás en local. Sin ella acabarías desarrollando
contra producción, que es la clase de divergencia que originó la avería que se
reparó.

**8 y 9. ⚠️ Estos dos pasos quedaron mal planteados.** Suponían que la
integración de Neon crea `DATABASE_URL` y que solo había que añadir `DIRECT_URL`
y revisar un sufijo. No fue así: las creó todas con prefijo. Se reescriben al
principio de la fase 3, que es además donde les toca, porque son variables de
Vercel y no de la base.

**10. Pega las dos cadenas de la rama `dev` en tu `.env`.**
Los huecos ya están marcados. Ojo con cuál va en cada una:

| Variable | Qué cadena |
|---|---|
| `DATABASE_URL` | La **pooled**. El host lleva `-pooler`. Con los tres parámetros del paso 9. |
| `DIRECT_URL` | La misma base **sin pooler** y **sin** `pgbouncer`. Solo la usan las migraciones. |

Si usas `vercel env pull`, **no lo dirijas a `.env.local`**: lo sobrescribe y
perderías SMTP y n8n. Usa `vercel env pull .env.vercel --environment=development`
y copia a mano.

**11. ~~Borra `.env.development.local`.~~ HECHO.**
Next.js prioriza ese archivo **sobre** `.env` en desarrollo. Apuntaba a un
Postgres local en `127.0.0.1:5433` que ya no corre, y mientras existiera, la
cadena de Neon del paso 10 habría quedado ignorada en silencio. La configuración
de base de datos vive ahora solo en `.env`.

**12. Crea el esquema en la rama `dev`.**

```bash
npx prisma migrate deploy
```

Debe aplicar dos migraciones: `20260811000000_init_postgres` y
`20260811010000_blog_newsletter`. Si dice que la URL está vacía, el paso 10 no
quedó guardado.

**13. Define `SEED_ADMIN_PASSWORD` antes de sembrar.**
Ya no es un consejo: el seed **aborta con código 1** si falta o si tiene menos de
8 caracteres, y lo hace antes de tocar la base. Antes caía a `admin2026`, escrito
en claro en el repositorio.

```
SEED_ADMIN_EMAIL=abelardo.carlos@hackesjobs.com.mx
SEED_ADMIN_PASSWORD="la-que-tú-elijas"
```

Si además quieres las tres cuentas de prueba (empresa, candidato y reclutador)
**solo en local**, añade `SEED_DEMO=true`. Sus contraseñas están escritas en
`prisma/seed.ts`, y la de reclutador abre `/crm`: nunca la pongas en producción.

**14. Siembra los cuatro conjuntos de datos.**

```bash
npx prisma db seed && npx tsx prisma/seed-tests.ts && npx tsx prisma/seed_cat.ts && npx tsx prisma/seed-blog.ts
```

Los cuatro son idempotentes. **El cuarto no es opcional:** `seed-blog.ts` importa
los 13 artículos y los suscriptores a la base. Si lo saltas, `/blog` sale vacío.
A partir de esa importación manda la base; los archivos de `data/` quedan solo
como origen del arranque.

**15. Comprueba que todo funciona en local.**

```bash
npm run dev
```

Las tres señales: `/blog` muestra los 13 artículos · entras con tu cuenta y
aterrizas en `/admin` · el menú lateral incluye «CRM de reclutamiento». Cuando se
cumplan, cierra el servidor y confirma que también compila para producción con
`npm run build`.

</details>

> **Nota sobre el traslado de datos, que esta guía no contemplaba. ✅ APLICADO en
> `dev`.** Los seeds no reproducen el banco de ítems CAT de la base SQLite
> antigua: `seed_cat.ts` solo crea la prueba de demostración, y las 8
> psicometrías reales —que acumulan 46 sesiones CAT— quedaban con banco vacío. Se
> resolvió con `npx tsx prisma/migrar-cat-items.ts --aplicar` (simulacro sin
> `--aplicar`). **Hay que repetirlo en la rama principal, en la fase 5.**
>
> Dicho eso, no es un banco valioso: las 43 filas antiguas son 23 duplicadas, y
> se reducen a 6 textos de pregunta distintos, tres de ellos genéricos y
> repetidos en las 8 pruebas. Se traslada por paridad con producción. **Escribir
> ítems reales para esas pruebas es trabajo pendiente de producto.**
>
> El resto de datos antiguos no hacía falta trasladarlo: los 10 usuarios de la
> base vieja eran las 4 cuentas del seed, las 2 de Abelardo y 4 de prueba en
> `@test.local`.

---

## Fase 3 · Cargar las variables en Vercel

Todas en los tres entornos. Se hacen ahora, con las credenciales de la fase 1 ya
rotadas, para no tener que volver a tocarlas.

### Lo que había, y lo que quedó cargado (2026-08-17)

Proyecto `abelardocarlos-projects/hackes-jobs-web-v2`. **Al empezar, las únicas
18 variables que existían eran las que puso la integración de Neon, todas con el
prefijo `hackesjobs_`.** De la aplicación no había ninguna.

Ya están cargadas 24 variables en los tres entornos. Lo que queda:

| Paso | Estado |
|---|---|
| 15b · `DATABASE_URL` y `DIRECT_URL` | ✅ Los tres entornos, cada uno a su rama |
| 16 · `JWT_SECRET` | ✅ Uno **distinto por entorno**, ninguno igual al de `.env` |
| 17 · `NEXT_PUBLIC_APP_URL` | ✅ Production y Preview al dominio; Development a `localhost:3000` |
| 18 · Vercel Blob | ✅ Store privado `hackes-jobs-cv`, token en los tres |
| 19 · Correo | 🟡 `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` cargadas. **Falta `SMTP_PASSWORD`** (paso 2) |
| 20 · n8n y psicometrías | ✅ Las 14 completas |
| 21 · DeepSeek y Stripe | ⛔ **Pendiente** (pasos 3 y 4) |
| 22 · `BLOG_ADMIN_*` | ✅ Nada que hacer, no existían |

Verificado después: `npm run build` compila y `/blog` prerenderiza.

<details>
<summary>Dos trampas de la CLI con las que se tropezó, por si hay que repetirlo</summary>

**La CLI v52 no sabe añadir variables a Preview sin preguntar.** Devuelve
`git_branch_required` y sugiere un comando que ella misma vuelve a rechazar. Se
resuelve con una versión reciente: `npx vercel@latest env add NOMBRE preview
--value ... --yes`. Production y Development sí funcionan en la v52, y aceptan el
valor por stdin, que es preferible a `--value` porque no deja el secreto en la
línea de comandos.

**`vercel blob create-store` reescribe `.env.local` sin avisar** y añade `.env*`
a `.gitignore`. Lo primero es peligroso aquí: `.env.local` tiene prioridad sobre
`.env` en Next.js, así que se llevó a local copias de `DATABASE_URL`,
`DIRECT_URL` y `JWT_SECRET` que habrían pisado a las de `.env` —el mismo problema
del paso 11—. Lo segundo también ignoraría `.env.example`, que sí se versiona.
Ambos se revirtieron; queda el respaldo en `.env.local.bak-antes-de-blob`. Si
vuelves a correr ese comando, revisa los dos archivos después.

</details>

Tres consecuencias de cómo aterrizó Neon, que es lo que obligó a reescribir los
pasos 8 y 9:

**a) `DATABASE_URL` y `DIRECT_URL` no existían.** Prisma exige esos dos nombres
exactos (`prisma/schema.prisma` los lee con `env("DATABASE_URL")` y
`env("DIRECT_URL")`). Lo único que había era `hackesjobs_DATABASE_URL` y
`hackesjobs_DATABASE_URL_UNPOOLED`. Sin los dos nombres sin prefijo, **cualquier
despliegue falla al prerenderizar `/blog`**, que es exactamente el síntoma que la
fase 2 pretendía quitar de en medio.

**b) Los tres entornos apuntaban a la misma rama de Neon: la principal**
(`ep-crimson-darkness-au2eh3mj`). Production, Preview y Development compartían
endpoint, así que un Preview de una rama a medias habría escrito sobre los datos
de producción — justo la divergencia que describe el paso 7.

**c) Faltaba el sufijo de PgBouncer.** La cadena que inyectó Neon termina en
`?channel_binding=require&sslmode=require`, sin `pgbouncer=true` ni
`connection_limit=1`. Sin ellos Prisma emite sentencias `PREPARE` que PgBouncer
rechaza en modo transacción: falla de forma intermitente y solo bajo carga, que
es la peor manera de enterarse.

### 15b. ~~Crea `DATABASE_URL` y `DIRECT_URL` en Vercel.~~ ✅ HECHO

Sustituye a los pasos 8 y 9. Se tomaron los valores de las variables con prefijo
y se crearon los dos nombres que Prisma espera, **cada entorno contra su rama**.
Las `hackesjobs_*` se dejaron intactas.

| Entorno | `DATABASE_URL` | `DIRECT_URL` |
|---|---|---|
| Production | rama **principal**, pooled (`-pooler`) | rama **principal**, sin pooler |
| Preview | rama **`dev`**, pooled | rama **`dev`**, sin pooler |
| Development | rama **`dev`**, pooled | rama **`dev`**, sin pooler |

A la cadena pooled se le **añadió** `&pgbouncer=true&connection_limit=1`. A la
directa no: las migraciones no pasan por PgBouncer.

> ⚠️ **`DATABASE_URL` es ahora una copia a mano.** Si algún día rotas las
> credenciales de Neon, la integración actualizará las `hackesjobs_*` pero **no**
> estas dos. Hay que reeditarlas. Es el precio de que Prisma exija esos nombres.

**16. ~~Genera y carga un `JWT_SECRET` nuevo.~~ ✅ HECHO**
Se cargó **uno distinto en cada entorno**, ninguno igual al de tu `.env` local, y
los tres marcados como sensibles. Que Preview y Production no compartan secreto
significa que una sesión abierta en un preview no vale en producción.

Antes el código caía a un valor por defecto escrito en el repositorio, así que
cualquiera que leyera el código podía firmarse un token con `role:'admin'` y
entrar al CRM a ver CVs y teléfonos de candidatos. Tu `.env` local ya quedó
regenerado.

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

**17. ~~Define `NEXT_PUBLIC_APP_URL`.~~ ✅ HECHO**
`https://www.hackesjobs.com.mx`, sin barra final, en Production y Preview. La
usan Stripe para las URLs de retorno y OpenRouter para atribuir el consumo.

En **Development** se puso `http://localhost:3000`, apartándose del «todas en los
tres entornos» de esta guía. El motivo: ese valor solo se usa si alguien corre
`vercel env pull`, y si trajera el dominio de producción, un checkout de Stripe
lanzado en local acabaría redirigiendo al sitio real. Tu `.env` ya tenía
`localhost:3000`; ahora coinciden.

**18. ~~Provisiona Vercel Blob.~~ ✅ HECHO**
No había ningún store conectado. Se creó **`hackes-jobs-cv` con acceso privado**
—los CV son datos personales, y `src/lib/cv-storage.ts` ya sube con
`access: 'private'`— y el `BLOB_READ_WRITE_TOKEN` quedó en los tres entornos. Sin
él, cada CV que suba un candidato o un reclutador se descarta en silencio: el
disco de Vercel es de solo lectura salvo `/tmp`, que además es efímero.

```bash
npx vercel@latest blob create-store hackes-jobs-cv --access private --yes
```

**19. Carga las variables de correo. 🟡 A medias, depende del paso 2.**
Ya están cargadas `SMTP_HOST`, `SMTP_PORT` y `SMTP_USER` en los tres entornos.
**Falta `SMTP_PASSWORD`,** y no se carga mientras siga siendo la del historial:
subirla a Vercel es publicar en producción una credencial que ya es pública.
`NOTIFICATION_EMAIL` tampoco se cargó porque no está definida en local; sin ella
el código usa `SMTP_USER`, que es el comportamiento deseado.

Hasta que se cargue la contraseña, **el correo no sale en producción**: fallan el
aviso de registro y el PDF de la comprobación 9.

| Variable | Valor |
|---|---|
| `SMTP_HOST` | El servidor de Hostinger |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | El buzón completo |
| `SMTP_PASSWORD` | La contraseña **nueva** del paso 2 |
| `NOTIFICATION_EMAIL` | Buzón interno que recibe los avisos. Si se omite, usa `SMTP_USER` |

**20. ~~Carga las variables de n8n y psicometrías.~~ ✅ HECHO** (las 14, en los
tres entornos) — tal cual de tu `.env.local`:
`N8N_API_KEY`, `N8N_BASE_URL`, `WEBHOOK_BASE_URL`, `WEBHOOK_SECRET`, los 10
`WEBHOOK_*` de las psicometrías y los dos `TEST_POLLING_*`. Este bloque es el que
mantiene vivo lo que ya funciona en producción: requisiciones y psicometrías.

**21. Carga DeepSeek y, si aplica, Stripe. ⛔ Depende de los pasos 3 y 4.**
`DEEPSEEK_API_KEY` con la clave nueva del paso 3. Los `STRIPE_*` solo si vas a
dejar viva la página de precios, y con la clave nueva del paso 4. Mismo criterio
que el paso 19: las de hoy están publicadas, no se suben.

**22. ~~Elimina `BLOG_ADMIN_USER` y `BLOG_ADMIN_PASS`.~~ NADA QUE HACER.**
Comprobado el 2026-08-17: no existen en Vercel; nunca llegaron a cargarse.
Tampoco queda ni una referencia en el código. Eran el segundo sistema de login
del panel del blog, que guardaba contraseñas en texto plano.

---

## Fase 4 · Conectar Google y n8n

Ninguna bloquea el despliegue: sin Google el botón simplemente no aparece, y los
webhooks fallan sin tumbar el registro. Pero conviene dejarlas resueltas antes de
publicar.

**23. Crea el OAuth client ID** (Google Cloud Console → APIs & Services →
Credentials → Create OAuth client ID → **Web application**).

- **JavaScript origins:** `http://localhost:3000`, `https://www.hackesjobs.com.mx`,
  `https://hackesjobs.com.mx`
- **Redirect URIs:** **ninguna.** Google Identity Services usa origins, no
  redirect: este proyecto no hace el flujo de callback.

**24. Publica la pantalla de consentimiento.**
OAuth consent screen: **External**, scopes `openid email profile`, y publicar en
**Production**. Si se queda en «Testing», solo entran los usuarios de prueba que
listes uno por uno.

**25. Pega el Client ID en los dos sitios**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` en tu
`.env` y en Vercel. Las `NEXT_PUBLIC_*` se incrustan al compilar, así que ponerla
en Vercel **no surte efecto hasta que redespliegues**. Por eso este paso va antes
de la fase 6 y no después.

**26. Resuelve los tres workflows de n8n que devuelven 404.**
Hoy ningún alta de usuario está llegando a n8n.

| Workflow | Cuándo se dispara |
|---|---|
| `crear-usuario-hj` | En cada registro y en el alta con Google |
| `company-lead` | Al registrarse una empresa |
| `proceso-etapa-cambiada` | Nuevo: lo dispara el CRM al mover a un candidato de etapa |

Si deben existir, publícalos. Si no, avísame y quito las llamadas del código. No
es un cambio que se pueda hacer a ciegas: depende de qué haya publicado en n8n.

---

## Fase 5 · Preparar la base de producción

Antes de publicar, no después. Si despliegas contra una base sin esquema, el
build falla al prerenderizar `/blog` y el despliegue se cae entero.

**27. Migra y siembra la rama principal de Neon.**
Cambia temporalmente `DATABASE_URL` y `DIRECT_URL` en tu `.env` por las de la
rama principal, **quita `SEED_DEMO`** si lo habías puesto, y repite:

```bash
npx prisma migrate deploy && npx prisma db seed && npx tsx prisma/seed-tests.ts && npx tsx prisma/seed_cat.ts && npx tsx prisma/seed-blog.ts && npx tsx prisma/migrar-cat-items.ts --aplicar
```

El último comando es el añadido de esta revisión: traslada el banco de ítems CAT,
que ningún seed reproduce. En la rama `dev` dejó 23 ítems; aquí debería dejar los
mismos.

**Después vuelve a dejar en `.env` las cadenas de la rama `dev`.**

No está metido en el build a propósito: si una migración falla dentro del build,
tumba el despliegue entero y no queda un rollback limpio.

---

## Fase 6 · Publicar

`main` sigue en el commit `9ae181d`. Todo el CRM, el paso a Postgres, el blog en
base de datos y los accesos por rol están solo en la rama. Sin este paso, Vercel
despliega la versión vieja.

**28. ~~Commitea los arreglos pendientes.~~ HECHO.**
Tres commits en la rama, ya subidos a `origin`. La rama pasó de `8545599` a
`bbf1a98`.

| Commit | Contenido |
|---|---|
| `e6d20ab` | Límite de intentos en login y cambio de contraseña |
| `10abb39` | URLs de retorno reales en Stripe y OpenRouter |
| `bbf1a98` | Esta guía |

> El push habrá disparado un despliegue de Preview en Vercel, y ese build **va a
> fallar**: todavía no hay `DATABASE_URL`. Es lo esperado y no afecta a
> producción. Dejará de fallar al terminar la fase 2.

**29. Abre el PR a `main` y mergéalo.**
La rama ya está subida. `gh` **sí está instalado** (2.97.0, con sesión iniciada
como `abelardocarlosf-design`), al contrario de lo que decía esta guía:

```bash
gh pr create --base main --head feat/crm-reclutadores-y-reparaciones --fill
```

O a mano, desde el comparador:

```
https://github.com/abelardocarlosf-design/Hackes-Jobs-Web-v2/compare/main...feat/crm-reclutadores-y-reparaciones
```

> **No mergees antes del paso 27.** Crear el PR es seguro y puedes hacerlo ya. El
> merge no: dispara el despliegue de producción, y si la base de producción aún no
> tiene esquema, el build se cae al prerenderizar `/blog` y tumba el despliegue
> entero.

---

## Fase 7 · Verificar en producción

**30. Recorre las nueve comprobaciones**, en este orden. Cada una corresponde a
algo que estaba roto y que debería haber quedado arreglado.

1. `/register` como candidato → **201** y aterriza en `/portal`. Antes daba 500.
2. Entras con tu cuenta y aterrizas en `/admin`, con «CRM de reclutamiento» en el
   menú.
3. `/admin/equipo` → crea un reclutador → entra con él → aterriza en `/crm` y su
   menú **solo** tiene CRM.
4. `/crm` muestra **una sola** barra de navegación.
5. El botón de Google aparece en `/login` **con estilos**. Sin estilos significa
   que la CSP no se aplicó (`style-src` debe incluir `https://accounts.google.com`).
6. `/blog` muestra los 13 artículos. Vacío = faltó `seed-blog.ts`.
7. Te suscribes desde el blog y aparece en `/admin/suscriptores`. Esto es lo que
   en producción fallaba en silencio.
8. Subes un CV desde `/candidatos` y lo descargas desde el CRM. Valida de paso el
   token de Blob.
9. Registras un candidato y llega el correo con el PDF.

> **Sobre la comprobación 9.** Hay una contradicción entre los documentos
> internos: `AUDITORIA-REPARACION.md` §8 da el PDF por reparado y verificado, y
> `PUESTA-EN-MARCHA-NEON.md` lo lista como pendiente conocido. El código está
> dentro de un `try/catch`, así que el registro funciona igual y el fallo, si lo
> hay, es silencioso. Solo se resuelve probándolo en el entorno real.

---

## Después, cuando haya tiempo

Nada de esto bloquea el despliegue, pero está a medias:

- **Testimonios sin datos reales** — `src/components/Testimonials.tsx`, dos con
  `nombre`, `cargo` y `empresa` en blanco.
- **Logos de clientes** — faltan Truper, Sirga y Zorro en
  `src/components/brand/ClientsMarquee.tsx`.
- **Límite de intentos compartido** — el que se añadió vive en la memoria del
  proceso, así que frena el caso normal pero no a un atacante repartido entre
  instancias. Un límite estricto necesitaría Upstash Redis.

---

## Lo que ya quedó resuelto en código (2026-08-12)

No hace falta hacer nada con esto; queda anotado para no volver a auditarlo.

- **`JWT_SECRET` local regenerado.** Tenía literalmente el valor por defecto que
  estuvo publicado en el repositorio.
- **`.env` consolidado como fuente única** de base de datos, sesión y Google, con
  los huecos de Neon marcados.
- **`.env.development.local` neutralizado.** Apuntaba a un Postgres local en
  `127.0.0.1:5433` que ya no corre y que no se puede levantar en esta máquina (no
  hay Docker). Lo peligroso era que Next.js lo prioriza sobre `.env`.
- **Límite de intentos en `/api/auth/login` y `/api/auth/password`**
  (`src/lib/rate-limit.ts`): 10 intentos por IP+correo en 15 minutos, 429 con
  `Retry-After`, y contador que se limpia al acertar.
- **Stripe ya no redirige a `localhost`.** `success_url` y `cancel_url` caían a
  `http://localhost:3000` si faltaba `NEXT_PUBLIC_APP_URL`.
- **OpenRouter ya no reporta el consumo como tráfico de desarrollo**
  (`HTTP-Referer` estaba fijo a localhost).
- **`scratch/mint-test-token.mjs` falla cerrado**: tenía escrito como valor por
  defecto el mismo secreto que estuvo publicado.
