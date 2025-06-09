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
    const servicoAtualizado = await prisma.servico.update({
      where: { id: Number(id) },
      data: {
        id: body.id
      },
    });

    return NextResponse.json(servicoAtualizado);
  } catch (error) {
    console.error("Erro ao editar Serviço:", error);
    return NextResponse.json({ erro: "Erro ao editar Serviço" }, { status: 500 });
  }
}
