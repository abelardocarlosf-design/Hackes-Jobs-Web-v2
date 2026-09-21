-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'local',
    "role" TEXT NOT NULL DEFAULT 'candidate',
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "size" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "cvUrl" TEXT,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "skills" TEXT,
    "education" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psychometric_tests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'basico',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "structure" TEXT NOT NULL,
    "duration" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "psychometric_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "score" INTEGER,
    "summary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completado',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_purchases" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "test_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'basic',
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "rfc" TEXT,
    "contactoNombre" TEXT,
    "contactoEmail" TEXT,
    "contactoTel" TEXT,
    "zona" TEXT,
    "tier" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisiciones" (
    "id" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "zona" TEXT,
    "turno" TEXT,
    "bandaSalarialMin" DOUBLE PRECISION,
    "bandaSalarialMax" DOUBLE PRECISION,
    "estatus" TEXT NOT NULL DEFAULT 'abierta',
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaLimite" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,

    CONSTRAINT "requisiciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "zona" TEXT,
    "puestoInteres" TEXT,
    "fuente" TEXT,
    "consentimientoLFPDPPP" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cvKey" TEXT,
    "cvNombreArchivo" TEXT,
    "cvSubidoEn" TIMESTAMP(3),
    "linkedin" TEXT,
    "experienciaAnios" INTEGER,
    "notas" TEXT,

    CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procesos" (
    "id" TEXT NOT NULL,
    "etapa" TEXT NOT NULL DEFAULT 'atraccion',
    "scoreMatch" DOUBLE PRECISION,
    "notas" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requisicionId" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "testResultId" TEXT,
    "psicometriaTipo" TEXT,
    "psicometriaResultadoJson" TEXT,
    "psicometriaScoreGlobal" DOUBLE PRECISION,
    "psicometriaPdfUrl" TEXT,

    CONSTRAINT "procesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimientos" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'llamada',
    "nota" TEXT,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "completadoEn" TIMESTAMP(3),
    "automatico" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "procesoId" TEXT,

    CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_items" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctOptionId" TEXT NOT NULL,
    "parameterA" DOUBLE PRECISION NOT NULL,
    "parameterB" DOUBLE PRECISION NOT NULL,
    "parameterC" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cat_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_sessions" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "currentTheta" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "standardError" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "itemsAnswered" INTEGER NOT NULL DEFAULT 0,
    "responses" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_userId_key" ON "companies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_userId_key" ON "candidates"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "psychometric_tests_name_key" ON "psychometric_tests"("name");

-- CreateIndex
CREATE UNIQUE INDEX "test_purchases_stripeSessionId_key" ON "test_purchases"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "test_purchases_candidateId_testId_key" ON "test_purchases"("candidateId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_companyId_key" ON "subscriptions"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_userId_key" ON "clientes"("userId");

-- CreateIndex
CREATE INDEX "seguimientos_completado_fechaLimite_idx" ON "seguimientos"("completado", "fechaLimite");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_testId_fkey" FOREIGN KEY ("testId") REFERENCES "psychometric_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_purchases" ADD CONSTRAINT "test_purchases_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_purchases" ADD CONSTRAINT "test_purchases_testId_fkey" FOREIGN KEY ("testId") REFERENCES "psychometric_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisiciones" ADD CONSTRAINT "requisiciones_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_requisicionId_fkey" FOREIGN KEY ("requisicionId") REFERENCES "requisiciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "test_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "procesos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_items" ADD CONSTRAINT "cat_items_testId_fkey" FOREIGN KEY ("testId") REFERENCES "psychometric_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_sessions" ADD CONSTRAINT "cat_sessions_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_sessions" ADD CONSTRAINT "cat_sessions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "psychometric_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

