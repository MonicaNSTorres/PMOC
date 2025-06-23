import { PrismaClient } from "@prisma/client";
import iconv from "iconv-lite";

const prisma = new PrismaClient();

function corrigirTexto(texto: string) {
  const buffer = Buffer.from(texto, "binary");
  return iconv.decode(buffer, "latin1");
}

async function main() {
  const tags = await prisma.tag.findMany();

  for (const tag of tags) {
    const textoCorrigido = corrigirTexto(tag.nome || "");
    const unidadeCorrigida = corrigirTexto(tag.unidade || "");
    const localCorrigida = corrigirTexto(tag.local || "");

    await prisma.tag.update({
      where: { id: tag.id },
      data: {
        nome: textoCorrigido,
        unidade: unidadeCorrigida,
        local: localCorrigida,
      },
    });

    console.log(`Corrigido: ${textoCorrigido} - ${unidadeCorrigida} - ${localCorrigida}`);
  }

  console.log("✅ Correções finalizadas.");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao corrigir:", e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
