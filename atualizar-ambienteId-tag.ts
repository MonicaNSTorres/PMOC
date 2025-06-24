import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function atualizarAmbienteIdTags() {
  try {
    const ambientes = await prisma.ambiente.findMany({
      select: { id: true, nome: true },
    });

    const tags = await prisma.tag.findMany({
      where: { ambienteId: null },
    });

    let atualizados = 0;

    for (const tag of tags) {
      const ambienteCorrespondente = ambientes.find(
        (a) => a.nome.trim().toLowerCase() === (tag.nome ?? "").trim().toLowerCase()
      );

      if (ambienteCorrespondente) {
        await prisma.tag.update({
          where: { id: tag.id },
          data: { ambienteId: ambienteCorrespondente.id },
        });
        atualizados++;
      }
    }

    console.log(`✅ Atualização concluída. Total de TAGs atualizadas: ${atualizados}`);
  } catch (error) {
    console.error("Erro ao atualizar ambienteId nas TAGs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarAmbienteIdTags();
