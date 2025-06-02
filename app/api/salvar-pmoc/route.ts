
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nomeAmbiente, endereco, numero, bairro, cidade, uf, telefone,
      nomeProprietario, cgcProprietario, enderecoProprietario,
      nomeResponsavel, cgcResponsavel, conselho, art,
      ambienteSelecionado, servicoSelecionado,
      checklist = []
    } = body;

    console.log("body recebido:", body);

    let ambiente = await prisma.ambiente.findFirst({
      where: { nome: ambienteSelecionado },
    });

    if (!ambiente) {
      ambiente = await prisma.ambiente.create({
        data: { nome: ambienteSelecionado },
      });
    }


    const servico = servicoSelecionado
      ? await prisma.servico.upsert({
        where: { nome: servicoSelecionado },
        update: {},
        create: { nome: servicoSelecionado }
      })
      : null;

    console.log("checklist formatado:", checklist.map((item: any) => ({
      descricao: item.descricao,
      periodicidade: item.periodicidade,
      dataExecucao: item.data ? new Date(`${item.data}T00:00:00`) : undefined,
      executadoPor: item.executadoPor,
      aprovadoPor: item.aprovadoPor,
      servicoId: servico?.id || undefined,
    })));

    const novoPmoc = await prisma.pMOC.create({
      data: {
        nomeAmbiente,
        endereco,
        numero,
        bairro,
        cidade,
        uf,
        telefone,
        nomeProprietario,
        cgcProprietario,
        enderecoProprietario,
        nomeResponsavel,
        cgcResponsavel,
        conselho,
        art,
        ambienteId: ambiente?.id,
        servicoId: servico?.id,
        checklist: {
          create: checklist.map((item: any) => ({
            descricao: item.descricao,
            periodicidade: item.periodicidade,
            dataExecucao: item.data ? new Date(item.data) : undefined,
            executadoPor: item.executadoPor,
            aprovadoPor: item.aprovadoPor,
            servicoId: servico?.id || undefined,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, pmocId: novoPmoc.id });
  } catch (error) {
    console.error("Erro ao salvar PMOC:", error);
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}
