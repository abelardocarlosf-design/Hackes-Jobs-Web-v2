/* eslint-disable */
/**
 * Hacke's Jobs · n8n Workflow Migration to v2 (SaaS-grade architecture)
 *
 * Applies the unified architecture (DISC v2 = reference) to the other 9 tests:
 *  - AI System Prompt with: Identity, Theoretical Context, Validity Rule,
 *    No-sycophancy rules, structured JSON output.
 *  - Standardized recruiter email (executive report rendering unified schema).
 *  - Standardized candidate email ("Feedback de Desarrollo").
 *  - Reporte Anulado outputs the unified schema.
 *
 * Preserves: node IDs, connections, webhook IDs, credentials, positions,
 *            Google Sheets structure.
 *
 * Run: node scripts/migrate-n8n-workflows.js
 */

const fs = require('fs');
const path = require('path');

const WORKFLOWS_DIR = path.join(__dirname, '..', 'n8n-workflows');

// ─────────────────────────────────────────────────────────────────
// TEST-SPECIFIC THEORETICAL CONTEXT + RAW SCORES FORMAT
// ─────────────────────────────────────────────────────────────────
const TESTS = {
  'WF-001 Lüscher.json': {
    nombre: 'Test de Colores de Lüscher',
    subtitulo: 'Análisis Psicométrico Proyectivo · Lüscher',
    teoria: `Test proyectivo de 8 colores que revela el estado psicofísico actual y necesidades subyacentes. Cada color tiene una carga psicológica específica:
• Azul (1) — tranquilidad, satisfacción afectiva, necesidad de calma.
• Verde (2) — autoafirmación, control, resistencia al cambio.
• Rojo (3) — excitación, deseo de actividad, conquista.
• Amarillo (4) — expansión, optimismo, búsqueda de novedad.
• Violeta (5) — identificación, sensibilidad, fantasía.
• Marrón (6) — seguridad sensorial, comodidad física.
• Negro (7) — renuncia, autoridad, oposición.
• Gris (0) — no involucramiento, neutralidad, evasión.

Analiza la posición de cada color en las dos elecciones:
 - Posiciones 1-2 = colores objetivo (+) = lo deseado, lo que la persona persigue.
 - Posiciones 7-8 = colores rechazo (-) = lo rechazado, fuente de tensión.
 - Compara ambas elecciones para detectar consistencia/inconsistencia.

CONFLICTOS A IDENTIFICAR: si un color "fundamental" (1-4) aparece en posición de rechazo (7-8), es indicador de tensión psicológica. Mide: ansiedad, frustración, autocontrol, necesidades laborales y nivel de equilibrio emocional.`,
    puntajes_crudos_format: `1ra Elección: [orden de 8 colores]\n2da Elección: [orden de 8 colores]\nColores Objetivo (+): [posiciones 1-2 de ambas elecciones]\nColores Rechazo (-): [posiciones 7-8 de ambas elecciones]\nConflictos detectados: [lista de pares en tensión]\nÍndice de tensión: XX/100`
  },

  'WF-003 Allport.json': {
    nombre: 'Test de Valores de Allport',
    subtitulo: 'Análisis Psicométrico de Valores · Allport-Vernon-Lindzey',
    teoria: `Mide el peso relativo de 6 valores fundamentales en la personalidad:
• TEÓRICO (T) — búsqueda de verdad, conocimiento, análisis lógico, descubrimiento intelectual.
• ECONÓMICO (E) — utilidad, eficiencia práctica, riqueza, retorno de inversión.
• ESTÉTICO (A) — forma, armonía, belleza, expresión artística.
• SOCIAL (S) — altruismo, servicio al prójimo, empatía, contribución comunitaria.
• POLÍTICO (P) — poder, influencia, autoridad, liderazgo, estatus.
• RELIGIOSO (R) — unidad, trascendencia, espiritualidad, principios morales.

Análisis: en condiciones laborales, valores DOMINANTES predicen motivación intrínseca y satisfacción; valores RECHAZADOS pueden generar conflicto en roles que los requieren. Para puestos directivos, P>50 + E>50 es congruente; para roles de servicio, S>50 + R>40 es congruente. Diferencias extremas entre el valor más alto y el más bajo (>40 puntos) indican personalidad fuertemente polarizada — puede ser fortaleza en nichos pero riesgo en roles polifacéticos.`,
    puntajes_crudos_format: `Teórico (T):    XX/40\nEconómico (E):  XX/40\nEstético (A):   XX/40\nSocial (S):     XX/40\nPolítico (P):   XX/40\nReligioso (R):  XX/40\nValor dominante: [X]\nValor rechazado: [Y]\nRango de polarización: XX puntos`
  },

  'WF-004 Moss.json': {
    nombre: 'Test de Habilidades Gerenciales Moss',
    subtitulo: 'Análisis Psicométrico Gerencial · Moss',
    teoria: `Evalúa 5 dimensiones críticas para roles de supervisión y liderazgo operativo:
• HS — Habilidad de Supervisión: capacidad de coordinar, delegar y obtener resultados a través de otros.
• CDRH — Capacidad de Decisión en Relaciones Humanas: rapidez y acierto al resolver conflictos interpersonales.
• EPI — Evaluación de Problemas Interpersonales: lectura precisa de dinámicas sociales en el equipo.
• HER — Habilidad para Establecer Relaciones: facilidad para construir rapport y red profesional.
• SCT — Sentido Común y Tacto: juicio práctico ante situaciones ambiguas.

Análisis: cada dimensión se puntúa 0-100. Puntajes ≥70 en HS+CDRH = perfil gerencial sólido. Bajo SCT (<40) es bandera roja para roles con interacción directa con clientes/proveedores. Índice de Compatibilidad Gerencial = promedio ponderado (HS×0.30 + CDRH×0.25 + EPI×0.20 + HER×0.15 + SCT×0.10). ICG ≥75 = Altamente Recomendado; 60-74 = Con Reservas; <60 = No Recomendado para gerencia.`,
    puntajes_crudos_format: `Habilidad Supervisión (HS):     XX/100\nCapacidad Decisión RH (CDRH):   XX/100\nEvaluación Problemas (EPI):     XX/100\nEstablecer Relaciones (HER):    XX/100\nSentido Común y Tacto (SCT):    XX/100\n────────────────────────────────────\nÍndice Compatibilidad Gerencial: XX/100`
  },

  'WF-005 Zavic.json': {
    nombre: 'Test de Valores e Intereses Zavic',
    subtitulo: 'Análisis Psicométrico de Valores Éticos · Zavic',
    teoria: `Mide 4 valores éticos y 4 intereses motivacionales (escala 0-15 cada uno):

VALORES ÉTICOS:
• MORAL — actuación bajo principios universales.
• LEGALIDAD — apego a normas y procedimientos.
• INDIFERENCIA — neutralidad ante dilemas éticos (zona de riesgo).
• CORRUPCIÓN — disposición a vulnerar reglas por beneficio (BANDERA ROJA CRÍTICA).

INTERESES:
• ECONÓMICO — motivación por compensación material.
• POLÍTICO — motivación por estatus e influencia.
• SOCIAL — motivación por relaciones y aceptación.
• RELIGIOSO — motivación por principios trascendentes.

ANÁLISIS CRÍTICO: Corrupción ≥7 = BANDERA ROJA OBLIGATORIA, especialmente para puestos con manejo de recursos, tomas de decisión o trato con proveedores. Indiferencia ≥10 indica permisividad ética. Moral+Legalidad ≥20 = perfil ético sólido. Para roles de compliance/finanzas/compras, exige Corrupción ≤3 y Moral ≥8.`,
    puntajes_crudos_format: `VALORES ÉTICOS\n  Moral:         XX/15\n  Legalidad:     XX/15\n  Indiferencia:  XX/15\n  Corrupción:    XX/15  ⚠ FLAG si ≥7\n\nINTERESES\n  Económico:     XX/15\n  Político:      XX/15\n  Social:        XX/15\n  Religioso:     XX/15`
  },

  'WF-006 Kostick.json': {
    nombre: 'Inventario de Percepción y Preferencias Kostick (PAPI)',
    subtitulo: 'Análisis Psicométrico Laboral · Kostick PAPI',
    teoria: `Inventario de 22 dimensiones del comportamiento laboral agrupadas en 7 áreas:
1. LIDERAZGO: Liderazgo (L), Necesidad de Liderazgo (P), Auto-imagen Directiva (I)
2. FORMA DE TRABAJAR: Necesidad de Logro (A), Necesidad de Cambio (Z), Organización (W), Atención al Detalle (D), Necesidad de Estructura (R), Trabajo Bajo Presión (T)
3. NATURALEZA SOCIAL: Necesidad Social (S), Necesidad de Pertenencia (B), Necesidad de Empatía (O), Necesidad de Apoyo (X)
4. ESTILO DE TRABAJO: Forma Vigorosa (V), Energía Aplicada (E), Necesidad de Variedad (N)
5. DEFENSIVIDAD: Necesidad de Confrontación (K), Necesidad de Distancia (F)
6. ROL FUNCIONAL: Función de Líder Natural (G), Rol de Subordinado (Q)
7. CONTROL EMOCIONAL: Auto-control (C), Tolerancia a Decisión (M)

ANÁLISIS: cada dimensión se mide 0-9. Perfil gerencial: L≥7, P≥6, I≥6, T≥7, C≥6. Perfil ejecutor: A≥7, W≥6, D≥7, R≥5. K≥7 = posible conflictividad. F≥7 = retraimiento. Identifica perfil dominante (gerencial, ejecutor, social, técnico) según el clúster con scores >6.`,
    puntajes_crudos_format: `LIDERAZGO:        L:X  P:X  I:X\nTRABAJO:          A:X  Z:X  W:X  D:X  R:X  T:X\nSOCIAL:           S:X  B:X  O:X  X:X\nESTILO:           V:X  E:X  N:X\nDEFENSIVIDAD:     K:X  F:X\nROL FUNCIONAL:    G:X  Q:X\nCONTROL EMOCIONAL: C:X  M:X\n\nPerfil dominante: [Gerencial / Ejecutor / Social / Técnico]`
  },

  'WF-007 Raven.json': {
    nombre: 'Test de Matrices Progresivas Raven',
    subtitulo: 'Análisis Psicométrico de Razonamiento · Raven',
    teoria: `Mide inteligencia no-verbal y capacidad de razonamiento abstracto mediante matrices visuales progresivas (60 ítems en 5 series A-E, dificultad creciente).

DIMENSIONES MEDIDAS:
• Razonamiento analógico (series A-B).
• Razonamiento inductivo y deductivo (series C-D).
• Capacidad de abstracción y resolución de problemas complejos (serie E).

ESCALAS DE INTERPRETACIÓN (puntaje crudo → percentil):
• ≥55/60 → Percentil 95+ = Capacidad Intelectual Superior (Grado I).
• 50-54/60 → Percentil 75-94 = Superior al Término Medio (Grado II).
• 40-49/60 → Percentil 25-74 = Intelectualmente Término Medio (Grado III).
• 30-39/60 → Percentil 10-24 = Inferior al Término Medio (Grado IV).
• <30/60 → Percentil <10 = Deficiente Intelectualmente (Grado V).

ANÁLISIS: para roles técnicos/analíticos exigir Grado II o superior. Tiempo de respuesta también es indicador: <30 min con score alto = pensamiento ágil; >45 min con score alto = pensamiento metódico. Patrones de error: fallos consistentes en serie E indican techo de abstracción.`,
    puntajes_crudos_format: `Puntaje Total:     XX/60\nPercentil:         PX\nGrado Intelectual: [I / II / III / IV / V]\nClasificación:     [Superior / Sobre Media / Media / Bajo Media / Deficiente]\n\nDesempeño por Serie:\n  Serie A:  XX/12\n  Serie B:  XX/12\n  Serie C:  XX/12\n  Serie D:  XX/12\n  Serie E:  XX/12\n\nTiempo invertido: XX min de 45 max`
  },

  'WF-008 Terman.json': {
    nombre: 'Test de Inteligencia Terman-Merrill',
    subtitulo: 'Análisis Psicométrico de Inteligencia Integral · Terman-Merrill',
    teoria: `Evalúa coeficiente intelectual a través de 10 sub-pruebas independientes (cada una con límite de tiempo estricto):
• SERIE I — Información general
• SERIE II — Juicio práctico
• SERIE III — Vocabulario
• SERIE IV — Selección lógica
• SERIE V — Aritmética
• SERIE VI — Sentido común
• SERIE VII — Analogías
• SERIE VIII — Frases en desorden
• SERIE IX — Clasificación
• SERIE X — Seriación numérica

CI = (sumatoria de aciertos × factor de corrección) → tabla de conversión por edad cronológica.

INTERPRETACIÓN DEL CI:
• ≥130 = Muy Superior (talento elevado, roles estratégicos/innovación).
• 120-129 = Superior (gerencia técnica, alta complejidad).
• 110-119 = Normal Brillante (mandos medios, profesionales).
• 90-109 = Normal Promedio (operativos calificados).
• 80-89 = Normal Lento.
• <80 = Deficitario.

ANÁLISIS DE PERFIL: perfiles PLANOS (≈igual desempeño en todas las series) indican inteligencia general estable. Perfiles PICUDOS (muy alto en algunas, muy bajo en otras) indican talentos específicos. Para roles administrativos exigir Series II, IV, VI ≥promedio. Para roles técnicos exigir Series V, VII, X ≥promedio.`,
    puntajes_crudos_format: `CI Total:           XXX\nClasificación:      [Muy Superior / Superior / Normal Brillante / Promedio / Lento / Deficitario]\n\nDesempeño por Serie:\n  I   Información:      XX/XX\n  II  Juicio:           XX/XX\n  III Vocabulario:      XX/XX\n  IV  Selección Lógica: XX/XX\n  V   Aritmética:       XX/XX\n  VI  Sentido Común:    XX/XX\n  VII Analogías:        XX/XX\n  VIII Frases Desorden: XX/XX\n  IX  Clasificación:    XX/XX\n  X   Seriación:        XX/XX\n\nPerfil: [Plano / Picudo]`
  },

  'WF-009 16PF.json': {
    nombre: 'Cuestionario 16 Factores de Personalidad (16PF)',
    subtitulo: 'Análisis Psicométrico de Personalidad · Cattell 16PF',
    teoria: `Modelo de Cattell que mide 16 factores primarios de personalidad (escala STEN 1-10, media=5.5, desv=2):

FACTORES PRIMARIOS:
A (Afabilidad), B (Razonamiento), C (Estabilidad Emocional), E (Dominancia), F (Animación), G (Atención a Normas), H (Atrevimiento), I (Sensibilidad), L (Vigilancia), M (Abstracción), N (Privacidad), O (Aprensión), Q1 (Apertura al Cambio), Q2 (Autosuficiencia), Q3 (Perfeccionismo), Q4 (Tensión).

5 DIMENSIONES GLOBALES (segundo orden):
• EXTRAVERSIÓN (A+, F+, H+, N-, Q2-)
• ANSIEDAD (C-, L+, O+, Q4+)
• DUREZA (A-, I-, M-, Q1-)
• INDEPENDENCIA (E+, H+, L+, Q1+)
• AUTOCONTROL (F-, G+, M-, Q3+)

VALIDEZ: revisar escalas IM (Manipulación de Imagen) e IN (Infrecuencia). Si IM>8 o IN>7 → BANDERA ROJA de invalidez (respuestas sesgadas).

INTERPRETACIÓN:
 - STEN 1-3 = polo bajo (LO)
 - STEN 4-7 = promedio
 - STEN 8-10 = polo alto (HI)

Para roles gerenciales exigir: E≥7, H≥6, Q4≤4. Para roles analíticos: B≥7, M≥6, G≥6. Para roles de servicio: A≥7, I≥6, O≤5.`,
    puntajes_crudos_format: `FACTORES PRIMARIOS (STEN 1-10):\n  A Afabilidad:           XX\n  B Razonamiento:         XX\n  C Estabilidad:          XX\n  E Dominancia:           XX\n  F Animación:            XX\n  G Atención Normas:      XX\n  H Atrevimiento:         XX\n  I Sensibilidad:         XX\n  L Vigilancia:           XX\n  M Abstracción:          XX\n  N Privacidad:           XX\n  O Aprensión:            XX\n  Q1 Apertura al Cambio:  XX\n  Q2 Autosuficiencia:     XX\n  Q3 Perfeccionismo:      XX\n  Q4 Tensión:             XX\n\nDIMENSIONES GLOBALES:\n  Extraversión:    XX\n  Ansiedad:        XX\n  Dureza:          XX\n  Independencia:   XX\n  Autocontrol:     XX\n\nVALIDEZ: IM:X  IN:X  [VÁLIDO/INVÁLIDO]`
  },

  'WF-010 MMPI-2.json': {
    nombre: 'Inventario Multifásico de Personalidad MMPI-2',
    subtitulo: 'Análisis Psicométrico Clínico · MMPI-2',
    teoria: `EVALUACIÓN CLÍNICA AVANZADA. Las elevaciones se interpretan en puntuaciones T (media=50, desv=10). T≥65 = elevación clínicamente significativa.

ESCALAS DE VALIDEZ (CRÍTICAS — interpretar SIEMPRE primero):
• L (Mentira) — distorsión deliberada favorable. T>65 = perfil sospechoso.
• F (Infrecuencia) — exageración o desorden severo. T>80 = invalidar.
• K (Corrección) — defensividad. T>70 = sub-reporte de síntomas.
• ?  (No contestadas) — >30 ítems no contestados = invalidar.

10 ESCALAS CLÍNICAS:
1 (Hs) Hipocondriasis — somatización, preocupación por la salud.
2 (D) Depresión — desánimo, pesimismo.
3 (Hy) Histeria — síntomas físicos por estrés psicológico.
4 (Pd) Desviación Psicopática — antisocialidad, conflicto con autoridad.
5 (Mf) Masculinidad-Femineidad — patrón de intereses sexo-tipados.
6 (Pa) Paranoia — desconfianza, ideas de referencia.
7 (Pt) Psicastenia — ansiedad, obsesiones, rigidez.
8 (Sc) Esquizofrenia — pensamiento atípico, aislamiento.
9 (Ma) Hipomanía — energía elevada, impulsividad.
0 (Si) Introversión Social — retraimiento.

RESTRICCIÓN CRÍTICA: Este reporte solo debe interpretarse por profesional certificado. Para uso de RH, la salida debe limitarse a:
- Validez del protocolo (¿es interpretable?).
- Banderas rojas críticas (elevaciones T≥75 en escalas 4, 6, 8 o 9).
- Recomendación general SIN diagnóstico clínico.

Para puestos de alta responsabilidad/seguridad/manejo de información sensible: exigir todas las escalas clínicas T<65, validez L,F,K dentro de rango normal.`,
    puntajes_crudos_format: `ESCALAS DE VALIDEZ (puntajes T):\n  ?  No contestadas:  XX  [VÁLIDO si ≤30]\n  L  Mentira:          XX\n  F  Infrecuencia:     XX\n  K  Corrección:       XX\n  Configuración V/K:   [INTERPRETABLE / INVÁLIDO]\n\nESCALAS CLÍNICAS (puntajes T, ≥65 = elevación):\n  1  Hs Hipocondriasis: XX\n  2  D  Depresión:      XX\n  3  Hy Histeria:       XX\n  4  Pd Desviación:     XX\n  5  Mf Mas-Fem:        XX\n  6  Pa Paranoia:       XX\n  7  Pt Psicastenia:    XX\n  8  Sc Esquizofrenia:  XX\n  9  Ma Hipomanía:      XX\n  0  Si Introversión:   XX\n\nElevaciones críticas: [lista o "Ninguna"]`
  }
};

