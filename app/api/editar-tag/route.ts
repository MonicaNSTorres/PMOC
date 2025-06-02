import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const body = await req.json();

  if (!id) {
    return NextResponse.json({ erro: "ID não fornecido" }, { status: 400 });
  }

  try {
    const tagAtualizada = await prisma.tag.update({
      where: { id: Number(id) },
      data: {
        tag: body.tag,
        unidade: body.unidade,
        local: body.local,
      },
    });

    return NextResponse.json(tagAtualizada);
  } catch (error) {
    console.error("Erro ao editar tag:", error);
    return NextResponse.json({ erro: "Erro ao editar tag" }, { status: 500 });
  }
}
