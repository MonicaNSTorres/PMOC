/*import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";


const prisma = new PrismaClient();



  function extrairEndereco(endereco: string) {
    const regex = /^(.+?),\s*(\d+),\s*(.+?),\s*(.+?)\s*[-,]\s*([A-Z]{2})\s*CEP[: ]?\s*(\d{5}-\d{3})/i;

    const match = endereco.match(regex);

    if (!match) {
      console.warn("⚠️ Endereço inválido:", endereco);
      return {
        endereco: endereco.trim(),
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
      };
    }

    return {
      endereco: match[1].trim(),  // Ex: Rua
      numero: match[2].trim(),    // Ex: Número
      bairro: match[3].trim(),    // Ex: Bairro
      cidade: match[4].trim(),    // Ex: Cidade
      uf: match[5].trim(),        // Ex: UF
    };
  }


  async function importarAmbientes() {
    const caminho = path.join(__dirname, "pmoc.csv");
    const conteudo = fs.readFileSync(caminho, { encoding: "latin1" });

    const dados = parse(conteudo, {
      columns: true,
      delimiter: ";",
      skip_empty_lines: true,
      trim: true,
    });

    for (const item of dados) {
      const nomeAmbiente = item["NOME"]?.trim();
      const nomeTag = item["TAG"]?.trim();
      const local = item["LOCAL"]?.trim();
      const unidade = item["AMBIENTE"]?.trim();
      const modelo = item["MODELO"]?.trim();
      const numeroSerie = item["NUMERO DE SERIE"]?.trim();
      const enderecoCompleto = item["ENDEREÇO"]?.trim();
      const cnpj = item["CNPJ"]?.trim();

      if (!nomeAmbiente || !nomeTag || !modelo || !numeroSerie || !enderecoCompleto) {
        console.warn("⚠️ Linha incompleta, pulando:", item);
        continue;
      }

      const endereco = extrairEndereco(enderecoCompleto);

      const ambiente = await prisma.ambiente.upsert({
        where: { nome: nomeAmbiente },
        update: {},
        create: {
          nome: nomeAmbiente,
          endereco: endereco.endereco,
          numero: endereco.numero,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          uf: endereco.uf,
          telefone: "", // ou extraia de outro campo
          cnpj: cnpj || "",
        },
      });

      const tag = await prisma.tag.upsert({
        where: { tag: nomeTag },
        update: {},
        create: {
          tag: nomeTag,
          unidade: unidade || "",
          local: local || "",
          ambienteId: ambiente.id,
        },
      });

      await prisma.equipamento.create({
        data: {
          modelo,
          numeroSerie,
          tagId: tag.id,
        },
      });
    }

    console.log("✅ Importação finalizada com sucesso.");
  }


importarAmbientes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
*/