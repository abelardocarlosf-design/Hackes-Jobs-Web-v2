# Auditoría Psicometrías HJT — Fase A (Cierre de Compuerta A)

**Fecha**: 2026-05-15
**Alcance**: 9 psicometrías activas en producción
**Status**: ✅ Compuerta A cerrada. Listo para Fase B.

---

## TL;DR ejecutivo

1. **El normalizador de los 9 workflows es idéntico** (785 chars exactos). El contrato n8n es **uno solo y genérico**. La diferenciación vive en el prompt de Gemini.
2. **3 de 9 pruebas premium NO llegan a producción hoy**: Terman, 16PF, MMPI-2 — los `path` del `webhookUrlMap` están mal numerados (off-by-one + slug roto en MMPI-2).
3. **2 de 9 pruebas dependen de un humano abriendo n8n**: Allport y Zavic usan `webhook-test/...` (modo "Listen for test event"), no `webhook/...` de producción.
4. **El formulario lead omite 2 campos del contrato n8n**: `empresa` y `cargo_postulado`. El normalizador los rellena con `"No especificado"` — Gemini pierde contexto de fit-rol.
5. **El backup local funciona** (CSV + JSON dual en `/backups`) y se ejecuta **antes** del POST a n8n. Esa garantía la conservamos.
6. **No hay idempotencia, ni cola offline, ni reintentos** en el endpoint `/api/psicometrias/submit`. Un 5xx de n8n se traga silencioso.
7. **Las preguntas se renderizan correctamente** en los 9 componentes — los bancos están consistentes con lo declarado en `psicometriasConfig.ts` salvo dos casos menores (DISC: 30 vs 28 declarado; Terman: tiempo total 44 min vs 50 min declarado).
8. **Sigue un slot fantasma de Raven** (`comingSoon: true`) que mapea a `wf-007-raven` inexistente en n8n. Inocuo mientras siga `comingSoon`.

---

## A.1 Contrato literal del normalizador n8n (idéntico en los 9 WF)

Código del nodo `Normalizar y Validar` (extraído de `WF-001 Lüscher.json`, verificado idéntico en los 9):

```js
const body=($input.item.json.body)||{};
const dp=body.datos_paciente||{};
const dt=body.datos_prueba||{};
const total=Number(dt.total_preguntas||0);
const contestadas=Number(dt.preguntas_contestadas||0);
const completitud=total>0?Math.round((contestadas/total)*100):0;
const es_valido=completitud>=85;
const email=(dp.email||'').trim().toLowerCase();
const candidate_id=email?email+'::'+(dt.fecha_aplicacion||Date.now()):'anon::'+Date.now();
return{json:{
  candidate_id, nombre:(dp.nombre_completo||'').trim(), email,
  empresa:dp.empresa||'No especificado',
  cargo:dp.cargo_postulado||'No especificado',
  fecha:dt.fecha_aplicacion||new Date().toISOString(),
  total, contestadas, completitud, es_valido,
  validez_flag:es_valido?'VALIDO':'INVALIDO_INCOMPLETO',
  respuestas_str:JSON.stringify(body.respuestas||{})
}};
```

**Lo que n8n REALMENTE lee del payload (ley):**

| Ruta | Tipo | Requerido | Default si falta |
|---|---|---|---|
| `body.datos_paciente.nombre_completo` | string | ✅ | `''` |
| `body.datos_paciente.email` | string | ✅ | `''` → forza `candidate_id = anon::<ts>` |
| `body.datos_paciente.empresa` | string | ⚠️ opcional | `'No especificado'` |
| `body.datos_paciente.cargo_postulado` | string | ⚠️ opcional | `'No especificado'` |
| `body.datos_prueba.total_preguntas` | number | ✅ | `0` → completitud=0 → invalida la prueba |
| `body.datos_prueba.preguntas_contestadas` | number | ✅ | `0` |
| `body.datos_prueba.fecha_aplicacion` | string | ✅ | `new Date().toISOString()` |
| `body.respuestas` | objeto opaco | ✅ | `{}` → Gemini no puntúa |

Gemini lee SOLO `$json.nombre`, `$json.empresa`, `$json.cargo`, `$json.completitud`, `$json.respuestas_str`. Es decir: el resto (telefono, métricas extras, etc.) **no llega a Gemini** y no afecta el reporte.

---

