-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PMOC" (
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
    "tagId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PMOC_ambienteId_fkey" FOREIGN KEY ("ambienteId") REFERENCES "Ambiente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PMOC_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PMOC_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PMOC" ("ambienteId", "art", "bairro", "cgcProprietario", "cgcResponsavel", "cidade", "conselho", "criadoEm", "endereco", "enderecoProprietario", "id", "nomeAmbiente", "nomeProprietario", "nomeResponsavel", "numero", "servicoId", "telefone", "uf") SELECT "ambienteId", "art", "bairro", "cgcProprietario", "cgcResponsavel", "cidade", "conselho", "criadoEm", "endereco", "enderecoProprietario", "id", "nomeAmbiente", "nomeProprietario", "nomeResponsavel", "numero", "servicoId", "telefone", "uf" FROM "PMOC";
DROP TABLE "PMOC";
ALTER TABLE "new_PMOC" RENAME TO "PMOC";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
