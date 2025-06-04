import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tagsInvalidas = await prisma.tag.findMany({
    where: {
      OR: [
        { tag: "" },
        { tag: { equals: undefined } }
      ]
    },
  });

  console.log(" Tags inválidas encontradas:");
  tagsInvalidas.forEach(tag => {
    console.log(`ID: ${tag.id} - Tag: "${tag.tag}"`);
  });

  const result = await prisma.tag.deleteMany({
    where: {
      OR: [
        { tag: "" },
        { tag: { equals: undefined } }
      ],
    },
  });

  console.log(` ${result.count} tag(s) inválida(s) excluída(s).`);
}

main().finally(() => prisma.$disconnect());
