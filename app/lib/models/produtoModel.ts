import { ObjectId } from "mongodb";
import { obterConexao } from "./db";

// Interface para o documento de Produto no MongoDB
export interface IProduto {
  _id?: string | ObjectId;
  nomeProduto: string;
  categoria: string;
  quantidade: number;
  preco: number;
}

// Obtém a coleção de produtos do banco de dados
async function getColecaoProdutos() {
  const db = await obterConexao();
  return db.collection<IProduto>("produtos");
}

// Lista todos os produtos cadastrados
export async function listarProdutos(): Promise<IProduto[]> {
  const colecao = await getColecaoProdutos();
  const produtos = await colecao.find().toArray();
  return produtos.map((p) => ({ ...p, _id: p._id.toString() }));
}

// Busca um produto específico pelo seu ID
export async function buscarProdutoPorId(id: string): Promise<IProduto | null> {
  const colecao = await getColecaoProdutos();
  const produto = await colecao.findOne({ _id: new ObjectId(id) as unknown as ObjectId });
  if (!produto) return null;
  return { ...produto, _id: produto._id.toString() };
}

// Cria um novo produto no estoque
export async function criarProduto(dados: Omit<IProduto, "_id">): Promise<string> {
  const colecao = await getColecaoProdutos();
  const resultado = await colecao.insertOne(dados as IProduto);
  return resultado.insertedId.toString();
}

// Remove um produto pelo identificador único (RF-03)
export async function excluirProduto(id: string): Promise<boolean> {
  const colecao = await getColecaoProdutos();
  const resultado = await colecao.deleteOne({ _id: new ObjectId(id) as unknown as ObjectId });
  return resultado.deletedCount > 0;
}

// Atualiza a quantidade disponível de um produto
export async function atualizarEstoqueProduto(id: string, novaQuantidade: number): Promise<boolean> {
  const colecao = await getColecaoProdutos();
  const resultado = await colecao.updateOne(
    { _id: new ObjectId(id) as unknown as ObjectId },
    { $set: { quantidade: novaQuantidade } }
  );
  return resultado.modifiedCount > 0;
}
