
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.ambiente.createMany({
    data: [
      { nome: 'SEDE' },
      { nome: 'CENTRO DE CONVIVÊNCIA' },
      { nome: 'EUGENIO DE MELO' },
      { nome: 'SICOOBCRESSEM LESTE' },
      { nome: 'SUL' },
      { nome: 'SUL AGÊNCIA' },
      { nome: 'JARDIM ORIENTE' },
      { nome: 'CAÇAPAVA' },
      { nome: 'CAMPOS DO JORDÃO' },
      { nome: 'CARAGUATATUBA' },
      { nome: 'CRUZEIRO' },
      { nome: 'ILHABELA' },
      { nome: 'JACAREÍ' },
      { nome: 'JAMBEIRO AGÊNCIA' },
      { nome: 'PARAIBUNA' },
      { nome: 'PARAIBUNA AGÊNCIA' },
      { nome: 'SÃO FRANCISCO XAVIER' },
      { nome: 'SÃO SEBASTIÃO' },
      { nome: 'TAUBATÉ' },
      { nome: 'UBATUBA' }
    ],
  });

  await prisma.servico.createMany({
    data: [
      { nome: 'Verificar e corrigir o ajuste da moldura na estrutura' },
      { nome: 'Verificar obstrução/inclinação para drenagem do condensado na bandeja' },
      { nome: 'Verificar a existência de danos e corrosão no aletado e moldura' },
      { nome: 'Verificar a operação de drenagem de água da bandeja' },
      { nome: 'Limpeza externa' },
      { nome: 'Aplicação de produtos antibactericida na serpentina' },
      { nome: 'Desincrustar serpentinas, se necessário' },
      { nome: 'Verificar e limpar turbina do ventilador' },
      { nome: 'Verificar danos e corrosão do suporte e existência de frestas' },
      { nome: 'Lavar e remover biofilme da serpentina com produto químico biodegradável' }
    ],
  });
}

main()
  .then(() => {
    console.log('Dados inseridos com sucesso!');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
