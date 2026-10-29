import {
  IMovimentacao,
  registrarMovimentacaoNoBanco,
  listarMovimentacoesDoBanco,
} from "../models/movimentacaoModel";
import { buscarProdutoPorId, atualizarEstoqueProduto } from "../models/produtoModel";

// Valida a consistência do saldo para saída ou venda (RN-02 e RN-03)
function validarEstoqueSuficiente(tipo: string, estoqueAtual: number, qtd: number): string | null {
  if (qtd <= 0) {
    return "A quantidade da movimentação deve ser maior que zero.";
  }
  if (tipo === "Saída" && qtd > estoqueAtual) {
    return `RN-03: Quantidade solicitada (${qtd}) é maior que o estoque atual (${estoqueAtual}).`;
  }
  return null;
}

// Calcula o novo saldo do estoque após a movimentação
function calcularSaldoFinal(tipo: string, estoqueAtual: number, qtd: number): number {
  return tipo === "Entrada" ? estoqueAtual + qtd : estoqueAtual - qtd;
}

// Monta o objeto de movimentação com data e hora atual
function montarObjetoMovimentacao(dados: {
  idProduto: string;
  nomeProduto: string;
  idUsuario: string;
  nomeUsuario: string;
  tipo: "Entrada" | "Saída";
  quantidade: number;
}): Omit<IMovimentacao, "_id"> {
  return {
    ...dados,
    dateTime: new Date().toISOString(),
    quantidade: Number(dados.quantidade),
  };
}

// Registra movimentação, atualiza estoque e preserva rastreabilidade (RF-04 / RN-04)
export async function registrarMovimentacaoController(dados: {
  idProduto: string;
  idUsuario: string;
  nomeUsuario: string;
  tipo: "Entrada" | "Saída";
  quantidade: number;
}): Promise<{ sucesso: boolean; mensagem: string; id?: string }> {
  const produto = await buscarProdutoPorId(dados.idProduto);
  if (!produto) return { sucesso: false, mensagem: "Produto selecionado não existe." };
  const erroEstoque = validarEstoqueSuficiente(dados.tipo, produto.quantidade, Number(dados.quantidade));
  if (erroEstoque) return { sucesso: false, mensagem: erroEstoque };
  const novoSaldo = calcularSaldoFinal(dados.tipo, produto.quantidade, Number(dados.quantidade));
  await atualizarEstoqueProduto(dados.idProduto, novoSaldo);
  const payload = montarObjetoMovimentacao({ ...dados, nomeProduto: produto.nomeProduto });
  const novoId = await registrarMovimentacaoNoBanco(payload);
  return { sucesso: true, mensagem: "Movimentação registrada com sucesso!", id: novoId };
}

// Obtém o histórico completo de movimentações (RF-05 / UC6)
export async function obterHistoricoMovimentacoes(): Promise<IMovimentacao[]> {
  return await listarMovimentacoesDoBanco();
}
