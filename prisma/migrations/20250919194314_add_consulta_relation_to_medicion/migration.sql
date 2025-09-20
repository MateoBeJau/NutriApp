-- AlterEnum
ALTER TYPE "public"."EstadoConsulta" ADD VALUE 'REAGENDADO';

-- AlterTable
ALTER TABLE "public"."Consulta" ALTER COLUMN "estado" SET DEFAULT 'PROGRAMADO';

-- AlterTable
ALTER TABLE "public"."Medicion" ADD COLUMN     "consultaId" TEXT;

-- CreateIndex
CREATE INDEX "Paciente_usuarioId_apellido_nombre_idx" ON "public"."Paciente"("usuarioId", "apellido", "nombre");

-- CreateIndex
CREATE INDEX "Paciente_usuarioId_activo_idx" ON "public"."Paciente"("usuarioId", "activo");

-- CreateIndex
CREATE INDEX "Paciente_email_idx" ON "public"."Paciente"("email");

-- AddForeignKey
ALTER TABLE "public"."Medicion" ADD CONSTRAINT "Medicion_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "public"."Consulta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
