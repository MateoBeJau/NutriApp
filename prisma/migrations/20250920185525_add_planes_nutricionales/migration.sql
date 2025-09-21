-- CreateEnum
CREATE TYPE "public"."TipoPlan" AS ENUM ('MANUAL', 'GENERADO_IA');

-- CreateEnum
CREATE TYPE "public"."EstadoPlan" AS ENUM ('BORRADOR', 'ACTIVO', 'PAUSADO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."TipoComida" AS ENUM ('DESAYUNO', 'MEDIA_MANANA', 'ALMUERZO', 'MERIENDA', 'CENA', 'COLACION_NOCTURNA');

-- CreateEnum
CREATE TYPE "public"."EstadoSeguimiento" AS ENUM ('NO_CONSUMIDO', 'CONSUMIDO_PARCIAL', 'CONSUMIDO_TOTAL', 'SUSTITUIDO');

-- CreateTable
CREATE TABLE "public"."PlanNutricional" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "public"."TipoPlan" NOT NULL DEFAULT 'MANUAL',
    "estado" "public"."EstadoPlan" NOT NULL DEFAULT 'BORRADOR',
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "caloriasObjetivo" INTEGER,
    "proteinasObjetivo" DOUBLE PRECISION,
    "carbohidratosObjetivo" DOUBLE PRECISION,
    "grasasObjetivo" DOUBLE PRECISION,
    "notas" TEXT,
    "promptIA" TEXT,
    "modeloIA" TEXT,
    "restriccionesAplicadas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanNutricional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComidaPlan" (
    "id" TEXT NOT NULL,
    "planNutricionalId" TEXT NOT NULL,
    "tipo" "public"."TipoComida" NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "horaRecomendada" TEXT,
    "caloriasTotal" DOUBLE PRECISION,
    "proteinasTotal" DOUBLE PRECISION,
    "carbohidratosTotal" DOUBLE PRECISION,
    "grasasTotal" DOUBLE PRECISION,
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComidaPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Alimento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT,
    "categoria" TEXT,
    "caloriasPor100g" DOUBLE PRECISION NOT NULL,
    "proteinasPor100g" DOUBLE PRECISION NOT NULL,
    "carbohidratosPor100g" DOUBLE PRECISION NOT NULL,
    "grasasPor100g" DOUBLE PRECISION NOT NULL,
    "fibraPor100g" DOUBLE PRECISION,
    "alergenos" TEXT,
    "restricciones" TEXT,
    "caracteristicas" TEXT,
    "aptoParaDiabetes" BOOLEAN NOT NULL DEFAULT true,
    "aptoParaHipertension" BOOLEAN NOT NULL DEFAULT true,
    "indiceGlicemico" INTEGER,
    "esGenerico" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlimentoComida" (
    "id" TEXT NOT NULL,
    "comidaPlanId" TEXT NOT NULL,
    "alimentoId" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "unidad" TEXT NOT NULL,
    "calorias" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "carbohidratos" DOUBLE PRECISION NOT NULL,
    "grasas" DOUBLE PRECISION NOT NULL,
    "preparacion" TEXT,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlimentoComida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SeguimientoPlan" (
    "id" TEXT NOT NULL,
    "planNutricionalId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cumplimientoGeneral" DOUBLE PRECISION,
    "pesoDelDia" DOUBLE PRECISION,
    "notasPaciente" TEXT,
    "notasNutricionista" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeguimientoPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SeguimientoComida" (
    "id" TEXT NOT NULL,
    "seguimientoPlanId" TEXT NOT NULL,
    "comidaPlanId" TEXT NOT NULL,
    "estado" "public"."EstadoSeguimiento" NOT NULL DEFAULT 'NO_CONSUMIDO',
    "porcentajeConsumido" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "horaConsumo" TIMESTAMP(3),
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeguimientoComida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanNutricional_pacienteId_estado_idx" ON "public"."PlanNutricional"("pacienteId", "estado");

-- CreateIndex
CREATE INDEX "PlanNutricional_usuarioId_fechaInicio_idx" ON "public"."PlanNutricional"("usuarioId", "fechaInicio");

-- CreateIndex
CREATE INDEX "ComidaPlan_planNutricionalId_tipo_orden_idx" ON "public"."ComidaPlan"("planNutricionalId", "tipo", "orden");

-- CreateIndex
CREATE INDEX "Alimento_nombre_categoria_idx" ON "public"."Alimento"("nombre", "categoria");

-- CreateIndex
CREATE INDEX "Alimento_activo_idx" ON "public"."Alimento"("activo");

-- CreateIndex
CREATE INDEX "Alimento_alergenos_idx" ON "public"."Alimento"("alergenos");

-- CreateIndex
CREATE INDEX "Alimento_restricciones_idx" ON "public"."Alimento"("restricciones");

-- CreateIndex
CREATE INDEX "AlimentoComida_comidaPlanId_idx" ON "public"."AlimentoComida"("comidaPlanId");

-- CreateIndex
CREATE INDEX "AlimentoComida_alimentoId_idx" ON "public"."AlimentoComida"("alimentoId");

-- CreateIndex
CREATE INDEX "SeguimientoPlan_planNutricionalId_fecha_idx" ON "public"."SeguimientoPlan"("planNutricionalId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "SeguimientoPlan_planNutricionalId_fecha_key" ON "public"."SeguimientoPlan"("planNutricionalId", "fecha");

-- CreateIndex
CREATE INDEX "SeguimientoComida_seguimientoPlanId_idx" ON "public"."SeguimientoComida"("seguimientoPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "SeguimientoComida_seguimientoPlanId_comidaPlanId_key" ON "public"."SeguimientoComida"("seguimientoPlanId", "comidaPlanId");

-- AddForeignKey
ALTER TABLE "public"."PlanNutricional" ADD CONSTRAINT "PlanNutricional_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "public"."Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanNutricional" ADD CONSTRAINT "PlanNutricional_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComidaPlan" ADD CONSTRAINT "ComidaPlan_planNutricionalId_fkey" FOREIGN KEY ("planNutricionalId") REFERENCES "public"."PlanNutricional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlimentoComida" ADD CONSTRAINT "AlimentoComida_comidaPlanId_fkey" FOREIGN KEY ("comidaPlanId") REFERENCES "public"."ComidaPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlimentoComida" ADD CONSTRAINT "AlimentoComida_alimentoId_fkey" FOREIGN KEY ("alimentoId") REFERENCES "public"."Alimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeguimientoPlan" ADD CONSTRAINT "SeguimientoPlan_planNutricionalId_fkey" FOREIGN KEY ("planNutricionalId") REFERENCES "public"."PlanNutricional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeguimientoComida" ADD CONSTRAINT "SeguimientoComida_seguimientoPlanId_fkey" FOREIGN KEY ("seguimientoPlanId") REFERENCES "public"."SeguimientoPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeguimientoComida" ADD CONSTRAINT "SeguimientoComida_comidaPlanId_fkey" FOREIGN KEY ("comidaPlanId") REFERENCES "public"."ComidaPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
