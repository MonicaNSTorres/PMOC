import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { unidade } = await req.json();

    if (!unidade) {
      return NextResponse.json({ error: "Unidade não informada." }, { status: 400 });
    }

    const tags = await prisma.tag.findMany({
      where: { unidade: unidade.trim() },
    });

    if (tags.length === 0) {
      return NextResponse.json({ message: `⚠️ Nenhuma TAG encontrada para a unidade "${unidade}".` });
    }

    let totalCriados = 0;

    for (const tag of tags) {
      const ambiente = await prisma.ambiente.findUnique({
        where: { id: tag.ambienteId },
      });

      if (!ambiente) continue;

      await prisma.pMOC.create({
        data: {
          nomeAmbiente: ambiente.nome,
          endereco: ambiente.endereco ?? "",
          numero: ambiente.numero ?? "",
          bairro: ambiente.bairro ?? "",
          cidade: ambiente.cidade ?? "",
          uf: ambiente.uf ?? "",
          telefone: ambiente.telefone ?? "",
          nomeProprietario: "",
          cgcProprietario: "",
          enderecoProprietario: "",
          nomeResponsavel: "LUIZ CARLOS PELLEGRINI JUNIOR",
          cgcResponsavel: "0682189924",
          conselho: "Engenheiro Industrial - Mecânica - RNP 2602139106",
          art: "2620250917094",
          criadoEm: new Date(),
          tagId: tag.id,
          ambienteId: ambiente.id!,
        },
      });

      totalCriados++;
    }

    return NextResponse.json({
      message: `✅ ${totalCriados} PMOCs gerados para a unidade "${unidade}".`,
    });

  } catch (error) {
    console.error("❌ Erro ao gerar PMOCs:", error);
    return NextResponse.json({ error: "Erro interno ao gerar PMOCs." }, { status: 500 });
  }
}
