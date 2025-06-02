-- CreateTable
CREATE TABLE "Ambiente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "local" TEXT
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PMOC" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PMOC_ambienteId_fkey" FOREIGN KEY ("ambienteId") REFERENCES "Ambiente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PMOC_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "periodicidade" TEXT NOT NULL,
    "dataExecucao" DATETIME,
    "executadoPor" TEXT,
    "aprovadoPor" TEXT,
    "pmocId" INTEGER NOT NULL,
    "servicoId" INTEGER,
    CONSTRAINT "Checklist_pmocId_fkey" FOREIGN KEY ("pmocId") REFERENCES "PMOC" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Checklist_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
