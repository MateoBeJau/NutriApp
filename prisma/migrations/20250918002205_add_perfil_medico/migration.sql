/*
  Warnings:

  - You are about to alter the column `alturaCm` on the `Paciente` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "public"."Paciente" DROP CONSTRAINT "Paciente_usuarioId_fkey";

-- DropIndex
DROP INDEX "public"."Paciente_usuarioId_apellido_idx";

-- AlterTable
ALTER TABLE "public"."Paciente" ALTER COLUMN "alturaCm" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "public"."PerfilMedico" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "gustos" TEXT,
    "disgustos" TEXT,
    "alergias" TEXT,
    "enfermedades" TEXT,
    "medicamentos" TEXT,
    "restricciones" TEXT,
    "objetivos" TEXT,
    "observaciones" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfilMedico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PerfilMedico_pacienteId_key" ON "public"."PerfilMedico"("pacienteId");

-- AddForeignKey
ALTER TABLE "public"."Paciente" ADD CONSTRAINT "Paciente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilMedico" ADD CONSTRAINT "PerfilMedico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "public"."Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
