import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nomeAmbiente } = await req.json();

    if (!nomeAmbiente || typeof nomeAmbiente !== "string") {
      return NextResponse.json({ error: "Nome do ambiente inválido." }, { status: 400 });
    }

    // Buscar ambiente por nome (case insensitive)
    const ambiente = await prisma.ambiente.findFirst({
      where: {
        nome: {
          equals: nomeAmbiente.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!ambiente) {
      return NextResponse.json({ error: `Ambiente "${nomeAmbiente}" não encontrado.` }, { status: 404 });
    }

    // Buscar todas as TAGs vinculadas a esse ambiente
    const tags = await prisma.tag.findMany({
      where: { ambienteId: ambiente.id },
    });

    if (tags.length === 0) {
      return NextResponse.json({
        message: `⚠️ Nenhuma TAG vinculada ao ambiente "${ambiente.nome}".`,
      });
    }

    let totalCriados = 0;

    // Criar um PMOC para cada TAG encontrada
    for (const tag of tags) {
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
          ambienteId: ambiente.id,
        },
      });

      totalCriados++;
    }

    return NextResponse.json({
      message: `✅ ${totalCriados} PMOC(s) gerado(s) para o ambiente "${ambiente.nome}".`,
    });
  } catch (error) {
    console.error("❌ Erro ao gerar PMOCs:", error);
    return NextResponse.json({ error: "Erro interno ao gerar PMOCs." }, { status: 500 });
  }
}