// ─────────────────────────────────────────────────────────────────
// UNIFIED TEMPLATES
// ─────────────────────────────────────────────────────────────────

function buildAIPrompt(testNombre, teoria, puntajesCrudosFormat) {
  return `=Eres un Sistema Experto en Psicometría Organizacional de Hackes Jobs Technologies. Tu tono es ejecutivo, analítico y rigurosamente objetivo. Operas bajo doctrina Zero-Hallucination: cada conclusión debe estar respaldada por evidencia numérica observable en las respuestas del candidato.

═══════════════════════════════════════════
CONTEXTO TEÓRICO — ${testNombre.toUpperCase()}
═══════════════════════════════════════════
${teoria}

═══════════════════════════════════════════
DATOS RECIBIDOS
═══════════════════════════════════════════
• Candidato: {{ $('Webhook Recepción').item.json.body.datos_paciente.nombre_completo }}
• Empresa / Cargo: {{ $('Webhook Recepción').item.json.body.datos_paciente.empresa || 'No especificado' }} — {{ $('Webhook Recepción').item.json.body.datos_paciente.cargo_postulado || 'No especificado' }}
• Total de Reactivos: {{ $('Webhook Recepción').item.json.body.datos_prueba.total_preguntas }}
• Reactivos Contestados: {{ $('Webhook Recepción').item.json.body.datos_prueba.preguntas_contestadas }}
• Respuestas: {{ JSON.stringify($('Webhook Recepción').item.json.body.respuestas) }}

═══════════════════════════════════════════
REGLA DE VALIDEZ — OBLIGATORIA
═══════════════════════════════════════════
Calcula completitud = (contestadas / total) × 100. Si <85%, marca validez="INVÁLIDO_INCOMPLETO" y antepone en resumen_ejecutivo: "⚠ ADVERTENCIA: Prueba con baja fiabilidad por falta de datos. Respuestas recibidas: [X] de [Y]. No se pueden extraer conclusiones psicométricamente fiables."

═══════════════════════════════════════════
REGLAS DE LENGUAJE — ZERO TOLERANCIA A SYCOPHANCY
═══════════════════════════════════════════
• PROHIBIDO: "excelente", "excepcional", "sobresaliente", "perfecto", "ideal" salvo que el percentil matemático ≥95.
• PROHIBIDO: lenguaje complaciente o aspiracional sin evidencia numérica.
• FORMA OBLIGATORIA: "El perfil muestra una alta propensión a [X] bajo presión, con un área de oportunidad crítica en [Y] respaldada por [Z evidencia numérica del test]".
• Si detectas respuestas planas (todas iguales), patrón inconsistente o índices de validez fuera de rango, repórtalo como bandera roja crítica.

═══════════════════════════════════════════
OUTPUT — JSON ESTRICTO
═══════════════════════════════════════════
Devuelve ÚNICAMENTE este objeto JSON. Sin markdown, sin bloques de código, sin preámbulo. Todos los campos son strings.

{
  "validez": "VÁLIDO o INVÁLIDO_INCOMPLETO",
  "resumen_validez": "Respuestas recibidas: X de Y (Z% completitud)",
  "resumen_ejecutivo": "2-3 párrafos con el diagnóstico ejecutivo del perfil ${testNombre}, mencionando dimensiones dominantes y banderas de validez si las hay",
  "fortalezas_operativas": "• Fortaleza 1 con evidencia numérica\\n• Fortaleza 2 con evidencia\\n• Fortaleza 3",
  "riesgos_potenciales": "• Bandera roja 1 con evidencia\\n• Bandera roja 2",
  "recomendacion_contratacion": "Altamente Recomendado o Recomendado con Reservas o No Recomendado",
  "justificacion_recomendacion": "1 párrafo fundamentando la decisión basada en datos concretos del test",
  "puntajes_crudos": "${puntajesCrudosFormat.replace(/\n/g, '\\n')}",
  "feedback_candidato": "1 párrafo constructivo y desarrollativo para enviar AL candidato. Sin revelar banderas rojas ni puntajes específicos — enfocado en oportunidades de desarrollo personal y profesional."
}`;
}

