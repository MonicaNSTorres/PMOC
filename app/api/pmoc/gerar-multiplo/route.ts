// Atualize a sua rota POST /api/pmoc/gerar-multiplo para incluir o checklist inicial com 10 servicos

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { unidade } = body;

  if (!unidade) {
    return NextResponse.json({ error: 'Unidade não informada' }, { status: 400 });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: { unidade: unidade },
      include: { ambiente: true },
    });

    const servicos = await prisma.servico.findMany({
      take: 10,
      orderBy: { id: 'asc' },
    });

    for (const tag of tags) {
      const pmoc = await prisma.pMOC.create({
        data: {
          nomeAmbiente: tag.ambiente?.nome || '',
          endereco: tag.ambiente?.endereco || '',
          numero: tag.ambiente?.numero || '',
          bairro: tag.ambiente?.bairro || '',
          cidade: tag.ambiente?.cidade || '',
          uf: tag.ambiente?.uf || '',
          telefone: tag.ambiente?.telefone || '',
          nomeProprietario: '',
          cgcProprietario: '',
          enderecoProprietario: '',
          nomeResponsavel: 'LUIZ CARLOS PELLEGRINI JUNIOR',
          cgcResponsavel: '0682189924',
          conselho: 'Engenheiro Industrial - Mecânica - RNP 2602139106',
          art: '2620250917094',
          criadoEm: new Date(),
          tagId: tag.id,
          ambienteId: tag.ambienteId,
        },
      });

      await prisma.checklist.createMany({
        data: servicos.map((servico) => ({
          descricao: servico.nome,
          periodicidade: 'Mensal',
          data: null,
          executadoPor: '',
          aprovadoPor: '',
          pmocId: pmoc.id,
        })),
      });
    }

    return NextResponse.json({ message: 'PMOCs gerados com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao gerar PMOCs:', error);
    return NextResponse.json({ error: 'Erro interno ao gerar PMOCs' }, { status: 500 });
  }
}
