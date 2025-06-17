-- CreateTable
CREATE TABLE "Ambiente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,

    CONSTRAINT "Ambiente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PMOC" (
    "id" SERIAL NOT NULL,
    "nomeAmbiente" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "nomeProprietario" TEXT NOT NULL,
    "cgcProprietario" TEXT NOT NULL,
    "enderecoProprietario" TEXT NOT NULL,
    "nomeResponsavel" TEXT NOT NULL,
    "cgcResponsavel" TEXT NOT NULL,
    "conselho" TEXT NOT NULL,
    "art" TEXT NOT NULL,
    "ambienteId" INTEGER,
    "servicoId" INTEGER,
    "tagId" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PMOC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "local" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "periodicidade" TEXT NOT NULL,
    "dataExecucao" TIMESTAMP(3),
    "executadoPor" TEXT,
    "aprovadoPor" TEXT,
    "pmocId" INTEGER NOT NULL,
    "servicoId" INTEGER,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ambiente_nome_local_key" ON "Ambiente"("nome", "local");

-- CreateIndex
CREATE UNIQUE INDEX "Servico_nome_key" ON "Servico"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tag_key" ON "Tag"("tag");

-- AddForeignKey
ALTER TABLE "PMOC" ADD CONSTRAINT "PMOC_ambienteId_fkey" FOREIGN KEY ("ambienteId") REFERENCES "Ambiente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PMOC" ADD CONSTRAINT "PMOC_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PMOC" ADD CONSTRAINT "PMOC_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_pmocId_fkey" FOREIGN KEY ("pmocId") REFERENCES "PMOC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
