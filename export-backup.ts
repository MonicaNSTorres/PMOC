import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const ambientes = await prisma.ambiente.findMany();
  const tags = await prisma.tag.findMany();
  const servicos = await prisma.servico.findMany();
  const pmocs = await prisma.pMOC.findMany({
    include: { checklist: true },
  });

  const backup = { ambientes, tags, servicos, pmocs };
  fs.writeFileSync("backup.json", JSON.stringify(backup, null, 2));

  console.log("✅ Backup gerado com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
