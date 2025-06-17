"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { X } from "lucide-react";

interface ChecklistItem {
  descricao: string;
  periodicidade: string;
  data: string;
  executadoPor: string;
  aprovadoPor: string;
}

interface Props {
  initialData: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function PMOCFormEditable({ initialData, onCancel, onSave }: Props) {
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
    tagSelecionada: "",
    ambienteSelecionado: "",
    servicoSelecionado: "",
  });



  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; tag: string; unidade: string; local: string }[]>([]);
  const [ambientes, setAmbientes] = useState<{ id: number; nome: string }[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("formData.ambienteSelecionado:", formData.ambienteSelecionado);
    console.log("formData.tagSelecionada:", formData.tagSelecionada);
    console.log("ambientes disponíveis:", ambientes);
    console.log("tags disponíveis:", tags);
  }, [formData, ambientes, tags]);

  useEffect(() => {
    if (servicos.length > 0 && initialData?.checklist) {
      const checklistFormatado = initialData.checklist.map((item: any): ChecklistItem => {
        const servico = servicos.find(s => String(s.id) === String(item.descricao));
        return {
          descricao: servico ? servico.nome : item.descricao,
          periodicidade: item.periodicidade,
          data: item.dataExecucao ? item.dataExecucao.split("T")[0] : "",
          executadoPor: item.executadoPor,
          aprovadoPor: item.aprovadoPor,
        };
      });

      setChecklist(checklistFormatado);
    }
  }, [servicos, initialData]);

  useEffect(() => {
    async function fetchSelects() {
      const [amb, srv, tgs] = await Promise.all([
        axios.get("/api/ambientes"),
        axios.get("/api/servicos"),
        axios.get("/api/tags"),
      ]);
      setAmbientes(amb.data);
      setServicos(srv.data);
      setTags(tgs.data);
    }
    fetchSelects();
  }, []);


  useEffect(() => {
    if (initialData && tags.length > 0 && ambientes.length > 0) {
      const ambienteExiste = ambientes.some(a => String(a.id) === String(initialData.ambienteId));
      const tagExiste = tags.some(t => String(t.id) === String(initialData.tagId));

      setFormData({
        nomeAmbiente: initialData.nomeAmbiente || "",
        endereco: initialData.endereco || "",
        numero: initialData.numero || "",
        bairro: initialData.bairro || "",
        cidade: initialData.cidade || "",
        uf: initialData.uf || "",
        telefone: initialData.telefone || "",
        nomeProprietario: initialData.nomeProprietario || "",
        cgcProprietario: initialData.cgcProprietario || "",
        enderecoProprietario: initialData.enderecoProprietario || "",
        nomeResponsavel: initialData.nomeResponsavel || "",
        cgcResponsavel: initialData.cgcResponsavel || "",
        conselho: initialData.conselho || "",
        art: initialData.art || "",
        ambienteSelecionado: ambienteExiste ? String(initialData.ambienteId) : "",
        tagSelecionada: tagExiste ? String(initialData.tagId) : "",
        servicoSelecionado: "",
      });
    }
  }, [initialData, tags, ambientes]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleChecklistChange(index: number, field: keyof ChecklistItem, value: string) {
    const updated = [...checklist];
    updated[index][field] = value;
    setChecklist(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const checklistTransformado = checklist.map((item: ChecklistItem) => {
      const servico = servicos.find(s => s.nome === item.descricao);
      return {
        descricao: item.descricao,
        periodicidade: item.periodicidade,
        data: item.data,
        executadoPor: item.executadoPor,
        aprovadoPor: item.aprovadoPor,
        servicoId: servico?.id ?? null,
        dataExecucao: item.data ? item.data : undefined,
      };
    });

    onSave({
      ...formData,
      checklist: checklistTransformado,
    });
  }

  function formatarDataBR(data: string): string {
    if (!data) return "";
    const [ano, mes, dia] = data.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function handleGeneratePDF() {
    const doc = new jsPDF();
    const ambienteSelecionado = ambientes.find(a => String(a.id) === String(formData.ambienteSelecionado));
    const tagSelecionada = tags.find(t => String(t.id) === String(formData.tagSelecionada));

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const hoje = new Date();
    const dataGeracao = hoje.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Data de Geração: ${dataGeracao}`, 200, 10, { align: "right" });

    doc.text("PLANO DE MANUTENÇÃO, OPERAÇÃO E CONTROLE - PMOC", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("1 - Identificação do Ambiente ou Conjunto de Ambientes:", 10, 25);

    doc.setFont("helvetica", "normal");
    doc.text(`Nome (Edifício/Entidade): ${formData.nomeAmbiente || ""}`, 10, 32);
    doc.text(`Endereço completo: ${formData.endereco || ""}, Nº: ${formData.numero || ""}`, 10, 38);
    doc.text(`Complemento / Bairro / Cidade / UF: ${formData.bairro || ""} / ${formData.cidade || ""} / ${formData.uf || ""}`, 10, 44);
    doc.text(`Telefone: ${formData.telefone || ""}`, 10, 50);

    doc.setFont("helvetica", "bold");
    doc.text("2 - Identificação do Proprietário, Locatário ou Preposto:", 10, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome/Razão Social: ${formData.nomeProprietario || ""}`, 10, 66);
    doc.text(`CIC/CGC: ${formData.cgcProprietario || ""}`, 10, 72);
    doc.text(`Endereço completo: ${formData.enderecoProprietario || ""}`, 10, 78);

    doc.setFont("helvetica", "bold");
    doc.text("3 - Identificação do Responsável Técnico:", 10, 88);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome/Razão Social: ${formData.nomeResponsavel || ""}`, 10, 94);
    doc.text(`CIC/CGC: ${formData.cgcResponsavel || ""}`, 10, 100);
    doc.text(`Registro no Conselho: ${formData.conselho || ""}`, 10, 106);
    doc.text(`ART: ${formData.art || ""}`, 10, 112);

    doc.setFont("helvetica", "bold");
    doc.text("4 - Relação dos Ambientes Climatizados:", 10, 122);
    doc.setFont("helvetica", "normal");
    doc.text(`Ambiente: ${ambienteSelecionado?.nome || ""}`, 10, 128);
    doc.text(`Serviço: ${formData.servicoSelecionado || ""}`, 10, 134);
    doc.text(`TAG: ${tagSelecionada ? `${tagSelecionada.tag} - ${tagSelecionada.unidade} - ${tagSelecionada.local}` : ""}`, 10, 134);
    doc.setFontSize(8);
    doc.text("NOTA: anexar Projeto de Instalação do sistema de climatização", 10, 146);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("5 - Plano de Manutenção e Controle", 10, 156);

    autoTable(doc, {
      head: [["Descrição", "Periodicidade", "Data Execução", "Executado por", "Aprovado por"]],
      body: checklist.map((item: ChecklistItem) => [
        item.descricao,
        item.periodicidade,
        formatarDataBR(item.data),
        item.executadoPor,
        item.aprovadoPor,
      ]),
      startY: 160,
      styles: {
        fontSize: 9,
        cellPadding: { top: 4, bottom: 4 },
      },
      headStyles: { fillColor: [230, 230, 230], textColor: 0 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "normal");
    doc.line(20, finalY, 90, finalY);
    doc.line(120, finalY, 190, finalY);
    doc.text("Técnico Responsável", 30, finalY + 6);
    doc.text("Engenheiro Responsável", 130, finalY + 6);

    doc.save("PMOC-preenchido.pdf");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("tags:", tags);
  console.log("ambientes:", ambientes);
  console.log("formData.tagSelecionada:", formData.tagSelecionada);
  console.log("formData.ambienteSelecionado:", formData.ambienteSelecionado);

  console.log("TAG selecionada:", formData.tagSelecionada);
  console.log("Tags disponíveis:", tags.map(t => t.id));


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="relative bg-white p-6 rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onCancel} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg font-bold">
          <X size={30} className="cursor-pointer font-semibold"/>
        </button>
        <h1 className="text-2xl font-bold mb-6">Editar PMOCs</h1>
        <div id="pmoc-pdf" className="bg-white p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nomeAmbiente" value={formData.nomeAmbiente} onChange={handleChange} className="border p-2 rounded" placeholder="Nome do Ambiente" />
              <input name="endereco" value={formData.endereco} onChange={handleChange} className="border p-2 rounded" placeholder="Endereço" />
              <input name="numero" value={formData.numero} onChange={handleChange} className="border p-2 rounded" placeholder="Número" />
              <input name="bairro" value={formData.bairro} onChange={handleChange} className="border p-2 rounded" placeholder="Bairro" />
              <input name="cidade" value={formData.cidade} onChange={handleChange} className="border p-2 rounded" placeholder="Cidade" />
              <input name="uf" value={formData.uf} onChange={handleChange} className="border p-2 rounded" placeholder="UF" />
              <input name="telefone" value={formData.telefone} onChange={handleChange} className="border p-2 rounded" placeholder="Telefone" />
              <input name="nomeProprietario" value={formData.nomeProprietario} onChange={handleChange} className="border p-2 rounded" placeholder="Nome Proprietário" />
              <input name="cgcProprietario" value={formData.cgcProprietario} onChange={handleChange} className="border p-2 rounded" placeholder="CGC Proprietário" />
              <input name="enderecoProprietario" value={formData.enderecoProprietario} onChange={handleChange} className="border p-2 rounded" placeholder="Endereço Proprietário" />
              <input name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} className="border p-2 rounded" placeholder="Nome Responsável" />
              <input name="cgcResponsavel" value={formData.cgcResponsavel} onChange={handleChange} className="border p-2 rounded" placeholder="CGC Responsável" />
              <input name="conselho" value={formData.conselho} onChange={handleChange} className="border p-2 rounded" placeholder="Conselho" />
              <input name="art" value={formData.art} onChange={handleChange} className="border p-2 rounded" placeholder="ART" />
              <select
                name="ambienteSelecionado"
                value={formData.ambienteSelecionado}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Selecione um Ambiente</option>
                {ambientes.map((amb) => (
                  <option key={amb.id} value={String(amb.id)}>
                    {amb.nome}
                  </option>
                ))}
              </select>

              {/*<select name="servicoSelecionado" value={formData.servicoSelecionado} onChange={handleChange} className="border p-2 rounded">
                <option value="">Selecione um serviço</option>
                {servicos.map((srv, i) => <option key={i} value={srv}>{srv}</option>)}
              </select>*/}
              <select
                name="tagSelecionada"
                value={formData.tagSelecionada}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Selecione uma TAG</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={String(tag.id)}>
                    {tag.tag} - {tag.unidade} - {tag.local}
                  </option>
                ))}
              </select>

            </div>

            {checklist.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Checklist</h4>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Descrição</th>
                      <th className="border p-2">Periodicidade</th>
                      <th className="border p-2">Data Execução</th>
                      <th className="border p-2">Executado por</th>
                      <th className="border p-2">Aprovado por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklist.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.descricao}</td>
                        <td className="border p-2">{item.periodicidade}</td>
                        <td className="border p-2">
                          <input type="date" className="w-full border rounded px-2" value={item.data} onChange={(e) => handleChecklistChange(index, "data", e.target.value)} />
                        </td>
                        <td className="border p-2">
                          <input type="text" className="w-full border rounded px-2" value={item.executadoPor} onChange={(e) => handleChecklistChange(index, "executadoPor", e.target.value)} />
                        </td>
                        <td className="border p-2">
                          <input type="text" className="w-full border rounded px-2" value={item.aprovadoPor} onChange={(e) => handleChecklistChange(index, "aprovadoPor", e.target.value)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={onCancel} className="border px-4 py-2 rounded hover:cursor-pointer">Cancelar</button>
              <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:cursor-pointer">Salvar</button>
              <button type="button" onClick={handleGeneratePDF} className="bg-green-700 text-white px-4 py-2 rounded hover:cursor-pointer">Gerar PDF</button>
            </div>
          </form>
        </div >
      </div>
    </div>
  );
}
