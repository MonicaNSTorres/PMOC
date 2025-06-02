import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tags = await prisma.tag.findMany({
    select: { tag: true },
  });

  return NextResponse.json(tags.map((t) => t.tag));
}
