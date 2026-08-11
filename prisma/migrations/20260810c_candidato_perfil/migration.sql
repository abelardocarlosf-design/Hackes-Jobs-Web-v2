-- Campos de perfil que el reclutador completa a mano sobre la ficha del candidato.
-- Escrita a mano como las anteriores para no arrastrar el DROP de `jobs`.

ALTER TABLE "candidatos" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "candidatos" ADD COLUMN "experienciaAnios" INTEGER;
ALTER TABLE "candidatos" ADD COLUMN "notas" TEXT;
