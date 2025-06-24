
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function corrigirCaracteres() {
  const correcoes = [
    { errado: "TýRREO", certo: "TÉRREO" },
    { errado: "AUDITýRIO", certo: "AUDITÓRIO" },
    { errado: "RECEPýO", certo: "RECEPÇÃO" },
    { errado: "ADMINISTRýO", certo: "ADMINISTRAÇÃO" },
    { errado: "DANýA", certo: "DANÇA" },
    { errado: "ý", certo: "Í" },
    { errado: "jAMBEIRO", certo: "JAMBEIRO" },
    { errado: "JACAREý", certo: "JACAREÍ" },
    { errado: "REFEITÍRIO", certo: "REFEITÓRIO" },
    { errado: "ADMINISTRAÍÍO", certo: "ADMINISTRAÇÃO" },
    { errado: "RECEPÍÍO", certo: "RECEPÇÃO" },
    { errado: "REUNIÍO", certo: "REUNIÃO" },
    { errado: "AGÍNCIA", certo: "AGÊNCIA" },
    { errado: "ELETRÍNICO", certo: "ELETRÔNICO" },
  ];

  try {
    const tags = await prisma.tag.findMany();

    let totalCorrigidos = 0;

    for (const tag of tags) {
      let atualizado = false;
      let novoLocal = tag.local;
      let novaTag = tag.tag;
      let novaUnidade = tag.unidade;

      for (const { errado, certo } of correcoes) {
        if (novoLocal?.includes(errado)) {
          novoLocal = novoLocal.replaceAll(errado, certo);
          atualizado = true;
        }
        if (novaTag?.includes(errado)) {
          novaTag = novaTag.replaceAll(errado, certo);
          atualizado = true;
        }
        if (novaUnidade?.includes(errado)) {
          novaUnidade = novaUnidade.replaceAll(errado, certo);
          atualizado = true;
        }
      }

      if (atualizado) {
        await prisma.tag.update({
          where: { id: tag.id },
          data: {
            local: novoLocal,
            tag: novaTag,
            unidade: novaUnidade,
          },
        });
        totalCorrigidos++;
      }
    }

    console.log(`✅ Correção concluída. Total de TAGs corrigidas: ${totalCorrigidos}`);
  } catch (error) {
    console.error("❌ Erro ao corrigir caracteres:", error);
  } finally {
    await prisma.$disconnect();
  }
}

corrigirCaracteres();