## A.2 Payload real que la web envía hoy (`TestAplicacionBase.tsx:103-140`)

```js
{
  slug,                              // top-level del client → API
  body: {
    // Top-level redundantes
    test_slug, test_nombre,
    nombre_paciente, email_paciente, telefono_paciente,
    total_preguntas_test, total_preguntas_respondidas,
    porcentaje_completitud, prueba_incompleta, time_out_agotado,
    // Sub-objetos contrato n8n
    datos_paciente: { nombre_completo, email, telefono },     // ❌ falta empresa, cargo_postulado
    datos_prueba: {
      test_slug, test_nombre,
      fecha_aplicacion,                                        // ⚠️ formato 'YYYY-MM-DD' no ISO 8601 completo
      tiempo_completado_minutos, time_out_agotado,
      total_preguntas, total_preguntas_test,                   // duplicado
      preguntas_contestadas, total_preguntas_respondidas,      // duplicado
      porcentaje_completitud, prueba_incompleta
    },
    respuestas: <objeto opaco específico de cada test>
  }
}
```

El endpoint `/api/psicometrias/submit` toma el `body`, lo pone en `/backups/respuestas_completas.json` + CSV, y lo reenvía sin modificar a `webhookUrlMap[slug]`.

---

## A.3 Tabla 9.1 — Discrepancias por prueba

Severidad: `bloqueante` impide que n8n procese / `mayor` rompe la calidad del reporte / `menor` ruido aceptable / `cosmética` UX

| Prueba | JSON n8n | Webhook path real | Webhook path en web | Forma `respuestas` | Diferencias | Severidad | Veredicto |
|---|---|---|---|---|---|---|---|
| **Lüscher** | `WF-001 Lüscher.json` | `/webhook/wf-001-luscher` | `/webhook/wf-001-luscher` ✅ | `{S1_1..S1_8, S2_1..S2_8}` flat | falta empresa/cargo; fecha_aplicacion solo 'YYYY-MM-DD' | menor | **DESINCRONIZADA** |
| **DISC** | `WF-002 DISC.json` | `/webhook/wf-002-disc` | `/webhook/wf-002-disc` ✅ | `{G{1..30}_mas, G{1..30}_menos}` con valores D/I/S/C | banco real = 30 preguntas, instrucciones UI dicen 28; falta empresa/cargo | menor | **DESINCRONIZADA** |
| **Allport** | `WF-003 Allport.json` | `/webhook/wf-003-allport` | `/webhook-test/wf-003-allport` 🔴 | parte 1: `{p1_1..p1_30}` a\|b; parte 2: `{p2_1..p2_15}` CSV ordenado 'a,c,b,d' | usa endpoint **webhook-test** (requiere n8n en modo Listen); falta empresa/cargo | **bloqueante** | **DESINCRONIZADA** |
| **Moss** | `WF-004 Moss.json` | `/webhook/wf-004-moss` | `/webhook/wf-004-moss` ✅ | `{1..30}: 'moss_N_opt_X'` | falta empresa/cargo | menor | **DESINCRONIZADA** |
| **Zavic** | `WF-005 Zavic.json` | `/webhook/wf-005-zavic` | `/webhook-test/wf-005-zavic` 🔴 | `{1..60}: 'zavic_N_opt_X'` | usa **webhook-test**; falta empresa/cargo | **bloqueante** | **DESINCRONIZADA** |
| **Kostick** | `WF-006 Kostick.json` | `/webhook/wf-006-kostick` | `/webhook/wf-006-kostick` ✅ | `{1..90}: 'kostick_N_opt_A\|B'` | falta empresa/cargo | menor | **DESINCRONIZADA** |
| **Terman** | `WF-007 Terman.json` | `/webhook/wf-007-terman` | `/webhook/wf-008-terman` 🔴 | `{s{1..10}_q{1..N}}` flat | path **off-by-one**; instrucciones UI dicen 50 min, suma real series = 44 min; falta empresa/cargo | **bloqueante** | **DESINCRONIZADA** |
| **16PF** | `WF-008 16PF.json` | `/webhook/wf-008-16pf` | `/webhook/wf-009-16pf` 🔴 | `{1..185}: 'pf16_N_opt_{1\|2\|3}'` | path **off-by-one**; falta empresa/cargo | **bloqueante** | **DESINCRONIZADA** |
| **MMPI-2** | `WF-009 MMPI-2.json` | `/webhook/wf-009-mmpi2` | `/webhook/wf-010-mmpi-2` 🔴 | `{1..567}: 'mmpi_N_v\|mmpi_N_f'` | path **off-by-one Y slug roto** (`wf-010-mmpi-2` vs `wf-009-mmpi2`); falta empresa/cargo | **bloqueante** | **DESINCRONIZADA** |

