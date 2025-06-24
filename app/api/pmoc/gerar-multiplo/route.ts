//import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { unidade } = await req.json();

  if (!unidade) {
    return NextResponse.json({ error: "Unidade não informada." }, { status: 400 });
  }

  try {
    // Buscar TAGs da unidade, com dados do ambiente vinculado
    const tags = await prisma.tag.findMany({
      where: {
        nome: {
          equals: unidade,
          mode: "insensitive", // para não dar problema com maiúsculas
        },
      },
      include: {
        ambiente: true,
      },
    });


    if (!tags.length) {
      return NextResponse.json({ error: "Nenhuma TAG encontrada para essa unidade." }, { status: 404 });
    }

    const pmocsCriados = await Promise.all(
      tags.map((tag) => {
        const ambiente = tag.ambiente;

        return prisma.pMOC.create({
          data: {
            nomeAmbiente: ambiente?.nome ?? tag.local ?? "Ambiente sem nome",
            endereco: ambiente?.endereco ?? tag.local ?? "",
            numero: ambiente?.numero ?? "",
            bairro: ambiente?.bairro ?? "",
            cidade: ambiente?.cidade ?? "",
            uf: ambiente?.uf ?? "",
            telefone: ambiente?.telefone ?? "",
            nomeProprietario: "",
            cgcProprietario: "",
            enderecoProprietario: "",
            nomeResponsavel: "LUIZ CARLOS PELLEGRINI JUNIOR",
            cgcResponsavel: "0682189924",
            conselho: "Engenheiro Industrial - Mecânica - RNP 2602139106",
            art: "2620250917094",
            criadoEm: new Date(),
            tag: {
              connect: { id: tag.id },
            },
            ambiente: ambiente?.id
              ? {
                connect: { id: ambiente.id },
              }
              : undefined,
          },
        });
      })
    );

    return NextResponse.json({ message: "PMOCs gerados com sucesso", count: pmocsCriados.length });
  } catch (error) {
    console.error("Erro ao gerar PMOCs:", error);
    return NextResponse.json({ error: "Erro ao gerar PMOCs." }, { status: 500 });
  }
}
