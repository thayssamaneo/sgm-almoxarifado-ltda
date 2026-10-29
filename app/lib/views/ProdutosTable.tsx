"use client";

import { useState } from "react";
import { IProduto } from "../models/produtoModel";

// Propriedades do componente de tabela de produtos
interface ProdutosTableProps {
  produtos: IProduto[];
  perfilUsuario?: string;
  aoExcluir: (id: string, nome: string) => void;
}

// Renderiza as colunas de dados do produto
function ColunasProduto({ produto }: { produto: IProduto }) {
  const estoqueBaixo = Number(produto.quantidade) <= 5;
  const precoFormatado = Number(produto.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return (
    <>
      <td><strong>{produto.nomeProduto}</strong></td>
      <td><span className="badge-categoria">{produto.categoria}</span></td>
      <td>{produto.quantidade}{estoqueBaixo && <span className="alerta-estoque-baixo">Estoque Baixo</span>}</td>
      <td>{precoFormatado}</td>
    </>
  );
}

// Renderiza uma linha individual da tabela de produtos
function ProdutoLinha({
  produto,
  perfil,
  onExcluir,
}: {
  produto: IProduto;
  perfil?: string;
  onExcluir: (id: string, nome: string) => void;
}) {
  return (
    <tr>
      <ColunasProduto produto={produto} />
      {perfil === "Gestor" && (
        <td>
          <button onClick={() => onExcluir(produto._id!.toString(), produto.nomeProduto)} className="btn-excluir">
            Excluir
          </button>
        </td>
      )}
    </tr>
  );
}

// Filtra produtos de acordo com o termo de busca
function filtrarListaProdutos(lista: IProduto[], busca: string) {
  const termo = busca.toLowerCase();
  return lista.filter(
    (p) => p.nomeProduto.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
  );
}

// Renderiza o corpo da tabela com lista ou mensagem vazia
function CorpoTabela({
  produtos,
  perfil,
  onExcluir,
}: {
  produtos: IProduto[];
  perfil?: string;
  onExcluir: (id: string, nome: string) => void;
}) {
  if (produtos.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={perfil === "Gestor" ? 5 : 4} style={{ textAlign: "center", color: "#64748b" }}>
            Nenhum produto encontrado.
          </td>
        </tr>
      </tbody>
    );
  }
  return (
    <tbody>
      {produtos.map((p) => (
        <ProdutoLinha key={p._id?.toString()} produto={p} perfil={perfil} onExcluir={onExcluir} />
      ))}
    </tbody>
  );
}

// Cabeçalho da tabela de produtos
function CabecalhoTabela({ perfil }: { perfil?: string }) {
  return (
    <thead>
      <tr>
        <th>Produto</th>
        <th>Categoria</th>
        <th>Quantidade</th>
        <th>Preço Unitário</th>
        {perfil === "Gestor" && <th>Ações</th>}
      </tr>
    </thead>
  );
}

// Tabela dinâmica de produtos do almoxarifado (RF-02)
export function ProdutosTable({ produtos, perfilUsuario, aoExcluir }: ProdutosTableProps) {
  const [busca, setBusca] = useState("");
  const filtrados = filtrarListaProdutos(produtos, busca);
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar produto por nome ou categoria..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input-controle"
        style={{ marginBottom: "16px" }}
      />
      <div className="tabela-container">
        <table className="tabela-dados">
          <CabecalhoTabela perfil={perfilUsuario} />
          <CorpoTabela produtos={filtrados} perfil={perfilUsuario} onExcluir={aoExcluir} />
        </table>
      </div>
    </div>
  );
}
