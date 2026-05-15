/**
 * Fase D OFFLINE — Aplica el normalizador real de n8n (extraído literal de los
 * 9 workflows) contra los payloads que produce el nuevo `psychometryDispatcher`.
 *
 * Si esto pasa, el flujo n8n recibirá los datos en el formato exacto que espera
 * sin necesidad de levantar el servidor ni golpear n8n.
 */

const crypto = require('crypto');

// ─── Normalizador real de n8n (idéntico en los 9 workflows) ─────────────────
function n8nNormalize(body) {
  const dp = body.datos_paciente || {};
  const dt = body.datos_prueba || {};
  const total = Number(dt.total_preguntas || 0);
  const contestadas = Number(dt.preguntas_contestadas || 0);
  const completitud = total > 0 ? Math.round((contestadas / total) * 100) : 0;
  const es_valido = completitud >= 85;
  const email = (dp.email || '').trim().toLowerCase();
  const candidate_id = email
    ? email + '::' + (dt.fecha_aplicacion || Date.now())
    : 'anon::' + Date.now();
  return {
    candidate_id,
    nombre: (dp.nombre_completo || '').trim(),
    email,
    empresa: dp.empresa || 'No especificado',
    cargo: dp.cargo_postulado || 'No especificado',
    fecha: dt.fecha_aplicacion || new Date().toISOString(),
    total,
    contestadas,
    completitud,
    es_valido,
    validez_flag: es_valido ? 'VALIDO' : 'INVALIDO_INCOMPLETO',
    respuestas_str: JSON.stringify(body.respuestas || {}),
  };
}

// ─── buildPayload del dispatcher (replicado para correr sin TS) ─────────────
const CONTRACT_VERSION = '1.0.0';
const REGISTRY = {
  luscher: { code: 'WF-001', name: 'Lüscher',  priceTier: 'free' },
  disc:    { code: 'WF-002', name: 'DISC',     priceTier: 'free' },
  allport: { code: 'WF-003', name: 'Allport',  priceTier: 'free' },
  moss:    { code: 'WF-004', name: 'Moss',     priceTier: '349'  },
  zavic:   { code: 'WF-005', name: 'Zavic',    priceTier: '349'  },
  kostick: { code: 'WF-006', name: 'Kostick',  priceTier: '349'  },
  terman:  { code: 'WF-007', name: 'Terman',   priceTier: '519'  },
  '16pf':  { code: 'WF-008', name: '16PF',     priceTier: '867'  },
  mmpi:    { code: 'WF-009', name: 'MMPI-2',   priceTier: '867'  },
};

function buildPayload(testId, input) {
  const cfg = REGISTRY[testId];
  const c = input.candidate;
  const m = input.metrics;
  const completitudPct = m.total_preguntas > 0
    ? Math.round((m.preguntas_contestadas / m.total_preguntas) * 100)
    : 0;
  return {
    contract_version: CONTRACT_VERSION,
    test: { id: testId, code: cfg.code, name: cfg.name, price_tier: cfg.priceTier, version: '1.0.0' },
    datos_paciente: {
      nombre_completo: (c.nombre_completo || '').trim(),
      email: (c.email || '').trim().toLowerCase(),
      empresa: c.empresa?.trim() || 'No especificado',
      cargo_postulado: c.cargo_postulado?.trim() || 'No especificado',
      telefono: c.telefono || '',
    },
    datos_prueba: {
      total_preguntas: m.total_preguntas,
      preguntas_contestadas: m.preguntas_contestadas,
      fecha_aplicacion: m.fecha_aplicacion,
      duracion_segundos: m.duracion_segundos,
      estado_finalizacion: m.estado_finalizacion,
      porcentaje_completitud: completitudPct,
    },
    respuestas: input.respuestas,
    metadata: { source: 'web-public', locale: 'es-MX' },
    extras: {},
  };
}

