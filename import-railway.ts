import { PrismaClient } from "@prisma/client";
import data from "./backup.json";

const prisma = new PrismaClient();

type Ambiente = { nome: string };
type Tag = { tag: string; unidade: string; local: string };

async function main() {
  for (const ambiente of data.ambientes as Ambiente[]) {
    await prisma.ambiente.create({ data: { nome: ambiente.nome } });
  }

  for (const tag of data.tags as Tag[]) {
    await prisma.tag.create({ data: { tag: tag.tag, unidade: tag.unidade, local: tag.local } });
  }

  console.log("✅ Dados importados com sucesso para o Railway");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
