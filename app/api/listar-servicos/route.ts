import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const servicos = await prisma.servico.findMany({
      //orderBy: { servico: "asc" },
    });

    return NextResponse.json(servicos);
  } catch (error) {
    console.error("Erro ao listar servicos:", error);
    return NextResponse.json({ erro: "Erro ao buscar servicos." }, { status: 500 });
  }
}