**Total**: 5 bloqueantes (Allport, Zavic, Terman, 16PF, MMPI-2) · 4 menores recuperables (Lüscher, DISC, Moss, Kostick)

### Extras detectados (no en la tabla principal)

- **Raven** está marcado `comingSoon: true` en config; mapea a `/webhook/wf-007-raven` que **ya no existe** en n8n (Terman ocupa el slot 007). Inocuo mientras siga `comingSoon`, pero el slot del map debe eliminarse.
- **`WF-ERROR-GLOBAL · Manejo de Errores(1).json`** parece duplicado del original. Housekeeping pendiente.
- **`scripts/generate_n8n.js`** + `scripts/migrate-n8n-workflows.js` existen — hay generación programática previa. Validar si se sigue usando.

---

## A.4 Render de preguntas — verificación visual y de contenido

| Prueba | Banco | Cantidad declarada (instrucciones UI) | Cantidad real (banco) | Match | Notas |
|---|---|---|---|---|---|
| Lüscher | hardcoded en `LuscherTest.tsx` | 8 colores × 2 secuencias = 16 selecciones | 16 selecciones ✅ | ✅ | UI clara, ofrece reset por secuencia |
| DISC | `discQuestions.ts` | 28 grupos (instrucciones) | 30 grupos ✅ existen | ⚠️ | Instrucciones desactualizadas: dicen 28, banco tiene 30. **Acción**: actualizar texto a "30 grupos" |
| Allport | hardcoded `ALLPORT_PART_1/2` | 45 preguntas (30+15) | 45 ✅ | ✅ | Parte 1 binaria con auto-advance OK; Parte 2 ranking con índices visibles OK |
| Moss | `mossQuestions.ts` | 30 situaciones | 30 ✅ | ✅ | Cada pregunta arranca con prefijo `Situación N.` redundante con UI |
| Zavic | `zavicQuestions.ts` | 60 reactivos | 60 ✅ | ✅ | Prefijo `Caso N.` redundante |
| Kostick | `kostickQuestions.ts` | 90 pares A/B | 90 ✅ | ✅ | Prefijo `Par N.` redundante |
| Raven | `ravenQuestions.ts` | 60 figuras | 60 ✅ pero **NO HAY IMÁGENES** (banco solo texto) | ⚠️ | `comingSoon: true` justificadamente — sin material visual la prueba no se aplica |
| Terman | `termanQuestions.ts` (10 series) | 50 min total | 44 min total real (suma de `timeMinutes`) | ⚠️ | Texto en UI dice 50, suma series = 44. **Acción**: actualizar texto a "44 min" o ajustar series |
| 16PF | `pf16Questions.ts` | 185 ítems × 3 opciones | 185 ✅ × 3 ✅ | ✅ | Prefijo `Ítem N.` redundante |
| MMPI-2 | `mmpiQuestions.ts` | 567 afirmaciones V/F | 567 ✅ × 2 ✅ | ✅ | Prefijo `Reactivo N.` redundante; reporte clínico solo para certificados (correcto, ya advertido en UI) |

### Hallazgos UX adicionales

1. **Terman**: el componente tiene su propio cronómetro de sub-serie + `TestAplicacionBase` puede tener `timeLimitMinutes` global. **Verificar** que `TermanTest.tsx` NO pase `timeLimitMinutes` al base para evitar doble cronómetro. Revisión rápida en línea 76-82: efectivamente **no lo pasa** ✅.
2. **DISC**: el botón `Finalizar` sigue habilitado aunque falten grupos por completar — depende solo del cronómetro (Lüscher/DISC/Allport no usan cronómetro, así que `Finalizar` se habilita por `isComplete`). Validado contra `TestAplicacionBase.tsx:210`: `disabled={!isComplete && timeLeft !== null && timeLeft > 0}` → correcto.
3. **Lead form**: no se piden `empresa` ni `cargo`. Esto degrada el reporte porque Gemini deriva fit-rol del cargo. **Crítico para B2B**, aceptable para self-assessment de candidato anónimo.

