-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "razonSocial" TEXT NOT NULL,
    "rfc" TEXT,
    "contactoNombre" TEXT,
    "contactoEmail" TEXT,
    "contactoTel" TEXT,
    "zona" TEXT,
    "tier" INTEGER NOT NULL DEFAULT 2,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "requisiciones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "puesto" TEXT NOT NULL,
    "zona" TEXT,
    "turno" TEXT,
    "bandaSalarialMin" REAL,
    "bandaSalarialMax" REAL,
    "estatus" TEXT NOT NULL DEFAULT 'abierta',
    "fechaSolicitud" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaLimite" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    CONSTRAINT "requisiciones_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "candidatos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "zona" TEXT,
    "puestoInteres" TEXT,
    "fuente" TEXT,
    "consentimientoLFPDPPP" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "procesos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "etapa" TEXT NOT NULL DEFAULT 'atraccion',
    "scoreMatch" REAL,
    "notas" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requisicionId" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "testResultId" TEXT,
    CONSTRAINT "procesos_requisicionId_fkey" FOREIGN KEY ("requisicionId") REFERENCES "requisiciones" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "procesos_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "procesos_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "test_results" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