function buildRecruiterEmail(testNombre, subtitulo) {
  return `=<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 720px; margin: 0 auto; border: 1px solid #E0E0E0; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">

    <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 32px 24px;">
        <p style="color: #FF8C00; margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">HACKE'S JOBS · REPORTE EJECUTIVO</p>
        <h2 style="color: #FFFFFF; margin: 8px 0 4px 0; font-size: 26px; font-weight: 800; letter-spacing: -0.3px;">${testNombre}</h2>
        <p style="color: #999; margin: 0; font-size: 13px;">${subtitulo}</p>
    </div>

    <div style="background-color: #F5F5F5; padding: 14px 24px; border-bottom: 1px solid #E0E0E0;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 1.5px;">Validez del Reporte: {{ $('Parsear JSON Seguro').item.json.validez }}</p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">{{ $('Parsear JSON Seguro').item.json.resumen_validez }}</p>
    </div>

    <div style="background-color: #FFFFFF; padding: 32px; color: #333333;">

        <div style="margin-bottom: 28px;">
            <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px;">Candidato</p>
            <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 700; color: #000;">{{ $('Webhook Recepción').item.json.body.datos_paciente.nombre_completo }}</p>
            <p style="margin: 2px 0 0 0; font-size: 14px; color: #FF8C00;">{{ $('Webhook Recepción').item.json.body.datos_paciente.email }}</p>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #777;">{{ $('Webhook Recepción').item.json.body.datos_paciente.empresa || 'Empresa no especificada' }} · {{ $('Webhook Recepción').item.json.body.datos_paciente.cargo_postulado || 'Cargo no especificado' }}</p>
        </div>

        <div style="margin-bottom: 28px; padding: 22px; background-color: #FAFAFA; border-left: 4px solid #000; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 1.5px;">Resumen Ejecutivo</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333; white-space: pre-line;">{{ $('Parsear JSON Seguro').item.json.resumen_ejecutivo }}</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
            <tr>
                <td valign="top" width="50%" style="padding-right: 8px;">
                    <div style="background-color: #F1F8F4; border: 1px solid #C8E6C9; border-radius: 8px; padding: 18px;">
                        <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; color: #2E7D32; text-transform: uppercase; letter-spacing: 1.5px;">✓ Fortalezas Operativas</p>
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #1B5E20; white-space: pre-line;">{{ $('Parsear JSON Seguro').item.json.fortalezas_operativas }}</p>
                    </div>
                </td>
                <td valign="top" width="50%" style="padding-left: 8px;">
                    <div style="background-color: #FFEBEE; border: 1px solid #FFCDD2; border-radius: 8px; padding: 18px;">
                        <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; color: #C62828; text-transform: uppercase; letter-spacing: 1.5px;">⚠ Banderas Rojas</p>
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #B71C1C; white-space: pre-line;">{{ $('Parsear JSON Seguro').item.json.riesgos_potenciales }}</p>
                    </div>
                </td>
            </tr>
        </table>

        <div style="margin-bottom: 28px; padding: 24px; background: linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%); border: 2px solid #FF8C00; border-radius: 12px;">
            <p style="margin: 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 2px; text-align: center;">Recomendación de Contratación</p>
            <p style="margin: 10px 0 6px 0; font-size: 24px; font-weight: 800; color: #FF8C00; letter-spacing: -0.3px; text-align: center;">{{ $('Parsear JSON Seguro').item.json.recomendacion_contratacion }}</p>
            <p style="margin: 14px 0 0 0; font-size: 13px; color: #555; line-height: 1.6;">{{ $('Parsear JSON Seguro').item.json.justificacion_recomendacion }}</p>
        </div>

        <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1.5px;">Puntajes Crudos</p>
            <pre style="margin: 0; font-family: 'Courier New', Consolas, monospace; font-size: 12px; line-height: 1.6; color: #333; background-color: #F5F5F5; padding: 16px; border-radius: 6px; white-space: pre-wrap; border: 1px solid #E0E0E0;">{{ $('Parsear JSON Seguro').item.json.puntajes_crudos }}</pre>
        </div>

        <p style="font-size: 11px; color: #999; font-style: italic; margin-top: 24px; text-align: center;">
            Procesado por Hacke's Jobs Technologies · Datos respaldados en Google Sheets
        </p>
    </div>

    <div style="background-color: #000; padding: 20px; text-align: center;">
        <p style="color: #FFFFFF; font-size: 11px; margin: 0; letter-spacing: 2px; font-weight: 700;">HACKES JOBS TECHNOLOGIES</p>
        <p style="color: #666; font-size: 10px; margin: 4px 0 0 0;">Infraestructura HR-Tech · Psicometría Organizacional</p>
    </div>
</div>`;
}

