""import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

async function importarEquipamentos() {
  const filePath = path.join(__dirname, 'pmoc.csv');
  const file = fs.readFileSync(filePath, 'latin1');

  const parsed = Papa.parse(file, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
  });

  let count = 0;

  for (const row of parsed.data as any[]) {
    const tag = row['TAG']?.trim();
    const modelo = row['MODELO']?.trim();
    const numeroSerie = row['NUMERO DE SERIE']?.trim();

    if (!tag || !modelo || !numeroSerie || numeroSerie === '-') {
      console.warn('⚠️ Linha incompleta, pulando:', row);
      continue;
    }

    const tagEncontrada = await prisma.tag.findUnique({
      where: { tag },
    });

    if (!tagEncontrada) {
      console.warn(`⚠️ Tag não encontrada no banco: ${tag}`);
      continue;
    }

    await prisma.equipamento.create({
      data: {
        modelo,
        numeroSerie,
        tag: { connect: { id: tagEncontrada.id } },
      },
    });

    count++;
  }

  console.log(`✅ Importação finalizada com sucesso. ${count} equipamentos inseridos.`);
}

importarEquipamentos()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
