/*
  Warnings:

  - You are about to drop the column `local` on the `Ambiente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `Ambiente` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ambiente_nome_local_key";

-- AlterTable
ALTER TABLE "Ambiente" DROP COLUMN "local",
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "uf" TEXT,
ALTER COLUMN "cnpj" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "ambienteId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Ambiente_nome_key" ON "Ambiente"("nome");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_ambienteId_fkey" FOREIGN KEY ("ambienteId") REFERENCES "Ambiente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
