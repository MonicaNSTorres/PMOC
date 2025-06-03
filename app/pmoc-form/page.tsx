"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BackButton from "../components/back-button/back-button";

type ChecklistItem = {
    descricao: string;
    periodicidade: string;
    data: string;
    executadoPor: string;
    aprovadoPor: string;
};


export default function PMOCForm() {
    const [ambientes, setAmbientes] = useState<string[]>([]);
    const [servicos, setServicos] = useState<string[]>([]);
    const [tags, setTags] = useState<{ id: number; tag: string; unidade: string; local: string }[]>([]);
    const router = useRouter();
    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        {
            descricao: "Verificar sujeira, danos e corrosão",
            periodicidade: "Mensal",
            data: "",
            executadoPor: "",
            aprovadoPor: "",
        },
        {
            descricao: "Limpar serpentinas e bandejas",
            periodicidade: "Mensal",
            data: "",
            executadoPor: "",
            aprovadoPor: "",
        },
        {
            descricao: "Verificar controles de vazão",
            periodicidade: "Mensal",
            data: "",
            executadoPor: "",
            aprovadoPor: "",
        },
    ]);


    const [formData, setFormData] = useState({
        nomeAmbiente: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        telefone: "",
        nomeProprietario: "",
        cgcProprietario: "",
        enderecoProprietario: "",
        nomeResponsavel: "",
        cgcResponsavel: "",
        conselho: "",
        art: "",
        ambienteSelecionado: "",
        servicoSelecionado: "",
        tagSelecionada: "",
    });


    useEffect(() => {
        async function fetchSelects() {
            const [amb, srv, tg] = await Promise.all([
                axios.get("/api/ambientes"),
                axios.get("/api/servicos"),
                axios.get("/api/tags"),
            ]);
            setAmbientes(amb.data);
            setServicos(srv.data);
            setTags(tg.data);
        }

        fetchSelects();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleChecklistChange(
        index: number,
        field: keyof ChecklistItem,
        value: string
    ) {
        const updated = [...checklist];
        updated[index][field] = value;
        setChecklist(updated);
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await axios.post("/api/salvar-pmoc", {
                ...formData,
                checklist,
            });

            alert("PMOC salvo com sucesso!");
            router.push("/pmoc-list");
        } catch (error) {
            console.error("Erro ao salvar PMOC:", error);
            alert("Erro ao salvar o PMOC.");
        }
    }



    return (
        <div className="flex flex-col pl-[9%] pr-[10%] min-h-screen bg-gray-200 p-4">
            <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
                <BackButton />
                <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Plano de Manutenção, Operação e Controle - PMOC</h2>
                <form onSubmit={handleSubmit} className="space-y-12">

                    <section>
                        <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">1 - Identificação do Ambiente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {["nomeAmbiente", "endereco", "numero", "bairro", "cidade", "uf", "telefone"].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">2 - Identificação do Proprietário</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input name="nomeProprietario" placeholder="Nome/Razão Social" value={formData.nomeProprietario} onChange={handleChange} className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" />
                            <input name="cgcProprietario" placeholder="CIC/CGC" value={formData.cgcProprietario} onChange={handleChange} className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" />
                            <input name="enderecoProprietario" placeholder="Endereço completo" value={formData.enderecoProprietario} onChange={handleChange} className="md:col-span-2 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">3 - Responsável Técnico</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input name="nomeResponsavel" placeholder="Nome/Razão Social" value={formData.nomeResponsavel} onChange={handleChange} className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" />
                            <input name="cgcResponsavel" placeholder="CIC/CGC" value={formData.cgcResponsavel} onChange={handleChange} className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" />
                            <input name="conselho" placeholder="Registro no Conselho de Classe" value={formData.conselho} onChange={handleChange} className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" />
                            <input name="art" placeholder="ART (Anotação de Responsabilidade Técnica)" value={formData.art} onChange={handleChange} className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">4 - Ambientes Climatizados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <select name="ambienteSelecionado" value={formData.ambienteSelecionado} onChange={handleChange} className="border rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400">
                                <option value="">Selecione um ambiente</option>
                                {ambientes.map((amb, i) => <option key={i} value={amb}>{amb}</option>)}
                            </select>
                            <select name="servicoSelecionado" value={formData.servicoSelecionado} onChange={handleChange} className="border rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400">
                                <option value="">Selecione um serviço</option>
                                {servicos.map((srv, i) => <option key={i} value={srv}>{srv}</option>)}
                            </select>
                            <select name="tagSelecionada" value={formData.tagSelecionada} onChange={handleChange} className="border rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400">
                                <option value="">Selecione uma TAG</option>
                                {tags.map((tag, i) => <option key={i} value={tag}>{tag}</option>)}
                            </select>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">5 - Plano de Manutenção e Controle</h3>
                        <div className="overflow-auto rounded-lg shadow-md">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-blue-100 text-gray-700">
                                    <tr>
                                        <th className="border p-3">Descrição</th>
                                        <th className="border p-3">Periodicidade</th>
                                        <th className="border p-3">Data Execução</th>
                                        <th className="border p-3">Executado por</th>
                                        <th className="border p-3">Aprovado por</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checklist.map((item, index) => (
                                        <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border p-2">{item.descricao}</td>
                                            <td className="border p-2">{item.periodicidade}</td>
                                            <td className="border p-2">
                                                <input type="date" className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400" value={item.data} onChange={(e) => handleChecklistChange(index, "data", e.target.value)} />
                                            </td>
                                            <td className="border p-2">
                                                <input type="text" className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400" value={item.executadoPor} onChange={(e) => handleChecklistChange(index, "executadoPor", e.target.value)} />
                                            </td>
                                            <td className="border p-2">
                                                <input type="text" className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400" value={item.aprovadoPor} onChange={(e) => handleChecklistChange(index, "aprovadoPor", e.target.value)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="pt-6 text-center">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition shadow-md">
                            Salvar PMOC
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
