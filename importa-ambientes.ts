import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();
const caminhoCSV = path.resolve(__dirname, 'AMBIENTES.csv');

async function importarAmbientes() {
  const parser = fs.createReadStream(caminhoCSV).pipe(parse({ columns: true, delimiter: ';' }));

  for await (const linha of parser) {
    const nome = linha["Nome"].trim();        // Exemplo de correção
    const local = linha["Endereço"].trim();
    const cnpj = linha["CNPJ"].replace(/[^\d]/g, "");


    await prisma.ambiente.create({
      data: {
        nome,
        local,
        cnpj,
      },
    });

    console.log(`✅ Ambiente inserido: ${nome}`);
  }

  console.log('✅ Importação finalizada.');
  await prisma.$disconnect();
}

importarAmbientes().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
