import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tags = await prisma.tag.findMany({
    select: { id: true, tag: true, unidade: true, local: true },
  });
  return NextResponse.json(tags);

}
