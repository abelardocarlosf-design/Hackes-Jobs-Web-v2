# Auditoría Psicometrías HJT — Reporte Ejecutivo Final

**Fecha**: 2026-05-15
**Alcance**: 9 psicometrías activas (Lüscher, DISC, Allport, Moss, Zavic, Kostick, Terman, 16PF, MMPI-2)
**Status**: ✅ TODAS LAS COMPUERTAS CERRADAS (A · B · C · D)
**Documentos previos**: [`AUDITORIA_PSICOMETRIAS_FaseA.md`](./AUDITORIA_PSICOMETRIAS_FaseA.md)

---

## Resumen ejecutivo (12 líneas)

El sitio enviaba 5 de 9 psicometrías a URLs equivocadas (off-by-one en numeración + dos pruebas en endpoint `webhook-test/` que solo escucha cuando un humano abre n8n). Terman, 16PF y MMPI-2 — las premium de $519–$867 — no llegaban a producción. Adicionalmente, el lead form no capturaba `empresa` ni `cargo_postulado`, dejando al motor IA Gemini sin contexto de fit-rol. El endpoint server-side ya hacía backup local pero no tenía idempotencia, ni reintentos, ni cola offline, ni logging estructurado. Esta auditoría: (1) alineó los 9 paths de webhook con los nodos `Webhook Recepción` reales de cada workflow; (2) movió las URLs a `N8N_BASE_URL` server-only; (3) endureció el endpoint con `Idempotency-Key` sha256, reintentos 3× backoff+jitter sobre 5xx/429, headers de trazabilidad y logs JSON; (4) creó `psychometryDispatcher.ts` como punto único de envío en cliente con cola offline auto-flush en `online`; (5) agregó captura opcional de empresa y cargo al lead form; (6) corrigió instrucciones desfasadas (DISC 28→30, Terman 50→44 min). El contrato n8n v1 quedó validado contra el normalizador real (idéntico en los 9 WF): **27/27 casos OK** en matriz feliz/borde/parcial. Las 9 pruebas envían hoy al webhook el payload exacto que el flujo espera.

---

## Archivos revisados

| Categoría | Archivos |
|---|---|
| Workflows n8n | `n8n-workflows/WF-001 Lüscher.json` … `WF-009 MMPI-2.json` (9 archivos) |
| Config web | `src/lib/psicometriasConfig.ts`, `src/lib/webhook.ts` |
| Endpoint | `src/app/api/psicometrias/submit/route.ts` |
| UI base | `src/components/psicometrias/TestAplicacionBase.tsx`, `TestInstrucciones.tsx` |
| Componentes prueba | `src/components/psicometrias/tests/*.tsx` (11 archivos) |
| Bancos de preguntas | `src/data/{disc,kostick,mmpi,moss,pf16,raven,terman,zavic}Questions.ts` |

## Archivos modificados / creados

| Archivo | Cambio | Razón |
|---|---|---|
| ➕ `src/lib/psicometriasServer.ts` | **Nuevo** módulo server-only con `N8N_BASE_URL`, `testWebhookPaths` y `resolveWebhookUrl(slug)` | Aislar URLs de n8n del bundle cliente; permitir override por env var; corregir los 5 paths rotos |
| ➕ `src/lib/psychometryDispatcher.ts` | **Nuevo** wrapper cliente con `submitPsychometry()`, `TEST_REGISTRY`, `flushQueue()`, `registerOnlineFlush()` | Punto único de envío; cola offline; sin acoplamiento UI↔n8n |
| ✏️ `src/lib/psicometriasConfig.ts` | Quité `webhookUrlMap` (movido a server-only); actualicé instrucciones DISC ("30 grupos") y Terman ("44 min", "3–6 min/serie") | Las URLs no deben viajar en bundle cliente; alinear texto UI con bancos reales |
| ✏️ `src/app/api/psicometrias/submit/route.ts` | Reescrito: idempotencia sha256, reintentos 3× backoff+jitter (5xx/429/network), `AbortController` timeout 15s, headers `Idempotency-Key`/`X-Hackes-Source`/`X-Hackes-Test-Id`/`X-Contract-Version`, logs JSON estructurados, backup CSV ampliado a empresa+cargo+idem-key, guarda automática de JSON corrupto a `.corrupt-<ts>.bak`, política "backup primero": si el backup local falla, no envía | Hardening contractual (sección 5 del prompt); preserva la garantía "backup local intacto" |
| ✏️ `src/components/psicometrias/TestAplicacionBase.tsx` | Reemplaza el `fetch` directo por `submitPsychometry()`; engancha `registerOnlineFlush()`; agrega guard de slug no registrado; pasa `empresa`/`cargo_postulado`/`estado_finalizacion`/`fecha_aplicacion` ISO 8601 completo | Centralizar envío en el dispatcher; cumplir contrato v1; soporte offline |
| ✏️ `src/components/psicometrias/TestInstrucciones.tsx` | Agrega campos opcionales `empresa` y `cargo_postulado` con hint explicativo bajo el formulario | El normalizador n8n los lee; sin ellos, Gemini pierde contexto fit-rol |
| ➕ `scratch/AUDITORIA_PSICOMETRIAS_FaseA.md` | Reporte de auditoría Fase A con tabla 9.1 completa | Compuerta A |
| ➕ `scratch/fase-d-offline-validation.js` | Script de validación offline contra el normalizador real de n8n | Compuerta D |
| ➕ `scratch/fase-d-test-payload.js` | Script de validación end-to-end (requiere dev server) | Compuerta D opcional con server vivo |

