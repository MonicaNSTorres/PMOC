import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ambientes = await prisma.ambiente.findMany();

  const apenasNumerosRegex = /^[0-9]+$/;

  const ambientesParaDeletar = ambientes.filter(a =>
    apenasNumerosRegex.test(a.nome)
  );

  console.log(`Encontrados ${ambientesParaDeletar.length} ambientes com nome numérico.`);

  for (const ambiente of ambientesParaDeletar) {
    await prisma.ambiente.delete({
      where: { id: ambiente.id },
    });
    console.log(`Deletado: ${ambiente.nome}`);
  }

  console.log("Limpeza concluída.");
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
