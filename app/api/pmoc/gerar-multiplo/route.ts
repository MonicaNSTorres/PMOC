import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { unidade } = await req.json();

    if (!unidade) {
      return NextResponse.json({ error: "Unidade não informada." }, { status: 400 });
    }

    const ambientes = await prisma.ambiente.findMany();

    let totalCriados = 0;

    for (const ambiente of ambientes) {
      const tags = await prisma.tag.findMany({
        where: {
          unidade: unidade.trim(),
          ambienteId: ambiente.id,
        },
      });

      if (tags.length === 0) continue;

      for (const tag of tags) {
        await prisma.pMOC.create({
          data: {
            nomeAmbiente: ambiente.nome,
            endereco: "",
            numero: "",
            bairro: "",
            cidade: "São José dos Campos",
            uf: "",
            telefone: "",
            nomeProprietario: "",
            cgcProprietario: "",
            enderecoProprietario: "",
            nomeResponsavel: "",
            cgcResponsavel: "",
            conselho: "",
            art: "",
            criadoEm: new Date(),
            tagId: tag.id,
            ambienteId: ambiente.id,
          },
        });
        totalCriados++;
      }
    }

    return NextResponse.json({
      message:
        totalCriados > 0
          ? `✅ ${totalCriados} PMOCs gerados para a unidade "${unidade}".`
          : `⚠️ Nenhum PMOC foi gerado para a unidade "${unidade}".`,
    });
  } catch (error) {
    console.error("❌ Erro ao gerar PMOCs:", error);
    return NextResponse.json({ error: "Erro interno ao gerar PMOCs." }, { status: 500 });
  }
}
