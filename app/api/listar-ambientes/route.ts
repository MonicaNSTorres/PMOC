import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ambientes = await prisma.ambiente.findMany({
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(ambientes);
  } catch (error) {
    console.error("Erro ao listar ambientes:", error);
    return NextResponse.json({ erro: "Erro ao buscar ambientes." }, { status: 500 });
  }
}