function buildCandidateEmail(testNombre) {
  return `=<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E0E0E0; border-radius: 12px; overflow: hidden;">

    <div style="background: linear-gradient(135deg, #FF8C00 0%, #FF6F00 100%); padding: 32px 24px;">
        <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">Feedback de Desarrollo</p>
        <h2 style="color: #FFFFFF; margin: 8px 0 0 0; font-size: 24px; font-weight: 700;">${testNombre}</h2>
    </div>

    <div style="background-color: #FFFFFF; padding: 32px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hola {{ $('Webhook Recepción').item.json.body.datos_paciente.nombre_completo.split(' ')[0] }},</p>

        <p style="font-size: 15px; line-height: 1.7; color: #555;">Gracias por completar tu evaluación. Como parte de nuestro compromiso con tu desarrollo profesional, queremos compartirte una reflexión personalizada sobre el ejercicio que acabas de realizar.</p>

        <div style="margin: 24px 0; padding: 22px; background-color: #FFF8F0; border-left: 4px solid #FF8C00; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; color: #FF8C00; text-transform: uppercase; letter-spacing: 1.5px;">Reflexión Profesional</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333;">{{ $('Parsear JSON Seguro').item.json.feedback_candidato }}</p>
        </div>

        <p style="font-size: 15px; line-height: 1.7; color: #555;">El equipo de reclutamiento de Hacke's Jobs Technologies revisará tu evaluación junto con tu expediente. Nos pondremos en contacto contigo en breve para los siguientes pasos del proceso.</p>

        <p style="font-size: 14px; color: #888; margin-top: 32px;">Si tienes preguntas, escríbenos a <a href="mailto:abelardo.carlos@hackesjobs.com.mx" style="color: #FF8C00; text-decoration: none; font-weight: 600;">abelardo.carlos@hackesjobs.com.mx</a></p>

        <div style="margin-top: 32px; border-top: 1px solid #EEE; padding-top: 20px;">
            <p style="font-size: 14px; color: #666; margin: 0;">Saludos,</p>
            <p style="font-size: 16px; color: #000; font-weight: 700; margin: 4px 0 0 0;">Equipo Hacke's Jobs Technologies</p>
        </div>
    </div>

    <div style="background-color: #000; padding: 16px; text-align: center;">
        <p style="color: #FFF; font-size: 11px; margin: 0; letter-spacing: 1.5px; font-weight: 700;">HACKES JOBS TECHNOLOGIES</p>
    </div>
</div>`;
}

