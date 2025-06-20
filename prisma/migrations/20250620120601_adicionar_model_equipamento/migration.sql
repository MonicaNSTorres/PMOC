-- CreateTable
CREATE TABLE "Equipamento" (
    "id" SERIAL NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "Equipamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
