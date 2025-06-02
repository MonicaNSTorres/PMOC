import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const ambientes = await prisma.ambiente.findMany({
    select: { nome: true },
  });
  return NextResponse.json(ambientes.map((a) => a.nome));
}
