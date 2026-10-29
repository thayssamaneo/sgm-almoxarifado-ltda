"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/views/useAuth";
import { Navbar } from "../lib/views/Navbar";

// Envia os dados do novo produto para a API
async function enviarNovoProduto(dados: any, perfil: string) {
  const resposta = await fetch("/api/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...dados, perfilUsuario: perfil }),
  });
  return await resposta.json();
}

// Renderiza os campos de texto do produto
function CamposTexto({ form, setForm }: any) {
  return (
    <>
      <div className="grupo-campo">
        <label>Nome do Produto</label>
        <input type="text" required placeholder="Ex: Alicate" value={form.nomeProduto} onChange={(e) => setForm({ ...form, nomeProduto: e.target.value })} className="input-controle" />
      </div>
      <div className="grupo-campo">
        <label>Categoria</label>
        <input type="text" required placeholder="Ex: Ferramentas" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="input-controle" />
      </div>
    </>
  );
}

// Renderiza os campos numéricos (quantidade e preço)
function CamposNumericos({ form, setForm }: any) {
  return (
    <div className="grid-duplo">
      <div className="grupo-campo">
        <label>Quantidade (RN-02: &gt;= 0)</label>
        <input type="number" min="0" required value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} className="input-controle" />
      </div>
      <div className="grupo-campo">
        <label>Preço Unitário R$ (RN-01: &gt; 0)</label>
        <input type="number" step="0.01" min="0.01" required value={form.preco} onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })} className="input-controle" />
      </div>
    </div>
  );
}

// Formulário de inserção de produto
function FormularioProduto({ form, setForm, onSubmit, salvando }: any) {
  return (
    <form onSubmit={onSubmit}>
      <CamposTexto form={form} setForm={setForm} />
      <CamposNumericos form={form} setForm={setForm} />
      <button type="submit" disabled={salvando} className="btn-principal" style={{ marginTop: "12px" }}>
        {salvando ? "Salvando..." : "Registrar Produto no Estoque"}
      </button>
    </form>
  );
}

// Página de Cadastro de Novos Produtos (cadastroProdutos.js / RF-01)
export default function CadastroProdutosPage() {
  const router = useRouter();
  const { usuario, carregando } = useAuth(true, true);
  const [form, setForm] = useState({ nomeProduto: "", categoria: "", quantidade: 0, preco: 0 });
  const [mensagem, setMensagem] = useState<{ texto: string; erro: boolean } | null>(null);
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setSalvando(true);
    const res = await enviarNovoProduto(form, usuario.tipo);
    setMensagem({ texto: res.mensagem, erro: !res.sucesso });
    setSalvando(false);
    if (res.sucesso) setTimeout(() => router.push("/exibirProdutos"), 1200);
  };

  if (carregando) return null;
  return (
    <>
      <Navbar usuario={usuario} />
      <main className="app-container">
        <div className="painel-principal formulario-box">
          <h2 className="painel-titulo">Cadastrar Novo Produto</h2>
          <p className="painel-subtitulo" style={{ marginBottom: "20px" }}>Inclusão de item ao estoque (RF-01)</p>
          {mensagem && <div className={`mensagem-feedback ${mensagem.erro ? "mensagem-erro" : "mensagem-sucesso"}`}>{mensagem.texto}</div>}
          <FormularioProduto form={form} setForm={setForm} onSubmit={handleSubmit} salvando={salvando} />
        </div>
      </main>
    </>
  );
}
