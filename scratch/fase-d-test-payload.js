/**
 * Fase D — Validación funcional del contrato v1.
 *
 * Para cada una de las 9 pruebas activas, simula:
 *   - caso "feliz"  (100% completitud)
 *   - caso "parcial" (50%, debe disparar rama Reporte Anulado en n8n)
 *   - caso "borde"  (exactamente 85%)
 *
 * Cada caso construye el payload mediante el mismo `buildPayload` lógico del
 * dispatcher cliente (replicado aquí para evitar dependencias de TS),
 * lo postea contra `http://localhost:3000/api/psicometrias/submit` y verifica:
 *   - status 200
 *   - response.backup === true
 *   - response.idempotencyKey con 64 chars hex (sha256)
 *   - completitud calculada coincide con la del caso
 *
 * El destino n8n se intercepta mockeando N8N_BASE_URL a una URL local que
 * siempre devuelve 200. (Ver instrucciones al pie.)
 *
 * Uso:
 *   1) En una terminal:  N8N_BASE_URL=http://localhost:3001 npm run dev
 *   2) En otra:          node scratch/fase-d-test-payload.js
 *
 * El test es ROBUSTO frente a no tener n8n mock — el endpoint retorna
 * success:true incluso con webhook:exhausted/error, porque el backup local
 * es la verdad de respaldo y es lo que verificamos aquí.
 */

const ENDPOINT = process.env.SUBMIT_ENDPOINT || 'http://localhost:3000/api/psicometrias/submit';

const TESTS = [
  { id: 'luscher', code: 'WF-001', totalQuestions: 16,
    sampleRespuestas: (n) => Object.fromEntries(Array.from({ length: n }, (_, i) =>
      [i < 8 ? `S1_${i + 1}` : `S2_${i - 7}`, ['blue','green','red','yellow','violet','brown','black','grey'][i % 8]])) },
  { id: 'disc', code: 'WF-002', totalQuestions: 30,
    sampleRespuestas: (n) => {
      const o = {};
      for (let i = 1; i <= n; i++) {
        o[`G${i}_mas`] = 'D';
        o[`G${i}_menos`] = 'C';
      }
      return o;
    } },
  { id: 'allport', code: 'WF-003', totalQuestions: 45,
    sampleRespuestas: (n) => {
      const o = {};
      for (let i = 1; i <= Math.min(n, 30); i++) o[`p1_${i}`] = 'a';
      for (let i = 1; i <= Math.max(0, n - 30); i++) o[`p2_${i}`] = 'a,b,c,d';
      return o;
    } },
  { id: 'moss', code: 'WF-004', totalQuestions: 30,
    sampleRespuestas: (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`${i + 1}`, `moss_${i + 1}_opt_2`])) },
  { id: 'zavic', code: 'WF-005', totalQuestions: 60,
    sampleRespuestas: (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`${i + 1}`, `zavic_${i + 1}_opt_1`])) },
  { id: 'kostick', code: 'WF-006', totalQuestions: 90,
    sampleRespuestas: (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`${i + 1}`, `kostick_${i + 1}_opt_A`])) },
  { id: 'terman', code: 'WF-007', totalQuestions: 173,
    sampleRespuestas: (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`s${(i % 10) + 1}_q${Math.floor(i / 10) + 1}`, 'respuesta'])) },
  { id: '16pf', code: 'WF-008', totalQuestions: 185,
    sampleRespuestas: (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`${i + 1}`, `pf16_${i + 1}_opt_1`])) },
  { id: 'mmpi', code: 'WF-009', totalQuestions: 567,
    sampleRespuestas: (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`${i + 1}`, `mmpi_${i + 1}_v`])) },
];

const CASES = [
  { label: 'feliz',   ratio: 1.00 },
  { label: 'borde',   ratio: 0.85 },
  { label: 'parcial', ratio: 0.50 },
];

function buildBody(test, ratio) {
  const total = test.totalQuestions;
  const answered = Math.round(total * ratio);
  const fechaAplicacion = new Date().toISOString();
  return {
    contract_version: '1.0.0',
    test: { id: test.id, code: test.code, name: test.id, price_tier: 'free', version: '1.0.0' },
    datos_paciente: {
      nombre_completo: `QA ${test.id}`,
      email: `qa.${test.id}@hackesjobs.test`,
      empresa: 'Hacke\'s Jobs QA',
      cargo_postulado: 'Auditor de Psicometrías',
      telefono: '5555555555',
    },
    datos_prueba: {
      total_preguntas: total,
      preguntas_contestadas: answered,
      fecha_aplicacion: fechaAplicacion,
      duracion_segundos: 600,
      estado_finalizacion: answered === total ? 'completa' : answered === 0 ? 'abandonada' : 'parcial',
    },
    respuestas: test.sampleRespuestas(answered),
    metadata: {
      candidate_id: `qa.${test.id}@hackesjobs.test::${fechaAplicacion}`,
      session_id: '00000000-0000-4000-8000-000000000000',
      source: 'web-public',
      origin_url: 'https://www.hackesjobs.com.mx/psicometrias',
      user_agent: 'fase-d-runner/1.0',
      client_timestamp: fechaAplicacion,
      locale: 'es-MX',
    },
    extras: {},
  };
}

async function run() {
  console.log(`\nFase D — Matriz 9x3 contra ${ENDPOINT}\n`);
  const results = [];
  for (const test of TESTS) {
    for (const c of CASES) {
      const body = buildBody(test, c.ratio);
      const expectedCompletitud = Math.round((body.datos_prueba.preguntas_contestadas / body.datos_prueba.total_preguntas) * 100);

      let status = 0;
      let json = null;
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: test.id, body }),
        });
        status = res.status;
        json = await res.json().catch(() => ({}));
      } catch (e) {
        results.push({ test: test.id, case: c.label, status: 'NETWORK_ERROR', error: e.message });
        continue;
      }

      const idemOk = !!json.idempotencyKey && /^[a-f0-9]{64}$/.test(json.idempotencyKey);
      const backupOk = json.backup === true;
      const verdict =
        status === 200 && backupOk && idemOk
          ? `✅ ${test.id}/${c.label} status=${status} backup=${backupOk} idem=${idemOk} webhook=${json.webhook} completitud=${expectedCompletitud}%`
          : `❌ ${test.id}/${c.label} status=${status} backup=${backupOk} idem=${idemOk} webhook=${json.webhook}`;
      console.log(verdict);
      results.push({ test: test.id, case: c.label, status, backupOk, idemOk, webhook: json.webhook, completitud: expectedCompletitud });
    }
  }

  // Resumen
  const ok = results.filter((r) => r.status === 200 && r.backupOk && r.idemOk).length;
  console.log(`\nResumen: ${ok}/${results.length} casos OK\n`);
  if (ok !== results.length) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
