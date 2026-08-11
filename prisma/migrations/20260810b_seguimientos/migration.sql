-- Seguimientos del reclutador sobre candidatos.
-- Escrita a mano (igual que 20260810_candidato_cv) para no arrastrar el DROP de
-- la tabla `jobs` que el generador de Prisma quiere hacer por drift previo.

CREATE TABLE "seguimientos" (
    "id"           TEXT NOT NULL PRIMARY KEY,
    "tipo"         TEXT NOT NULL DEFAULT 'llamada',
    "nota"         TEXT,
    "fechaLimite"  DATETIME NOT NULL,
    "completado"   BOOLEAN NOT NULL DEFAULT false,
    "completadoEn" DATETIME,
    "automatico"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    DATETIME NOT NULL,
    "candidatoId"  TEXT NOT NULL,
    "procesoId"    TEXT,
    CONSTRAINT "seguimientos_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "seguimientos_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "procesos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "seguimientos_completado_fechaLimite_idx" ON "seguimientos"("completado", "fechaLimite");