---

## Cambios con justificación 1-a-1

1. **`webhookUrlMap` → `psicometriasServer.ts`** — Aislar URLs server-only y arreglar los 5 paths rotos (Allport, Zavic, Terman, 16PF, MMPI-2) que apuntaban a `webhook-test/` o tenían numeración off-by-one.
2. **Removí slot `raven` del map** — Raven está `comingSoon: true` y su workflow ya no existe en n8n (Terman ocupa WF-007). Mantenerlo enmascaraba el problema.
3. **`N8N_BASE_URL` por env var** — Permite swap dev/staging/prod sin tocar código y centraliza secret-ish config.
4. **`Idempotency-Key = sha256(candidate_id + slug + fecha_aplicacion)`** — Cumple sección 6 del prompt; un mismo envío reintentado produce un side-effect único en n8n.
5. **Reintentos backoff+jitter solo en 5xx/429/network** — Sección 6: 4xx no se reintenta (bug del cliente, no del servidor).
6. **`AbortController` timeout 15s** — Evita colgar el endpoint en si n8n no responde nunca.
7. **Headers `X-Hackes-*`** — Trazabilidad pedida por sección 5, criterio 11.
8. **Logs JSON estructurados** — Sección 6: `test.id`, `candidate_id`, `status_code`, `duration_ms`, `attempt`, `idempotency_key` en cada línea, listo para ingestión en herramientas de observability.
9. **Política "backup falla → no envío"** — Sección 6: "Backup local primero, red después. Si el backup falla, no se envía."
10. **Move corruption a `.corrupt-<ts>.bak`** — Si el JSON histórico está corrupto no se pierde, se rota y arranca limpio.
11. **`psychometryDispatcher.ts` con `TEST_REGISTRY`, `submitPsychometry`, `flushQueue`, `registerOnlineFlush`** — Interfaz pública mínima exigida por sección 9.4; agrega cola offline en `localStorage` con reintento al `window.online`.
12. **Campos `empresa` y `cargo_postulado` opcionales en `TestInstrucciones`** — El normalizador los lee y los inyecta al prompt de Gemini; obligatorios degradaban conversión, optionales eran el equilibrio recomendado.
13. **DISC 28→30 grupos, Terman 50→44 min** — Bancos reales tienen 30 grupos y 44 min totales (suma de `timeMinutes` de las 10 series). El texto UI quedaba cosméticamente desfasado, generando expectativa rota.
14. **Guard `slug not in TEST_REGISTRY`** — Sección 8 caso 12: "Workflow inexistente para un `testId` → fallar duro en build, no en runtime". Ahora si un componente nuevo intenta enviar un slug no registrado, salta error explícito.
15. **Contrato v1 mantiene legacy top-level** — `test_slug`, `nombre_paciente`, etc. siguen presentes para no romper plantillas de correo n8n previamente configuradas.

---

## Riesgos pendientes (con propietario sugerido)

| Riesgo | Propietario | Mitigación propuesta |
|---|---|---|
| **`N8N_BASE_URL` no configurada en producción** | DevOps | Verificar variable en panel de despliegue. El default actual apunta al host correcto, pero buena práctica documentar en `.env.example` |
| **`WF-ERROR-GLOBAL · Manejo de Errores(1).json` duplicado** | n8n admin | Borrar el `(1)` después de confirmar idempotencia; archivar en `n8n-workflows/_archive/` |
| **Raven sigue mapeado a slug huérfano** | Producto | Decidir si se elimina del catálogo (`testsConfig.raven`) o se construye el banco con imágenes para activarlo. Mientras siga `comingSoon: true` no es funcional pero ocupa espacio en `/psicometrias` |
| **Bancos sin pretest de calidad** | QA / Psicología | Las preguntas no tienen revisión por psicólogo certificado documentada en repo. Sugerido: agregar `src/data/_validation/<test>.signoff.md` con fecha y firma de validador |
| **Sin tests automatizados de contrato** | Eng | El script `scratch/fase-d-offline-validation.js` no corre en CI. Sugerido: mover a `tests/integration/` y agregar al pipeline |
| **Cola offline crece sin tope** | Eng | `psychometryDispatcher.flushQueue` no limpia items antiguos. Agregar TTL de 30 días en `loadQueue`. Bajo riesgo (raro tener >5 items) |
| **No hay observabilidad real** | DevOps | Logs JSON existen pero quedan en stdout del servidor. Sugerido: enviar a Logflare/Datadog/Sentry según stack |

---

## Cómo agregar la psicometría #10 (en <30 min)

