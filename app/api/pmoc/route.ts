
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const pmoc = await prisma.pMOC.findUnique({
      where: { id },
      include: {
        checklist: {
          orderBy: { id: "asc" },
        },
      },
    });

    if (!pmoc) {
      return NextResponse.json({ error: "PMOC não encontrado" }, { status: 404 });
    }

    return NextResponse.json(pmoc);
  } catch (error) {
    console.error("Erro ao buscar PMOC:", error);
    return NextResponse.json({ error: "Erro ao buscar PMOC" }, { status: 500 });
  }
}
