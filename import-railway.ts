import { PrismaClient } from '@prisma/client';
import data from './backup.json';

const prisma = new PrismaClient();

async function main() {
  for (const ambiente of data.ambientes) {
    await prisma.ambiente.create({ data: { nome: ambiente.nome } });
  }

  for (const tag of data.tags) {
    await prisma.tag.create({ data: tag });
  }

  for (const servico of data.servicos) {
    await prisma.servico.create({ data: servico });
  }

  for (const pmoc of data.pmocs) {
    await prisma.pMOC.create({
      data: {
        ...pmoc,
        checklist: {
          create: pmoc.checklist.map((item: any) => ({
            descricao: item.descricao,
            periodicidade: item.periodicidade,
            dataExecucao: item.dataExecucao ? new Date(item.dataExecucao) : undefined,
            executadoPor: item.executadoPor,
            aprovadoPor: item.aprovadoPor,
          })),
        },
      },
    });
  }

  console.log("✅ Dados importados com sucesso para o Railway");
}

main().finally(() => prisma.$disconnect());
