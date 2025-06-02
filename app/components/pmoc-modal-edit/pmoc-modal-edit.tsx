"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
    ...initialData,
    tagSelecionada: initialData.tagSelecionada || "",
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [ambientes, setAmbientes] = useState<string[]>([]);
  const [servicos, setServicos] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);


  useEffect(() => {
    const checklistFormatado = (initialData.checklist || []).map((item: any) => ({
      descricao: item.descricao,
      periodicidade: item.periodicidade,
      data: item.dataExecucao ? item.dataExecucao.split("T")[0] : "",
      executadoPor: item.executadoPor,
      aprovadoPor: item.aprovadoPor,
    }));

    setChecklist(checklistFormatado);
  }, [initialData]);

  useEffect(() => {
    async function fetchSelects() {
      const [amb, srv, tgs] = await Promise.all([
        axios.get("/api/ambientes"),
        axios.get("/api/servicos"),
        axios.get("/api/tags"),
      ]);
      setAmbientes(amb.data);
      setServicos(srv.data);
      setTags(tgs.data.map((t: any) => t.tag));
    }
    fetchSelects();
  }, []);


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
    onSave({ ...formData, checklist });
  }


  return (
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
        <select name="ambienteSelecionado" value={formData.ambienteSelecionado} onChange={handleChange} className="border p-2 rounded">
          <option value="">Selecione um ambiente</option>
          {ambientes.map((amb, i) => <option key={i} value={amb}>{amb}</option>)}
        </select>
        <select name="servicoSelecionado" value={formData.servicoSelecionado} onChange={handleChange} className="border p-2 rounded">
          <option value="">Selecione um serviço</option>
          {servicos.map((srv, i) => <option key={i} value={srv}>{srv}</option>)}
        </select>
        <select
          name="tagSelecionada"
          value={formData.tagSelecionada}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Selecione uma TAG</option>
          {tags.map((tag, i) => <option key={i} value={tag}>{tag}</option>)}
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
        <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Cancelar</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer">Salvar</button>
      </div>
    </form>
  );
}
