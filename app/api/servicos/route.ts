import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const servicos = await prisma.servico.findMany({
    select: { id: true, nome: true },
  });
  return NextResponse.json(servicos);
}
