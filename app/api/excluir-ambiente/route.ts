import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do ambiente não informado." }, { status: 400 });
    }

    await prisma.ambiente.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Ambiente excluído com sucesso." });
  } catch (error: any) {
    console.error("Erro ao excluir ambiente:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Não é possível excluir o ambiente pois existem registros relacionados." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Erro interno ao excluir ambiente." }, { status: 500 });
  }
}
