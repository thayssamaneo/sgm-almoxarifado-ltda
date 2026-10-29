import {
  IProduto,
  listarProdutos,
  criarProduto,
  excluirProduto,
  buscarProdutoPorId,
} from "../models/produtoModel";

// Valida as regras de negócio para criação de produto
export function validarDadosProduto(dados: Partial<IProduto>): string | null {
  if (!dados.nomeProduto || dados.nomeProduto.trim().length === 0) {
    return "O nome do produto é obrigatório.";
  }
  if (!dados.categoria || dados.categoria.trim().length === 0) {
    return "A categoria do produto é obrigatória.";
  }
  if (dados.preco === undefined || Number(dados.preco) <= 0) {
    return "RN-01: O preço deve ser maior que R$ 0,00.";
  }
  if (dados.quantidade === undefined || Number(dados.quantidade) < 0) {
    return "RN-02: A quantidade não pode ser negativa.";
  }
  return null;
}

// Controller para listar todos os produtos cadastrados (RF-02)
export async function obterListaDeProdutos(): Promise<IProduto[]> {
  return await listarProdutos();
}

// Controller para adicionar um novo produto (RF-01 / UC1)
export async function adicionarProdutoController(
  dados: Omit<IProduto, "_id">,
  perfilUsuario: string
): Promise<{ sucesso: boolean; mensagem: string; id?: string }> {
  if (perfilUsuario !== "Gestor") {
    return { sucesso: false, mensagem: "Apenas Gestores podem registrar novos produtos." };
  }
  const erroValidacao = validarDadosProduto(dados);
  if (erroValidacao) {
    return { sucesso: false, mensagem: erroValidacao };
  }
  const novoId = await criarProduto({
    nomeProduto: dados.nomeProduto.trim(),
    categoria: dados.categoria.trim(),
    quantidade: Number(dados.quantidade),
    preco: Number(dados.preco),
  });
  return { sucesso: true, mensagem: "Produto cadastrado com sucesso!", id: novoId };
}

// Controller para exclusão segura de produto (RF-03 / UC4)
export async function excluirProdutoController(
  id: string,
  perfilUsuario: string
): Promise<{ sucesso: boolean; mensagem: string }> {
  if (perfilUsuario !== "Gestor") {
    return { sucesso: false, mensagem: "Apenas Gestores podem excluir produtos." };
  }
  const produtoExistente = await buscarProdutoPorId(id);
  if (!produtoExistente) {
    return { sucesso: false, mensagem: "Produto não encontrado para exclusão." };
  }
  const excluido = await excluirProduto(id);
  if (!excluido) {
    return { sucesso: false, mensagem: "Falha ao excluir o produto do banco." };
  }
  return { sucesso: true, mensagem: "Produto removido com segurança!" };
}
