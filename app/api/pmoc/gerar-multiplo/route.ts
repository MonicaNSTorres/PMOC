/*import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { unidade } = await req.json();

    if (!unidade) {
      return NextResponse.json({ error: "Unidade não fornecida." }, { status: 400 });
    }

    //busca todas as tags da unidade selecionada (com seus ambientes relacionados)
    const tags = await prisma.tag.findMany({
      where: { unidade },
      include: { ambiente: true },
    });

    if (tags.length === 0) {
      return NextResponse.json({ error: "Nenhuma TAG encontrada para essa unidade." }, { status: 404 });
    }

    const novosPmocs = await Promise.all(
      tags.map(async (tag) => {
        if (!tag.ambiente) return null;

        return prisma.tag.create({
          data: {
            nome: tag.ambiente.nome,
            endereco: tag.ambiente.endereco,
            numero: tag.ambiente.numero,
            bairro: tag.ambiente.bairro,
            cidade: tag.ambiente.cidade,
            uf: tag.ambiente.uf,
            telefone: tag.ambiente.telefone || "",
            nomeProprietario: "",
            cgcProprietario: "",
            enderecoProprietario: "",
            nomeResponsavel: "LUIZ CARLOS PELLEGRINI JUNIOR",
            cgcResponsavel: "0682189924",
            conselho: "Engenheiro Industrial - Mecânica - RNP 2602139106",
            art: "2620250917094",
            ambienteId: tag.ambiente.id,
            tagId: tag.id,
            checklist: {
              create: [], // vazio por padrão
            },
          },
        });
      })
    );

    const filtrados = novosPmocs.filter(Boolean); // remove nulls (caso alguma tag esteja sem ambiente)

    return NextResponse.json({ count: filtrados.length, pmocs: filtrados });
  } catch (error) {
    console.error("Erro ao gerar PMOCs múltiplos:", error);
    return NextResponse.json({ error: "Erro interno ao gerar PMOCs." }, { status: 500 });
  }
}*/
