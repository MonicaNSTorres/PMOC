"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (email === "admin@email.com" && senha === "123456") {
      localStorage.setItem("pmoc_auth", "true");
      location.href = "/pmoc-form";
      //router.push("/pmoc-form");
    } else {
      alert("Credenciais inválidas.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center">Login PMOC - AMG</h2>
        <input
          type="email"
          placeholder="E-mail"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-800 text-white font-semibold py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
