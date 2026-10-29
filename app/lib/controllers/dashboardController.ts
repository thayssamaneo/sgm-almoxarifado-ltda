import { listarProdutos, IProduto } from "../models/produtoModel";
import { listarMovimentacoesDoBanco, IMovimentacao } from "../models/movimentacaoModel";

// Interface para os dados do produto mais movimentado
export interface IProdutoMovimentado {
  idProduto: string;
  nomeProduto: string;
  totalMovimentacoes: number;
  totalQtdMovimentada: number;
  estoqueAtual: number;
}

// Interface para as estatísticas consolidadas do dashboard
export interface IEstatisticasDashboard {
  valorTotalEstoque: number;
  totalItensEstoque: number;
  totalProdutos: number;
  totalMovimentacoes: number;
  itensEstoqueBaixo: number;
  produtosMaisMovimentados: IProdutoMovimentado[];
}

// Calcula os totais financeiros e quantitativos de produtos
function calcularMetricasEstoque(produtos: IProduto[]) {
  const totalItens = produtos.reduce((soma, p) => soma + (Number(p.quantidade) || 0), 0);
  const valorTotal = produtos.reduce((soma, p) => soma + (Number(p.preco) || 0) * (Number(p.quantidade) || 0), 0);
  const estoqueBaixo = produtos.filter((p) => Number(p.quantidade) <= 5).length;
  return { totalItens, valorTotal, estoqueBaixo };
}

// Agrupa e conta as movimentações por produto
function agruparMovimentacoesPorProduto(movimentacoes: IMovimentacao[]) {
  const mapa = new Map<string, { nome: string; transacoes: number; qtd: number }>();
  for (const m of movimentacoes) {
    const atual = mapa.get(m.idProduto) || { nome: m.nomeProduto || m.idProduto, transacoes: 0, qtd: 0 };
    atual.transacoes += 1;
    atual.qtd += Number(m.quantidade) || 0;
    mapa.set(m.idProduto, atual);
  }
  return mapa;
}

// Gera o ranking dos itens mais movimentados
function gerarRankingMaisMovimentados(produtos: IProduto[], movimentacoes: IMovimentacao[]): IProdutoMovimentado[] {
  const mapa = agruparMovimentacoesPorProduto(movimentacoes);
  const lista: IProdutoMovimentado[] = [];
  mapa.forEach((val, id) => {
    const prod = produtos.find((p) => p._id?.toString() === id);
    lista.push({
      idProduto: id,
      nomeProduto: prod?.nomeProduto || val.nome,
      totalMovimentacoes: val.transacoes,
      totalQtdMovimentada: val.qtd,
      estoqueAtual: prod ? Number(prod.quantidade) : 0,
    });
  });
  return lista.sort((a, b) => b.totalMovimentacoes - a.totalMovimentacoes).slice(0, 5);
}

// Controller principal para obter as estatísticas do dashboard (RN-05)
export async function obterEstatisticasDashboard(): Promise<IEstatisticasDashboard> {
  const produtos = await listarProdutos();
  const movimentacoes = await listarMovimentacoesDoBanco();
  const { totalItens, valorTotal, estoqueBaixo } = calcularMetricasEstoque(produtos);
  const maisMovimentados = gerarRankingMaisMovimentados(produtos, movimentacoes);
  return {
    valorTotalEstoque: valorTotal,
    totalItensEstoque: totalItens,
    totalProdutos: produtos.length,
    totalMovimentacoes: movimentacoes.length,
    itensEstoqueBaixo: estoqueBaixo,
    produtosMaisMovimentados: maisMovimentados,
  };
}
