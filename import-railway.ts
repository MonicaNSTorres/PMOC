/*import { PrismaClient } from "@prisma/client";
import data from "./backup.json";

const prisma = new PrismaClient();

interface TagType {
    tag: string;
    unidade: string;
    local: string;
}

interface AmbienteType {
    nome: string;
}

async function main() {
    // Importar Ambientes
    for (const ambiente of data.ambientes as AmbienteType[]) {
        await prisma.ambiente.upsert({
            where: { nome: ambiente.nome },
            update: {},
            create: { nome: ambiente.nome },
        });
    }

    // Importar Tags com ambienteId vinculado à unidade
    for (const tag of data.tags as TagType[]) {
        const ambiente = await prisma.ambiente.findFirst({
            where: { nome: tag.unidade }, // Relaciona TAG com ambiente pela unidade
        });

        if (!ambiente) {
            console.warn(`⚠️ Ambiente não encontrado para unidade: ${tag.unidade}`);
            continue;
        }

        await prisma.tag.create({
            data: {
                tag: tag.tag,
                unidade: tag.unidade,
                local: tag.local,
                ambienteId: ambiente.id, // Esse deve ser definido antes, veja abaixo
            },
        });


    }

    console.log("✅ Dados importados com sucesso para o Railway");
}

main()
    .catch((e) => {
        console.error("❌ Erro ao importar dados:", e);
    })
    .finally(() => {
        prisma.$disconnect();
    });
*/