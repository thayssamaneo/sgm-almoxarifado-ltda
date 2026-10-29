"use client";

import { IEstatisticasDashboard } from "../controllers/dashboardController";

// Propriedades do componente StatCards
interface StatCardsProps {
  stats: IEstatisticasDashboard | null;
}

// Formata valores numéricos para moeda BRL
function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Card individual para renderizar uma métrica específica
function StatCardItem({ titulo, valor, icone, fundoIcone, corTexto }: any) {
  return (
    <div className="card-estatistica">
      <div className="icone-estatistica" style={{ backgroundColor: fundoIcone }}>
        {icone}
      </div>
      <div className="estatistica-info">
        <h3>{titulo}</h3>
        <p style={{ color: corTexto }}>{valor}</p>
      </div>
    </div>
  );
}

// Renderiza a grade de estatísticas do estoque (RN-05)
export function StatCards({ stats }: StatCardsProps) {
  if (!stats) return null;
  const valorEstoque = formatarMoeda(stats.valorTotalEstoque || 0);

  return (
    <div className="grid-estatisticas">
      <StatCardItem titulo="Valor Total em Estoque" valor={valorEstoque} icone="💰" fundoIcone="#eff6ff" corTexto="#1d4ed8" />
      <StatCardItem titulo="Itens em Estoque" valor={`${stats.totalItensEstoque} un.`} icone="📦" fundoIcone="#f0fdf4" corTexto="#047857" />
      <StatCardItem titulo="Total de Produtos" valor={stats.totalProdutos} icone="🏷️" fundoIcone="#faf5ff" />
      <StatCardItem titulo="Movimentações" valor={stats.totalMovimentacoes} icone="🔄" fundoIcone="#f8fafc" />
      <StatCardItem titulo="Estoque Baixo (<= 5)" valor={stats.itensEstoqueBaixo} icone="⚠️" fundoIcone="#fffbeb" corTexto="#b45309" />
    </div>
  );
}
