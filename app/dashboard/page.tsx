"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/views/useAuth";
import { Navbar } from "../lib/views/Navbar";
import { StatCards } from "../lib/views/StatCards";
import { IEstatisticasDashboard, IProdutoMovimentado } from "../lib/controllers/dashboardController";

// Carrega as métricas atualizadas do dashboard
async function carregarEstatisticas(): Promise<IEstatisticasDashboard | null> {
  const resposta = await fetch("/api/dashboard");
  const dados = await resposta.json();
  return dados.sucesso ? dados.estatisticas : null;
}

// Renderiza uma linha do ranking de produtos mais movimentados
function LinhaRanking({ item, posicao, maxMov }: { item: IProdutoMovimentado; posicao: number; maxMov: number }) {
  const porcentagem = maxMov > 0 ? Math.round((item.totalMovimentacoes / maxMov) * 100) : 0;
  return (
    <tr>
      <td><span className="badge-ranking">{posicao}º</span></td>
      <td><strong>{item.nomeProduto}</strong></td>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{item.totalMovimentacoes}x</span>
          <div className="barra-progresso"><div className="barra-progresso-preenchimento" style={{ width: `${porcentagem}%` }} /></div>
        </div>
      </td>
      <td>{item.totalQtdMovimentada} un.</td>
      <td><span className={item.estoqueAtual <= 5 ? "alerta-estoque-baixo" : ""}>{item.estoqueAtual} un.</span></td>
    </tr>
  );
}

// Corpo da tabela de ranking
function CorpoRanking({ lista, maxMov }: { lista: IProdutoMovimentado[]; maxMov: number }) {
  if (lista.length === 0) {
    return <tbody><tr><td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>Sem movimentações.</td></tr></tbody>;
  }
  return (
    <tbody>
      {lista.map((item, idx) => <LinhaRanking key={item.idProduto} item={item} posicao={idx + 1} maxMov={maxMov} />)}
    </tbody>
  );
}

// Tabela de itens com mais movimentações
function TabelaMaisMovimentados({ lista }: { lista: IProdutoMovimentado[] }) {
  const maxMov = lista.length > 0 ? Math.max(...lista.map((i) => i.totalMovimentacoes)) : 1;
  return (
    <div className="painel-principal" style={{ marginTop: "24px" }}>
      <h3 className="painel-titulo" style={{ fontSize: "1.2rem", marginBottom: "6px" }}>🔥 Itens Movimentados Mais Vezes</h3>
      <p className="painel-subtitulo" style={{ marginBottom: "16px" }}>Produtos com maior frequência de movimentação no almoxarifado</p>
      <div className="tabela-container">
        <table className="tabela-dados">
          <thead><tr><th>Rank</th><th>Produto</th><th>Frequência</th><th>Qtd. Total</th><th>Estoque Atual</th></tr></thead>
          <CorpoRanking lista={lista} maxMov={maxMov} />
        </table>
      </div>
    </div>
  );
}

// Página de Dashboard de Estatísticas (RN-05 / Painel Executivo)
export default function DashboardPage() {
  const { usuario, carregando } = useAuth();
  const [stats, setStats] = useState<IEstatisticasDashboard | null>(null);

  useEffect(() => {
    if (usuario) carregarEstatisticas().then(setStats);
  }, [usuario]);

  if (carregando) return null;
  return (
    <>
      <Navbar usuario={usuario} />
      <main className="app-container">
        <div className="painel-cabecalho" style={{ marginBottom: "20px" }}>
          <div>
            <h2 className="painel-titulo">Painel de Indicadores do Almoxarifado</h2>
            <p className="painel-subtitulo">Visão consolidada de valor em estoque, volume de itens e produtos com maior giro</p>
          </div>
        </div>
        <StatCards stats={stats} />
        <TabelaMaisMovimentados lista={stats?.produtosMaisMovimentados || []} />
      </main>
    </>
  );
}
