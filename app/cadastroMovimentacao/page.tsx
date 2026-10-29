"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/views/useAuth";
import { Navbar } from "../lib/views/Navbar";
import { IProduto } from "../lib/models/produtoModel";

// Busca os produtos ativos para preencher o select
async function carregarListaProdutos() {
  const resposta = await fetch("/api/produtos");
  const dados = await resposta.json();
  return dados.sucesso ? dados.produtos : [];
}

// Envia a movimentação de estoque para a API
async function enviarMovimentacao(dados: any) {
  const resposta = await fetch("/api/movimentacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return await resposta.json();
}

// Renderiza o seletor de produtos e o estoque atual disponível
function SeletorProduto({ produtos, idProduto, onChange, estoqueAtual }: any) {
  return (
    <div className="grupo-campo">
      <label>Selecione o Produto</label>
      <select value={idProduto} onChange={(e) => onChange(e.target.value)} required className="input-controle">
        <option value="">Selecione um item do almoxarifado...</option>
        {produtos.map((p: IProduto) => (
          <option key={p._id?.toString()} value={p._id?.toString()}>
            {p.nomeProduto} - Estoque atual: {p.quantidade} un.
          </option>
        ))}
      </select>
      {estoqueAtual !== null && (
        <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block", marginTop: "4px" }}>
          Saldo atual em estoque: <strong>{estoqueAtual}</strong> unidades
        </span>
      )}
    </div>
  );
}

// Renderiza os campos de tipo e quantidade da movimentação
function CamposMovimentacao({ tipo, setTipo, quantidade, setQuantidade }: any) {
  return (
    <div className="grid-duplo">
      <div className="grupo-campo">
        <label>Tipo de Movimentação</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input-controle">
          <option value="Entrada">Entrada (Incremento)</option>
          <option value="Saída">Saída / Venda (Decremento)</option>
        </select>
      </div>
      <div className="grupo-campo">
        <label>Quantidade</label>
        <input
          type="number"
          min="1"
          required
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="input-controle"
        />
      </div>
    </div>
  );
}

// Formulário para registro de movimentações
function FormularioMovimentacao({ produtos, idProduto, setIdProduto, tipo, setTipo, qtd, setQtd, onSubmit, salvando, prodSel }: any) {
  return (
    <form onSubmit={onSubmit}>
      <SeletorProduto produtos={produtos} idProduto={idProduto} onChange={setIdProduto} estoqueAtual={prodSel?.quantidade ?? null} />
      <CamposMovimentacao tipo={tipo} setTipo={setTipo} quantidade={qtd} setQuantidade={setQtd} />
      <button type="submit" disabled={salvando} className="btn-principal" style={{ marginTop: "12px" }}>
        {salvando ? "Processando..." : "Confirmar Movimentação"}
      </button>
    </form>
  );
}

// Página cadastroMovimentacao.js para registrar entradas e saídas/vendas (RF-04 / UC5)
export default function CadastroMovimentacaoPage() {
  const router = useRouter();
  const { usuario, carregando } = useAuth();
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [idProduto, setIdProduto] = useState("");
  const [tipo, setTipo] = useState<"Entrada" | "Saída">("Saída");
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState<{ texto: string; erro: boolean } | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { carregarListaProdutos().then(setProdutos); }, []);

  const produtoSelecionado = produtos.find((p) => p._id?.toString() === idProduto);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setSalvando(true);
    const payload = { idProduto, idUsuario: usuario._id || "usr", nomeUsuario: usuario.nome, tipo, quantidade };
    const res = await enviarMovimentacao(payload);
    setMensagem({ texto: res.mensagem, erro: !res.sucesso });
    setSalvando(false);
    if (res.sucesso) setTimeout(() => router.push("/exibirMovimentacao"), 1200);
  };

  if (carregando) return null;
  return (
    <>
      <Navbar usuario={usuario} />
      <main className="app-container">
        <div className="painel-principal formulario-box">
          <h2 className="painel-titulo">Registrar Movimentação de Estoque</h2>
          <p className="painel-subtitulo" style={{ marginBottom: "20px" }}>Entrada ou saída com validação de saldo (RF-04)</p>
          {mensagem && <div className={`mensagem-feedback ${mensagem.erro ? "mensagem-erro" : "mensagem-sucesso"}`}>{mensagem.texto}</div>}
          <FormularioMovimentacao produtos={produtos} idProduto={idProduto} setIdProduto={setIdProduto} tipo={tipo} setTipo={setTipo} qtd={quantidade} setQtd={setQuantidade} onSubmit={handleSubmit} salvando={salvando} prodSel={produtoSelecionado} />
        </div>
      </main>
    </>
  );
}
