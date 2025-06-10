import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const inicio = searchParams.get("inicio");
  const fim = searchParams.get("fim");

  const filtros: any = {};

  if (inicio) {
    const dataInicio = new Date(inicio + "T00:00:00.000Z");
    filtros.gte = dataInicio;
  }

  if (fim) {
    const dataFim = new Date(fim + "T23:59:59.999Z");
    filtros.lte = dataFim;
  }

  const where = filtros.gte || filtros.lte ? { criadoEm: filtros } : undefined;

  const pmocs = await prisma.pMOC.findMany({
    where,
    include: {
      checklist: true,
      tag: true,
      ambiente: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(pmocs);
}