const RECRUITER_SUBJECT = (testShortName) =>
  `=Alerta Hackes Jobs Technologies: Nuevo Reporte ${testShortName} Procesado [ {{ $('Webhook Recepción').item.json.body.datos_paciente.nombre_completo }} | {{ $('Webhook Recepción').item.json.body.datos_paciente.email }} ]`;

const CANDIDATE_SUBJECT = (testShortName) =>
  `=Feedback de Desarrollo · ${testShortName} | Hacke's Jobs Technologies`;

const REPORTE_ANULADO_CODE =
  `return { json: {
  "validez": "INVÁLIDO_INCOMPLETO",
  "resumen_validez": "PRUEBA ANULADA: El candidato no completó el umbral mínimo del 85% de reactivos.",
  "resumen_ejecutivo": "⚠ ADVERTENCIA: Prueba con baja fiabilidad por falta de datos. La evaluación no superó el umbral del 85% de reactivos requerido para análisis psicométrico válido. No se generó interpretación.",
  "fortalezas_operativas": "• No aplicable — prueba incompleta",
  "riesgos_potenciales": "• Compromiso del candidato con el proceso de evaluación\\n• Posible falta de tiempo, atención o motivación",
  "recomendacion_contratacion": "No Recomendado",
  "justificacion_recomendacion": "La prueba no alcanzó el 85% de completitud requerido para un análisis estadísticamente válido. Se recomienda reaplicación bajo condiciones controladas o decisión basada en otras evaluaciones del expediente.",
  "puntajes_crudos": "PRUEBA ANULADA — sin puntajes calculables",
  "feedback_candidato": "Notamos que tu evaluación quedó incompleta. Te invitamos a retomarla cuando puedas dedicarle tu atención completa — los resultados serán mucho más útiles para tu proceso."
} };`;

