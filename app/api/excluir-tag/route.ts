import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ erro: "ID não fornecido" }, { status: 400 });
  }

  try {
    await prisma.tag.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ mensagem: "Tag excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir tag:", error);
    return NextResponse.json({ erro: "Erro ao excluir tag" }, { status: 500 });
  }
}
