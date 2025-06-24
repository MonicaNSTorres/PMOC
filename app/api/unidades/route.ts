import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const unidades = await prisma.tag.findMany({
    select: { nome: true as any },
    distinct: ['nome'],
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(unidades);
}
