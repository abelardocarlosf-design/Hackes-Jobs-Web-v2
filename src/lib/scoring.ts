/**
 * Motor de Scoring — Hacke's Jobs SaaS
 * 
 * Evalúa candidatos contra los requisitos de una vacante.
 * Score final: 0-100 puntos distribuidos en 4 categorías.
 * 
 * Distribución:
 * - Experiencia: 30 pts
 * - Skills match: 35 pts
 * - Educación: 15 pts
 * - Tests psicométricos: 20 pts
 */

interface JobRequirements {
  skills?: string[];
  experience?: number;
  education?: string;
}

interface CandidateProfile {
  experienceYears: number;
  skills: string[];
  education: string;
  testScores?: { testType: string; score: number }[];
}

export interface ScoreBreakdown {
  total: number;
  experience: number;
  skills: number;
  education: number;
  psychometric: number;
  details: {
    matchedSkills: string[];
    missingSkills: string[];
    experienceGap: number;
    educationMatch: boolean;
    testResults: { type: string; score: number }[];
  };
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  tierLabel: string;
  tierColor: string;
}

// Jerarquía de niveles educativos
const EDUCATION_LEVELS: Record<string, number> = {
  'Secundaria': 1,
  'Preparatoria': 2,
  'Bachillerato': 2,
  'Técnico': 3,
  'TSU': 3,
  'Licenciatura': 4,
  'Ingeniería': 4,
  'Maestría': 5,
  'Doctorado': 6,
};

// Scoring tiers
function getTier(score: number): { tier: ScoreBreakdown['tier']; label: string; color: string } {
  if (score >= 90) return { tier: 'S', label: 'Excepcional', color: '#8B5CF6' };
  if (score >= 75) return { tier: 'A', label: 'Excelente', color: '#059669' };
  if (score >= 60) return { tier: 'B', label: 'Bueno', color: '#1E40AF' };
  if (score >= 40) return { tier: 'C', label: 'Aceptable', color: '#F97316' };
  return { tier: 'D', label: 'Por debajo', color: '#EF4444' };
}

/**
 * Normaliza un string de skill para comparación
 */
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/[.\-_]/g, '');
}

/**
 * Calcula el score de experiencia (0-30 pts)
 */
function scoreExperience(candidateYears: number, requiredYears: number): number {
  if (requiredYears <= 0) return 30; // No requirement → full score
  
  const ratio = candidateYears / requiredYears;
  
  if (ratio >= 1.5) return 30;  // 50%+ más experiencia → máximo
  if (ratio >= 1.0) return 25 + Math.round((ratio - 1) * 10);  // Cumple → 25-30
  if (ratio >= 0.7) return 15 + Math.round((ratio - 0.7) * 33);  // Casi cumple → 15-25
  if (ratio >= 0.4) return 5 + Math.round((ratio - 0.4) * 33);   // Parcial → 5-15
  return Math.round(ratio * 12.5); // Muy poca → 0-5
}

/**
 * Calcula el score de skills (0-35 pts)
 */
function scoreSkills(candidateSkills: string[], requiredSkills: string[]): { 
  score: number; matched: string[]; missing: string[] 
} {
  if (requiredSkills.length === 0) return { score: 35, matched: [], missing: [] };

  const normalizedCandidate = candidateSkills.map(normalizeSkill);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const required of requiredSkills) {
    const normalizedReq = normalizeSkill(required);
    const isMatch = normalizedCandidate.some(cs => 
      cs.includes(normalizedReq) || normalizedReq.includes(cs)
    );
    if (isMatch) {
      matched.push(required);
    } else {
      missing.push(required);
    }
  }

  const matchRatio = matched.length / requiredSkills.length;
  
  // Scoring progresivo
  if (matchRatio >= 1.0) return { score: 35, matched, missing };
  if (matchRatio >= 0.8) return { score: 28 + Math.round((matchRatio - 0.8) * 35), matched, missing };
  if (matchRatio >= 0.5) return { score: 15 + Math.round((matchRatio - 0.5) * 43), matched, missing };
  return { score: Math.round(matchRatio * 30), matched, missing };
}

/**
 * Calcula el score de educación (0-15 pts)
 */
function scoreEducation(candidateEdu: string, requiredEdu: string): { score: number; match: boolean } {
  if (!requiredEdu) return { score: 15, match: true };

  const candidateLevel = EDUCATION_LEVELS[candidateEdu] || 0;
  const requiredLevel = EDUCATION_LEVELS[requiredEdu] || 0;

  if (candidateLevel >= requiredLevel) return { score: 15, match: true };
  if (candidateLevel === requiredLevel - 1) return { score: 10, match: false };
  if (candidateLevel > 0) return { score: 5, match: false };
  return { score: 0, match: false };
}

/**
 * Calcula el score de tests psicométricos (0-20 pts)
 */
function scorePsychometric(testScores: { testType: string; score: number }[]): { 
  score: number; results: { type: string; score: number }[] 
} {
  if (testScores.length === 0) return { score: 0, results: [] };

  // Promedio de todos los tests, normalizado a 20 pts
  const avgScore = testScores.reduce((sum, t) => sum + t.score, 0) / testScores.length;
  const normalized = Math.round((avgScore / 100) * 20);
  
  return { 
    score: Math.min(normalized, 20), 
    results: testScores.map(t => ({ type: t.testType, score: t.score }))
  };
}

/**
 * Función principal: calcula el score total de un candidato para una vacante.
 */
export function calculateScore(
  candidate: CandidateProfile,
  requirements: JobRequirements
): ScoreBreakdown {
  const expScore = scoreExperience(candidate.experienceYears, requirements.experience || 0);
  const skillsResult = scoreSkills(candidate.skills, requirements.skills || []);
  const eduResult = scoreEducation(candidate.education, requirements.education || '');
  const psychResult = scorePsychometric(candidate.testScores || []);

  const total = expScore + skillsResult.score + eduResult.score + psychResult.score;
  const { tier, label, color } = getTier(total);

  return {
    total,
    experience: expScore,
    skills: skillsResult.score,
    education: eduResult.score,
    psychometric: psychResult.score,
    details: {
      matchedSkills: skillsResult.matched,
      missingSkills: skillsResult.missing,
      experienceGap: Math.max(0, (requirements.experience || 0) - candidate.experienceYears),
      educationMatch: eduResult.match,
      testResults: psychResult.results,
    },
    tier,
    tierLabel: label,
    tierColor: color,
  };
}

/**
 * Calcula un score rápido sin detalles (para listados).
 */
export function quickScore(
  candidateSkills: string[],
  candidateExperience: number,
  requiredSkills: string[],
  requiredExperience: number
): number {
  const exp = scoreExperience(candidateExperience, requiredExperience);
  const { score: skills } = scoreSkills(candidateSkills, requiredSkills);
  // Sin educación ni psicometría, normalizar a 100
  return Math.round(((exp + skills) / 65) * 100);
}
