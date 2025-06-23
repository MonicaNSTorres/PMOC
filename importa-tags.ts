import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();
const filePath = path.join(__dirname, "public", "TAGS.csv");

const results: any[] = [];

fs.createReadStream(filePath)
  .pipe(csv({ separator: "," }))
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    try {
      console.log("🗑️ Apagando equipamentos...");
      await prisma.equipamento.deleteMany();

      console.log("🗑️ Apagando tags...");
      await prisma.tag.deleteMany();

      console.log("⬆️ Importando novas tags...");
      for (const linha of results) {
        const nome = linha.NOME?.trim() || "";
        const unidade = linha.UNIDADE?.trim() || "";
        const local = linha.LOCAL?.trim() || "";
        const tag = linha.TAG?.trim() || "";

        if (!nome || !unidade || !local || !tag) {
          console.warn("⚠️ Linha ignorada por dados incompletos:", linha);
          continue;
        }

        await prisma.tag.create({
          data: { nome, unidade, local, tag },
        });
      }

      console.log(`✅ Importação concluída. Registros inseridos: ${results.length}`);
      process.exit(0);
    } catch (error) {
      console.error("❌ Erro ao importar TAGs:", error);
      process.exit(1);
    }
  });
