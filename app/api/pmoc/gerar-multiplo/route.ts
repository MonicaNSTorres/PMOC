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

    for (const ambiente of ambientes) {
      const tags = await prisma.tag.findMany({
        where: {
          unidade,
          ambienteId: ambiente.id,
        },
      });

      for (const tag of tags) {
        await prisma.pMOC.create({
          data: {
            nomeAmbiente: ambiente.nome,
            cidade: "São José dos Campos",
            criadoEm: new Date(),
            tagId: tag.id,
            ambienteId: ambiente.id,
          },
        });
      }
    }

    return NextResponse.json({ message: "PMOCs gerados com sucesso!" });
  } catch (error) {
    console.error("Erro ao gerar PMOCs:", error);
    return NextResponse.json({ error: "Erro interno ao gerar PMOCs." }, { status: 500 });
  }
}
