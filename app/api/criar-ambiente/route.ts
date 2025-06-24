import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, endereco } = body;

    if (!nome || nome.trim() === "") {
      return NextResponse.json({ error: "O nome do ambiente é obrigatório." }, { status: 400 });
    }

    const novoAmbiente = await prisma.ambiente.create({
      data: {
        nome: nome.trim(),
        endereco: endereco?.trim() || "",
      },
    });

    return NextResponse.json(novoAmbiente);
  } catch (error) {
    console.error("Erro ao criar ambiente:", error);
    return NextResponse.json({ error: "Erro interno ao criar ambiente." }, { status: 500 });
  }
}
