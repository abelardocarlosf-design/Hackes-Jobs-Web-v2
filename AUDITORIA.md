# Auditoría de conversión — hackesjobs.com.mx (2026-07-03)

Auditoría previa a los cambios definidos en `CAMBIOS.tmp`. Objetivo: conversión de clientes empresa nuevos que llegan de la campaña de prospección en frío.

## Defectos confirmados y corregidos

### P0 — Contadores de métricas renderizan en 0
- **Archivo:** `src/components/motion/CountUp.tsx` (consumido por `src/app/page.tsx`, sección TRUST STRIP).
- **Causa raíz:** el componente inicia `useState(0)` y solo anima hacia el valor real cuando entra al viewport client-side. El HTML servido (SSR/prerender) contiene literalmente `+0`, `0 días`, `0 hrs`. Google indexa "+0 empresas atendidas" y cualquier visitante sin JS o con JS lento ve ceros.
- **Fix:** el estado inicial ahora es el valor final (`useState(value)`) — el HTML servido contiene `+500`, `+50`, `10 días`, `24 hrs`. La animación de conteo se conserva como progressive enhancement: al entrar al viewport anima de 0 al valor sobre el número ya presente.

### P0 — Logos placeholder visibles
- **Archivo:** `src/components/brand/ClientsMarquee.tsx`.
- **Causa raíz:** el array `CLIENTS` incluía `nuevo-cliente-1..4` con alt "Nuevo Cliente 1..4" — placeholders visibles en producción.
- **Fix:** eliminados del carrusel. Quedan los 4 clientes reales: Aura Academy, Goncalves de México, Prisma Industrial, Racarsa. Alt text ahora descriptivo. **No existen assets** de Truper, Sirga ni Zorro en el repo (pendiente de Abelardo si quiere agregarlos).

### P0 — Sin canal de contacto directo global
- **Estado real:** el WhatsApp (52 5650 40 5218) ya existía en el hero de `/empresas`, en `/contacto` y en el flujo de vacantes, pero **no había botón flotante global**, ni CTA de WhatsApp en el hero del home ni en `/precios`. El número estaba duplicado hardcodeado en ≥3 archivos.
- **Fix:** constante única en `src/lib/contact.ts` (número + mensaje pre-llenado "Hola, quiero cotizar una vacante"). Nuevo botón flotante global `src/components/FloatingWhatsApp.tsx` montado en `LayoutChrome.tsx` (todas las páginas públicas; excluye login/register/dashboard con la lógica existente). CTA de WhatsApp agregado al hero del home. Los usos existentes (`WhatsAppButton.tsx`, `PostularButton.tsx`) ahora consumen la constante.

### P1 — Identidad partida agencia vs SaaS en /empresas
- **Estado real:** mayormente resuelto en una iteración previa — el H1 ya es "Reclutamos por ti…", los CTAs ya apuntan a requisición y WhatsApp (no existe "Solicitar demo técnica" ni "Hablar con un experto" sin href), y la garantía de 10 días y las 24 hrs ya aparecen.
- **Lo que sí faltaba y se corrigió:**
  - `/empresas` y `/precios` no exportaban metadata propia (son componentes `'use client'`) → heredaban el `og:url` de la raíz. Fix: `src/app/empresas/layout.tsx` y `src/app/precios/layout.tsx` con title/description/og:url canónicos orientados a reclutamiento.
  - CTA hero: "Solicitar reclutamiento" → "Enviar mi vacante" (más concreto para el prospecto de email frío).
  - Se agregó "diagnóstico sin costo" al bloque CTA final.

### P1 — Header/footer inconsistentes entre páginas
- **Estado real:** el defecto NO existe — hay un solo `Navbar.tsx` y `Footer.tsx` globales vía `LayoutChrome`. Lo que sí contradecía el posicionamiento era el contenido: menú "PLATAFORMA" con items SaaS "PRÓXIMAMENTE" (ATS, Talent CRM).
- **Fix:** navegación simplificada a links directos `Empresas · Psicometrías · Precios · Blog · Vacantes · Contacto` + botón `SOLICITAR TALENTO`. Se eliminó el dropdown PLATAFORMA. Se conservan intactos: Ingresar, menú de usuario autenticado y accesos de candidatos.

### P1 — Testimonios anónimos
- **Archivo:** bloque "Casos de uso" inline en `src/app/empresas/page.tsx` (L209-233) — citas con atribución "Operación industrial · Toluca" sin nombre.
- **Fix:** extraído a `src/components/Testimonials.tsx` con estructura `{ nombre, cargo, empresa, logo?, quote }`. Los datos actuales quedan como están (no se inventaron nombres); los campos nuevos están marcados `[PENDIENTE: testimonio real]` en el código y solo se renderizan cuando se llenen. Abelardo los completa esta semana.

### P2 — Fricción de conversión en /empresas/requisicion
- **Archivo:** `src/components/RequisitionWizard.tsx` — wizard de 6 pasos con ~30 campos.
- **Fix:** nuevo `src/components/QuickRequisitionForm.tsx` con 7 campos (empresa, nombre, puesto, cantidad, zona, WhatsApp/teléfono, email) como vista principal de la página; envía al mismo endpoint `/api/webhooks/perfilador` (que solo exige empresa.nombre + contacto.email + vacante.titulo). El wizard completo queda disponible con un toggle "Prefiero llenar la requisición detallada" — sin modificarlo.

### P2 — FAQ inexistente
- **Fix:** sección FAQ nueva en `/empresas` con 6 preguntas (cómo cobran, garantía de 10 días, tiempo de terna, evaluaciones, CFDI 4.0, zonas de cobertura), redactada solo con datos ya presentes en el sitio.

### P2 — SEO técnico
- `sitemap.ts` y `public/robots.txt` ya existían y están correctos — sin cambios.
- `og:url` corregido con los layouts de segmento (ver P1).
- Alt text de logos de clientes corregido (ver P0).

## Pendientes que requieren dato de Abelardo
1. Testimonios reales (nombre, cargo, empresa) → llenar en `src/components/Testimonials.tsx`.
2. Logos de Truper, Sirga y Zorro si se quieren en el carrusel (subir assets a `public/assets/clientes/`).
3. Confirmar la respuesta de CFDI 4.0 en la FAQ (redactada con el dato de /precios: "CFDI 4.0 disponible").

## Observaciones fuera de alcance (no tocadas)
- `layout.tsx` precarga `/assets/toluca/nevado-1-*.avif` pero solo existen `.webp` — preload muerto (perf menor).
- El `<source type="image/avif">` del marquee pide `.avif` inexistentes (cae a webp sin romper).
- `/psicometrias`, `/vacantes`, login, dashboard y pagos: intactos.
