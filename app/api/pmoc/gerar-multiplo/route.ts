import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { unidade } = await req.json();

    if (!unidade) {
      return NextResponse.json({ error: "Unidade não fornecida." }, { status: 400 });
    }

    const tags = await prisma.tag.findMany({
      where: { unidade },
      include: { ambiente: true },
    });

    if (tags.length === 0) {
      return NextResponse.json({ error: "Nenhuma TAG encontrada para essa unidade." }, { status: 404 });
    }

    const servicos = await prisma.servico.findMany({ take: 10 }); // pega até 10 serviços
    if (servicos.length === 0) {
      return NextResponse.json({ error: "Nenhum serviço cadastrado no sistema." }, { status: 404 });
    }

    const novosPmocs = await Promise.all(
      tags.map(async (tag) => {
        const ambiente = tag.ambiente;
        if (!ambiente) return null;

        return prisma.pMOC.create({
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
            ambienteId: ambiente.id,
            tagId: tag.id,
            checklist: {
              create: servicos.map((srv) => ({
                descricao: srv.nome,
                periodicidade: "Mensal", // ou outro valor padrão
              })),
            },
          },
          include: { checklist: true }, // opcional, só se quiser retornar o checklist junto
        });
      })
    );

    const filtrados = novosPmocs.filter((pmoc): pmoc is NonNullable<typeof pmoc> => !!pmoc);

    return NextResponse.json({ count: filtrados.length, pmocs: filtrados });
  } catch (error) {
    console.error("Erro ao gerar PMOCs múltiplos:", error);
    return NextResponse.json({ error: "Erro interno ao gerar PMOCs." }, { status: 500 });
  }
}