// ─── Test fixtures ─────────────────────────────────────────────────────────
const TESTS = [
  { id: 'luscher', total: 16  },
  { id: 'disc',    total: 30  },
  { id: 'allport', total: 45  },
  { id: 'moss',    total: 30  },
  { id: 'zavic',   total: 60  },
  { id: 'kostick', total: 90  },
  { id: 'terman',  total: 173 },
  { id: '16pf',    total: 185 },
  { id: 'mmpi',    total: 567 },
];
const CASES = [
  { label: 'feliz',   ratio: 1.00, expectValido: true  },
  { label: 'borde',   ratio: 0.85, expectValido: true  },
  { label: 'parcial', ratio: 0.50, expectValido: false },
];

function sampleRespuestas(testId, n) {
  const r = {};
  for (let i = 0; i < n; i++) r[`q${i + 1}`] = 'x';
  return r;
}

let pass = 0, fail = 0;
const failures = [];

for (const t of TESTS) {
  for (const c of CASES) {
    // El normalizador n8n usa Math.round((contestadas/total)*100) y compara con >=85.
    // El umbral "borde" exacto es `Math.ceil(total * 0.85)` (mínimo n que satisface
    // Math.round(n/total*100) >= 85). Usamos esa fórmula para evitar falsos negativos
    // en pruebas con tamaños no múltiplos de 100/85 (ej. Allport con 45).
    const answered = c.label === 'borde'
      ? Math.ceil(t.total * 0.85)
      : Math.round(t.total * c.ratio);
    const fecha = new Date().toISOString();
    const input = {
      candidate: {
        nombre_completo: `QA ${t.id}`,
        email: `qa.${t.id}@hackesjobs.test`,
        telefono: '5555555555',
        empresa: 'Hacke\'s Jobs QA',
        cargo_postulado: 'Auditor',
      },
      metrics: {
        total_preguntas: t.total,
        preguntas_contestadas: answered,
        fecha_aplicacion: fecha,
        duracion_segundos: 600,
        estado_finalizacion: answered === t.total ? 'completa' : 'parcial',
      },
      respuestas: sampleRespuestas(t.id, answered),
    };
    const payload = buildPayload(t.id, input);
    const out = n8nNormalize(payload);

    // Assertions
    const checks = [];
    checks.push(['candidate_id formato', out.candidate_id === `qa.${t.id}@hackesjobs.test::${fecha}`]);
    checks.push(['nombre presente',      out.nombre === `QA ${t.id}`]);
    checks.push(['empresa fluye',        out.empresa === 'Hacke\'s Jobs QA']);
    checks.push(['cargo fluye',          out.cargo === 'Auditor']);
    checks.push(['fecha ISO',            out.fecha === fecha]);
    checks.push(['total correcto',       out.total === t.total]);
    checks.push(['contestadas correcto', out.contestadas === answered]);
    checks.push(['completitud %',        out.completitud === Math.round((answered / t.total) * 100)]);
    checks.push(['es_valido coincide',   out.es_valido === c.expectValido]);
    checks.push(['validez_flag coincide', out.validez_flag === (c.expectValido ? 'VALIDO' : 'INVALIDO_INCOMPLETO')]);
    checks.push(['respuestas_str parsea', (() => { try { JSON.parse(out.respuestas_str); return true; } catch { return false; }})()]);

    const allOk = checks.every(([, ok]) => ok);
    if (allOk) {
      console.log(`✅ ${t.id.padEnd(8)} / ${c.label.padEnd(8)} total=${t.total} answered=${answered} completitud=${out.completitud}% validez=${out.validez_flag}`);
      pass++;
    } else {
      console.log(`❌ ${t.id} / ${c.label}: fallos →`);
      checks.filter(([, ok]) => !ok).forEach(([name]) => console.log(`     • ${name}`));
      failures.push({ test: t.id, case: c.label, payload, normalized: out });
      fail++;
    }

    // Idempotency-key (lo que el endpoint server-side calculará)
    const idem = crypto.createHash('sha256')
      .update(`${out.candidate_id}::${t.id}::${fecha}`)
      .digest('hex');
    if (!/^[a-f0-9]{64}$/.test(idem)) {
      console.log(`     • idempotency-key con formato inválido: ${idem}`);
      fail++;
    }
  }
}

console.log(`\nResumen: ${pass} OK / ${fail} fallos sobre ${pass + fail} casos`);
if (fail > 0) {
  console.log('\nDetalle de fallos (primero):');
  console.log(JSON.stringify(failures[0], null, 2));
  process.exit(1);
}
