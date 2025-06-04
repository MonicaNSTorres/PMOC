import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const ambientesInvalidos = await prisma.ambiente.findMany({
    where: {
      nome: "",
    },
  });

  if (ambientesInvalidos.length === 0) {
    console.log("Nenhum ambiente com nome vazio encontrado.");
    return;
  }

  console.log("Ambientes com nome vazio:");
  ambientesInvalidos.forEach((amb) => {
    console.log(`ID: ${amb.id} - Nome: "${amb.nome}"`);
  });

  const deleted = await prisma.ambiente.deleteMany({
    where: {
      nome: "",
    },
  });

  console.log(` ${deleted.count} ambiente(s) com nome vazio excluído(s).`);
}

main()
  .catch((e) => {
    console.error("Erro ao limpar ambientes:", e);
  })
  .finally(() => prisma.$disconnect());
