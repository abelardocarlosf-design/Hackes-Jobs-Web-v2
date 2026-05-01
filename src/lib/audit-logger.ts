import fs from 'fs';
import path from 'path';

export type AuditAction = 
  | 'VIEW_CANDIDATE_DATA'
  | 'EXPORT_PSYCHOMETRIC_REPORT'
  | 'UPDATE_CANDIDATE_STATUS'
  | 'LOGIN_ATTEMPT'
  | 'CHANGE_ROLE';

export interface AuditLog {
  userId: string;
  tenantId: string;
  action: AuditAction;
  resourceId?: string;
  metadata?: any;
  ipAddress?: string;
}

/**
 * Registra acciones sensibles para cumplimiento de normativas de protección de datos (LFPDPPP).
 * En producción real, estos logs deben enviarse a un sistema inmutable (como AWS CloudWatch o Datadog)
 * para garantizar la trazabilidad de la información personal de los candidatos.
 */
export async function logAuditAction(log: AuditLog) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ...log,
  };

  // En producción: Enviar a DataDog / CloudWatch / DB inmutable
  // console.log('[AUDIT LOG]', JSON.stringify(logEntry));
  
  // Para demostración/desarrollo, escribimos en un archivo local
  try {
    const logDir = path.join(process.cwd(), 'data', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'audit.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\\n');
  } catch (error) {
    console.error('Error writing audit log:', error);
  }
}
