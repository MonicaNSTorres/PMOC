import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.ambiente.deleteMany();
  console.log("Todos os ambientes foram excluídos.");
}

main().finally(() => prisma.$disconnect());
