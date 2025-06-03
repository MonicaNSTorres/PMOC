"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import BackButton from "../components/back-button/back-button";

interface Tag {
  id?: number;
  tag: string;
  unidade: string;
  local: string;
}

export default function ListaTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState<Partial<Tag>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    const response = await axios.get("/api/listar-tags");
    setTags(response.data);
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir esta TAG?")) return;
    await axios.delete(`/api/excluir-tag?id=${id}`);
    fetchTags();
  }

  async function salvarEdicao() {
    if (!editingId) return;
    await axios.put(`/api/editar-tag?id=${editingId}`, formEdit);
    setEditingId(null);
    fetchTags();
  }

  async function salvarNovaTag() {
    await axios.post("/api/criar-tag", formEdit);
    setShowCreateModal(false);
    setFormEdit({});
    fetchTags();
  }

  function abrirEdicao(tag: Tag) {
    setFormEdit(tag);
    setEditingId(tag.id!);
  }

  function handleInputChange(field: keyof Tag, value: string) {
    setFormEdit((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="flex flex-col pl-[9%] pr-[10%] min-h-screen bg-gray-200 p-4">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <BackButton />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-6">Tags Cadastradas</h1>
          <button
            onClick={() => {
              setFormEdit({ tag: "", unidade: "", local: "" });
              setShowCreateModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> Cadastrar TAG
          </button>
        </div>

        <table className="w-full text-sm border shadow-sm">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="border p-2">Código</th>
              <th className="border p-2">Unidade</th>
              <th className="border p-2">Local</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-t">
                <td className="border p-2">{tag.tag}</td>
                <td className="border p-2">{tag.unidade}</td>
                <td className="border p-2">{tag.local}</td>
                <td className="border p-2 flex gap-2">
                  <button onClick={() => abrirEdicao(tag)} className="text-blue-600">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(tag.id!)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(editingId || showCreateModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? `Editar Tag` : "Nova Tag"}
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  editingId ? await salvarEdicao() : await salvarNovaTag();
                }}
                className="space-y-3"
              >
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.tag || ""}
                  onChange={(e) => handleInputChange("tag", e.target.value)}
                  placeholder="Código da TAG"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.unidade || ""}
                  onChange={(e) => handleInputChange("unidade", e.target.value)}
                  placeholder="Unidade"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={formEdit.local || ""}
                  onChange={(e) => handleInputChange("local", e.target.value)}
                  placeholder="Local"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setShowCreateModal(false);
                    }}
                    className="border px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
