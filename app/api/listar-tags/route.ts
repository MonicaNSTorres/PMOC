// /api/tags/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { tag: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Erro ao listar TAGs:", error);
    return NextResponse.json({ erro: "Erro ao buscar TAGs." }, { status: 500 });
  }
}
