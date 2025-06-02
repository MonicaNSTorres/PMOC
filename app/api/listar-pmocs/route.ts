import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const pmocs = await prisma.pMOC.findMany({
    include: {
      checklist: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(pmocs);
}
