"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/views/useAuth";
import { Navbar } from "../lib/views/Navbar";
import { MovimentacoesTable } from "../lib/views/MovimentacoesTable";
import { IMovimentacao } from "../lib/models/movimentacaoModel";

// Busca o histórico de movimentações da API
async function carregarHistorico() {
  const resposta = await fetch("/api/movimentacoes");
  const dados = await resposta.json();
  return dados.sucesso ? dados.movimentacoes : [];
}

// Cabeçalho da página de histórico de movimentações
function CabecalhoMovimentacao() {
  return (
    <div className="painel-cabecalho">
      <div>
        <h2 className="painel-titulo">Histórico de Movimentações</h2>
        <p className="painel-subtitulo">Rastreabilidade completa de entradas e vendas realizadas (RF-05)</p>
      </div>
    </div>
  );
}

// Página exibirMovimentacao.js para histórico de movimentações (RF-05 / UC6)
export default function ExibirMovimentacaoPage() {
  const { usuario, carregando } = useAuth();
  const [movimentacoes, setMovimentacoes] = useState<IMovimentacao[]>([]);

  useEffect(() => {
    if (usuario) carregarHistorico().then(setMovimentacoes);
  }, [usuario]);

  if (carregando) return null;

  return (
    <>
      <Navbar usuario={usuario} />
      <main className="app-container">
        <div className="painel-principal">
          <CabecalhoMovimentacao />
          <MovimentacoesTable movimentacoes={movimentacoes} />
        </div>
      </main>
    </>
  );
}
