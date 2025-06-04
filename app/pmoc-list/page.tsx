
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import PMOCFormEditable from "../components/pmoc-modal-edit/pmoc-modal-edit";
import BackButton from "../components/back-button/back-button";


interface PMOC {
  id: number;
  nomeAmbiente: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone: string;
  nomeProprietario: string;
  cgcProprietario: string;
  enderecoProprietario: string;
  nomeResponsavel: string;
  cgcResponsavel: string;
  conselho: string;
  art: string;
  criadoEm: string;
}

export default function ListaPMOC() {
  const [pmocs, setPmocs] = useState<PMOC[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState<Partial<PMOC>>({});

  useEffect(() => {
    fetchPmocs();
  }, []);

  async function fetchPmocs() {
    const response = await axios.get("/api/listar-pmocs");
    setPmocs(response.data);
  }

  async function handleDelete(id: number) {
    const confirmar = confirm("Tem certeza que deseja excluir este PMOC?");
    if (!confirmar) return;
    await axios.delete(`/api/excluir-pmoc?id=${id}`);
    fetchPmocs();
  }

  async function abrirEdicao(pmoc: PMOC) {
    const response = await axios.get(`/api/pmoc?id=${pmoc.id}`);
    setFormEdit(response.data);
    setEditingId(pmoc.id);
  }


  async function salvarEdicao() {
    if (!editingId) return;
    await axios.put(`/api/editar-pmoc?id=${editingId}`, formEdit);
    setEditingId(null);
    fetchPmocs();
  }

  function handleInputChange(field: keyof PMOC, value: string) {
    setFormEdit((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="flex flex-col pl-[9%] pr-[10%] min-h-screen bg-gray-200 p-4">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6">PMOCs Cadastrados</h1>
        <div className="overflow-auto">
          <table className="w-full text-md border bg-white shadow-md">
            <thead className="text-gray-700 bg-blue-100">
              <tr>
                <th className="border p-2 text-left">Código</th>
                <th className="border p-2 text-left">Nome do Ambiente</th>
                <th className="border p-2 text-left">Cidade/UF</th>
                <th className="border p-2 text-left">Data Cadastro</th>
                <th className="border p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pmocs.map((pmoc) => (
                <tr key={pmoc.id} className="border-t">
                  <td className="border p-2">{pmoc.id}</td>
                  <td className="border p-2">{pmoc.nomeAmbiente}</td>
                  <td className="border p-2">{pmoc.cidade} / {pmoc.uf}</td>
                  <td className="border p-2">{new Date(pmoc.criadoEm).toLocaleDateString()}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => abrirEdicao(pmoc)} className="text-blue-800 hover:text-blue-600 cursor-pointer">
                      <Pencil size={22} />
                    </button>
                    <button onClick={() => handleDelete(pmoc.id)} className="text-red-800 hover:text-red-600 cursor-pointer">
                      <Trash2 size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded shadow max-w-4xl w-full">
              <h2 className="text-xl font-semibold mb-4">Editar PMOC #{editingId}</h2>
              <PMOCFormEditable
                initialData={formEdit}
                onCancel={() => setEditingId(null)}
                onSave={async (data) => {
                  await axios.put(`/api/editar-pmoc?id=${editingId}`, data);
                  setEditingId(null);
                  fetchPmocs();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