---

## A.5 Defectos detectados en JSON de n8n

Revisión rápida del nodo `Sheets Respaldar` en los 9 workflows (bug histórico con `columns` carácter por carácter):

```bash
$ node -e "..." # verificar JSON parse
```

Resultado: **los 9 JSON parsean OK con `JSON.parse`**, sin estructuras malformadas detectadas a nivel superficial. La auditoría profunda de cada nodo `Sheets Respaldar` queda como sub-tarea de Fase C.3.

---

## Compuerta A — Veredicto

✅ **CERRADA**. Resumen:

- 9 archivos JSON auditados (paths verificados).
- 9 handlers de web mapeados (todos pasan por `TestAplicacionBase` + `/api/psicometrias/submit`, **un único punto de envío ya existe** — buena noticia, no hay que crear el dispatcher desde cero, sino endurecerlo).
- Tabla 9.1 completa con veredicto y severidad por prueba.
- **Decisión arquitectónica**: ya existe un dispatcher server-side (`/api/psicometrias/submit`). La Fase C lo refactoriza en lugar de reemplazarlo. La interfaz pública `psychometryDispatcher.ts` la implementaremos como **wrapper cliente** que sigue llamando al endpoint server-side (el server-side se queda como guardián del backup local y de las URLs de n8n, lo cual respeta la restricción "prohibido secrets en cliente").

---

## Próximos pasos (Fase B + C)

### Fase B — Contrato v1 y registro declarativo (paper-only)

1. Definir `TestConfig` por prueba con `id`, `code`, `webhookPath`, `priceTier`, `mapper(rawState)`, `validators`, `extrasBuilder`.
2. Mover el `webhookUrlMap` a un registro server-side y arreglar los 5 paths rotos (Allport, Zavic, Terman, 16PF, MMPI-2).
3. Definir el header `Idempotency-Key = sha256(candidate_id + test.id + fecha_aplicacion)`.
4. Decidir UX de captura de `empresa` y `cargo_postulado` (proponemos: agregarlos al `TestInstrucciones` lead form como **opcionales** para no romper conversión).

### Fase C — Implementación

1. **Sanear `psicometriasConfig.ts`**: corregir `webhookUrlMap` con los paths reales de n8n.
2. **Eliminar el slot `raven` del map** (queda en `testsConfig` como `comingSoon`).
3. **Endurecer `/api/psicometrias/submit/route.ts`** con: idempotency, reintentos backoff+jitter, cola offline (la cola vivirá client-side en localStorage + reintento on `online`).
4. **Crear `src/lib/psychometryDispatcher.ts`** como wrapper client-side con la interfaz pública del prompt (signature `submitPsychometry(testId, rawState)`).
5. **Mapper por prueba**: ya existen `handleFinalSubmit` en cada test — los movemos a `mappers/<test>.ts` y los invoca el dispatcher para producir el `respuestas` final + `extras`.
6. **Agregar campos `empresa` y `cargo_postulado`** al lead form (`TestInstrucciones.tsx`) como **opcionales**.
7. **Actualizar instrucciones desfasadas**: DISC "30 grupos", Terman "44 min".
8. **Eliminar duplicado** `WF-ERROR-GLOBAL · Manejo de Errores(1).json`.

### Fase D — Validación

Matriz 9×3 (feliz/parcial/borde) ejecutada con script Node que hace POST directo al endpoint local `/api/psicometrias/submit` para verificar:
- Backup local generado pre-envío.
- Header `Idempotency-Key` presente.
- n8n responde 200 en feliz/borde, dispara rama Reporte Anulado en parcial.

---

## Preguntas para confirmar antes de Fase C

1. **¿Capturamos `empresa` y `cargo_postulado` en el lead form?** Opciones:
   - (a) Sí, como obligatorios (mejor reporte, peor conversión).
   - (b) Sí, como opcionales (recomendado).
   - (c) No, dejar default `'No especificado'` (estado actual).
2. **El dominio de n8n** `https://hackesjobs-n8n.3hrktu.easypanel.host` — ¿lo movemos a `process.env.N8N_BASE_URL` (recomendado) o lo dejamos hardcoded?
3. **Confirmar nuevas instrucciones UI**: DISC = "30 grupos" (no 28), Terman = "44 min" (no 50). ¿OK?