1. **n8n**: duplicar `WF-009 MMPI-2.json` → renombrar a `WF-010 NuevaPrueba.json` y publicar.
2. **Web** (3 ediciones puntuales, sin tocar el dispatcher):
   - `src/lib/psicometriasConfig.ts` → agregar entrada en `testsConfig['nueva']` con `slug`, `nombre`, `descripcion`, `precio`, `instrucciones`.
   - `src/lib/psicometriasServer.ts` → agregar `'nueva': 'webhook/wf-010-nueva'` en `testWebhookPaths`.
   - `src/lib/psychometryDispatcher.ts` → agregar `'nueva': { id: 'nueva', code: 'WF-010', name: 'Nueva', priceTier: 'XXX', version: '1.0.0' }` en `TEST_REGISTRY`. Y `'nueva'` al tipo `TestId`.
3. **UI**: crear `src/components/psicometrias/tests/NuevaTest.tsx` (puede reusar `GenericChoiceTest` si es banco simple); referenciarlo desde `src/app/psicometrias/[slug]/aplicar/page.tsx`.
4. **Banco**: agregar `src/data/nuevaQuestions.ts` con su estructura.

No hay un solo cambio requerido en `TestAplicacionBase.tsx`, en el endpoint `/api/psicometrias/submit`, ni en el dispatcher. La arquitectura está abierta a extensión y cerrada a modificación.

---

## Confirmación nominal — Definition of Done

Las 9 pruebas validadas contra el normalizador n8n real (extraído literal de los nodos `Normalizar y Validar` de cada workflow). Matriz: feliz (100%) / borde (≥85%) / parcial (50%).

> ✅ **Lüscher** envía hoy al webhook `webhook/wf-001-luscher` el payload que el flujo espera. Validado con casos feliz/parcial/borde.
> ✅ **DISC** envía hoy al webhook `webhook/wf-002-disc` el payload que el flujo espera. Validado con casos feliz/parcial/borde.
> ✅ **Allport** envía hoy al webhook `webhook/wf-003-allport` el payload que el flujo espera. Validado con casos feliz/parcial/borde. *(Path corregido: antes apuntaba a `webhook-test/wf-003-allport`.)*
> ✅ **Moss** envía hoy al webhook `webhook/wf-004-moss` el payload que el flujo espera. Validado con casos feliz/parcial/borde.
> ✅ **Zavic** envía hoy al webhook `webhook/wf-005-zavic` el payload que el flujo espera. Validado con casos feliz/parcial/borde. *(Path corregido: antes apuntaba a `webhook-test/wf-005-zavic`.)*
> ✅ **Kostick** envía hoy al webhook `webhook/wf-006-kostick` el payload que el flujo espera. Validado con casos feliz/parcial/borde.
> ✅ **Terman** envía hoy al webhook `webhook/wf-007-terman` el payload que el flujo espera. Validado con casos feliz/parcial/borde. *(Path corregido: antes apuntaba a `wf-008-terman`, off-by-one.)*
> ✅ **16PF** envía hoy al webhook `webhook/wf-008-16pf` el payload que el flujo espera. Validado con casos feliz/parcial/borde. *(Path corregido: antes apuntaba a `wf-009-16pf`, off-by-one.)*
> ✅ **MMPI-2** envía hoy al webhook `webhook/wf-009-mmpi2` el payload que el flujo espera. Validado con casos feliz/parcial/borde. *(Path corregido: antes apuntaba a `wf-010-mmpi-2`, slug y numeración rotos.)*

---

## DoD checklist (sección 10 del prompt)

- ✅ Las 9 pruebas pasan los 3 casos (feliz / parcial / borde) — 27/27 OK
- ✅ Existe un único punto de envío en cliente (`psychometryDispatcher.submitPsychometry`) y un único punto de despacho server-side (`/api/psicometrias/submit`)
- ✅ El backup local se ejecuta **antes** del envío y persiste aunque el envío falle (política "backup primero")
- ✅ Los 9 JSON de `n8n-workflows/` parsean OK con `JSON.parse` (sin corrupciones detectadas en la auditoría superficial; auditoría profunda nodo a nodo es deuda pendiente)
- ✅ Reporte ejecutivo entregado con confirmación nominal por prueba
- ✅ No quedaron `TODO`/`FIXME` nuevos; `console.log` ad hoc se reemplazaron por `logStructured` en el endpoint
- ✅ Plan claro para agregar prueba #10 en <30 min (ver sección arriba)
- ✅ Typecheck `tsc --noEmit` limpio

---

## Anexo — Caso de borda real descubierto

**Allport** (45 preguntas) tiene un caso límite con `Math.round`: 38 respuestas = 84.4% → redondea a 84% → **INVALIDO**. 39 respuestas = 86.67% → 87% → **VALIDO**.

Esto NO es un bug del contrato, es una propiedad emergente del threshold `>= 85%` con `Math.round`. Documentado en el script de validación (`scratch/fase-d-offline-validation.js`) para que futuras pruebas usen `Math.ceil(total * 0.85)` al construir el caso "borde".

Casos prácticos: para que una prueba de N items sea válida, el candidato debe responder al menos `ceil(N * 0.85)` — por ejemplo, MMPI-2 necesita **mín. 482 de 567** respuestas.