// Short test name extractor for subjects
const SHORT_NAMES = {
  'WF-001 Lüscher.json': 'Lüscher',
  'WF-003 Allport.json': 'Allport',
  'WF-004 Moss.json': 'Moss',
  'WF-005 Zavic.json': 'Zavic',
  'WF-006 Kostick.json': 'Kostick',
  'WF-007 Raven.json': 'Raven',
  'WF-008 Terman.json': 'Terman-Merrill',
  'WF-009 16PF.json': '16PF',
  'WF-010 MMPI-2.json': 'MMPI-2'
};

// ─────────────────────────────────────────────────────────────────
// MIGRATION
// ─────────────────────────────────────────────────────────────────
function migrateFile(filename, testMeta) {
  const filepath = path.join(WORKFLOWS_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf8');
  const workflow = JSON.parse(raw);

  const shortName = SHORT_NAMES[filename];
  const newAIPrompt = buildAIPrompt(testMeta.nombre, testMeta.teoria, testMeta.puntajes_crudos_format);
  const newRecruiterEmail = buildRecruiterEmail(testMeta.nombre, testMeta.subtitulo);
  const newCandidateEmail = buildCandidateEmail(testMeta.nombre);

  let changes = [];

  for (const node of workflow.nodes) {
    // 1) AI prompt node — typically named "Análisis Psicométrico Gemini" or similar
    if (
      node.type === '@n8n/n8n-nodes-langchain.googleGemini' ||
      node.type === '@n8n/n8n-nodes-langchain.openAi' ||
      node.type === '@n8n/n8n-nodes-langchain.anthropic' ||
      (node.name && /Análisis|Gemini|OpenAI|Anthropic|IA/i.test(node.name))
    ) {
      if (node.parameters && node.parameters.messages && node.parameters.messages.values) {
        node.parameters.messages.values[0].content = newAIPrompt;
        changes.push(`AI prompt rewritten (node: "${node.name}")`);
      } else if (node.parameters && typeof node.parameters.text === 'string') {
        node.parameters.text = newAIPrompt;
        changes.push(`AI prompt rewritten (node: "${node.name}")`);
      }
    }

    // 2) Gmail nodes — distinguish recruiter (hardcoded address) vs candidate (expression)
    if (node.type === 'n8n-nodes-base.gmail' && node.parameters) {
      const sendTo = node.parameters.sendTo || '';
      const isRecruiter = /abelardo|hackesjobs\.com\.mx/i.test(sendTo) && !sendTo.includes('Webhook');
      const isCandidate = /Webhook|datos_paciente|email/.test(sendTo) && sendTo.includes('{{');

      if (isRecruiter) {
        node.parameters.subject = RECRUITER_SUBJECT(shortName);
        node.parameters.message = newRecruiterEmail;
        changes.push(`Recruiter email rebuilt (node: "${node.name}")`);
      } else if (isCandidate) {
        node.parameters.subject = CANDIDATE_SUBJECT(shortName);
        node.parameters.message = newCandidateEmail;
        changes.push(`Candidate email rebuilt as Feedback de Desarrollo (node: "${node.name}")`);
      }
    }

    // 3) Reporte Anulado code node
    if (
      node.type === 'n8n-nodes-base.code' &&
      node.name &&
      /Anulad|Invalid|Incomplet/i.test(node.name)
    ) {
      node.parameters.jsCode = REPORTE_ANULADO_CODE;
      changes.push(`Reporte Anulado updated to unified schema (node: "${node.name}")`);
    }
  }

  // Write back with pretty formatting
  fs.writeFileSync(filepath, JSON.stringify(workflow, null, 2), 'utf8');
  return changes;
}

// ─────────────────────────────────────────────────────────────────
// EXECUTE
// ─────────────────────────────────────────────────────────────────
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Hacke\'s Jobs · n8n Workflows v2 Migration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const summary = {};
for (const [filename, testMeta] of Object.entries(TESTS)) {
  try {
    const changes = migrateFile(filename, testMeta);
    summary[filename] = { status: 'OK', changes };
    console.log(`✓ ${filename}`);
    changes.forEach(c => console.log(`   · ${c}`));
    console.log('');
  } catch (e) {
    summary[filename] = { status: 'ERROR', error: e.message };
    console.error(`✗ ${filename}: ${e.message}\n`);
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Migration complete.\n');
