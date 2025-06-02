import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.tag.createMany({
    data: [
      { tag: "SSS-ST-001", unidade: "GARAGEM", local: "SALA TI/CPD/CFTV" },
      { tag: "SSS-ST-002", unidade: "GARAGEM", local: "SALA TI/CPD/CFTV" },
      { tag: "SPT-HE-001", unidade: "SEDE PISO TÉRREO", local: "HALL ELEVADOR" },
      { tag: "SPT-CX-002", unidade: "SEDE PISO TÉRREO", local: "CX ELETRÔNICO" },
      { tag: "SPT-RE-003", unidade: "SEDE PISO TÉRREO", local: "RECEPÇÃO" },
    ],
  });
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());
