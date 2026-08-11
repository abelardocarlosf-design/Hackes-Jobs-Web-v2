-- Añade el almacenamiento de CV al modelo Candidato (CRM).
--
-- Escrita a mano en lugar de generarse con `prisma migrate dev` porque el
-- generador quería además DROPear la tabla `jobs`, que sigue teniendo datos
-- reales (una vacante de Gonzalves de México que no está en el catálogo
-- file-based de src/data/vacantes.ts). Esa limpieza es una decisión aparte y
-- no debe viajar dentro de una migración que solo agrega columnas.
-- Respaldo de esos datos: backups/jobs-applications-export-2026-08-10.json

ALTER TABLE "candidatos" ADD COLUMN "cvKey" TEXT;
ALTER TABLE "candidatos" ADD COLUMN "cvNombreArchivo" TEXT;
ALTER TABLE "candidatos" ADD COLUMN "cvSubidoEn" DATETIME;
