import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tag, unidade, local, nome } = body;

    if (!tag || !unidade || !local || !nome) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    const novaTag = await prisma.tag.create({
      data: {
        tag,
        unidade,
        local,
        nome,
      },
    });

    return NextResponse.json(novaTag, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tag:", error);
    return NextResponse.json({ error: "Erro interno ao criar tag." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
