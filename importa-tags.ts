import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

export async function POST() {
  const filePath = path.join(process.cwd(), "public", "TAGS.csv");
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: "," })) // Mude para ";" se for separado por ponto e vírgula
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          // 🧹 Apaga todas as tags antes de importar
          await prisma.tag.deleteMany();

          // 🚀 Importa todas as novas tags do CSV
          for (const linha of results) {
            await prisma.tag.create({
              data: {
                nome: linha.NOME.trim(),
                unidade: linha.UNIDADE.trim(),
                local: linha.LOCAL.trim(),
                tag: linha.TAG.trim(),
              },
            });
          }

          resolve(NextResponse.json({ success: true, inseridos: results.length }));
        } catch (error) {
          console.error("Erro ao importar TAGs:", error);
          reject(NextResponse.json({ error: "Erro ao importar TAGs." }, { status: 500 }));
        }
      });
  });
}
