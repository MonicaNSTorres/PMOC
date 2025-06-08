import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = {
    ambientes: await prisma.ambiente.findMany(),
    tags: await prisma.tag.findMany(),
    servicos: await prisma.servico.findMany(),
    pmocs: await prisma.pMOC.findMany({
      include: { checklist: true }
    }),
  };

  fs.writeFileSync('backup.json', JSON.stringify(data, null, 2));
  console.log("✅ Dados exportados para backup.json");
}

main().finally(() => prisma.$disconnect());
