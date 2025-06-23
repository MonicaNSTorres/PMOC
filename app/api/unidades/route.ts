import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const unidades = await prisma.tag.findMany({
      select: { unidade: true },
      distinct: ["unidade"],
      orderBy: { unidade: "asc" }
    });

    return NextResponse.json(unidades);
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    return NextResponse.json({ error: "Erro ao buscar unidades" }, { status: 500 });
  }
}
