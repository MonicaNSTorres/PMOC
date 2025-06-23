import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ambientes = await prisma.ambiente.findMany({
      select: { nome: true },
      distinct: ["nome"],
      orderBy: { nome: "asc" }
    });

    return NextResponse.json(ambientes);

  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    return NextResponse.json({ error: "Erro ao buscar unidades" }, { status: 500 });
  }
}
