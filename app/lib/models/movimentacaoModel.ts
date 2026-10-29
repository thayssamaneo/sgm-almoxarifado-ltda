import { ObjectId } from "mongodb";
import { obterConexao } from "./db";

// Interface para o documento de Movimentação no MongoDB
export interface IMovimentacao {
  _id?: string | ObjectId;
  idProduto: string;
  nomeProduto?: string;
  idUsuario: string;
  nomeUsuario?: string;
  dateTime: string;
  tipo: "Entrada" | "Saída";
  quantidade: number;
}

// Obtém a coleção de movimentações
async function getColecaoMovimentacoes() {
  const db = await obterConexao();
  return db.collection<IMovimentacao>("movimentacoes");
}

// Registra uma nova movimentação no banco de dados (RF-04)
export async function registrarMovimentacaoNoBanco(
  dados: Omit<IMovimentacao, "_id">
): Promise<string> {
  const colecao = await getColecaoMovimentacoes();
  const resultado = await colecao.insertOne(dados as IMovimentacao);
  return resultado.insertedId.toString();
}

// Lista todas as movimentações ordenadas pela data mais recente (RF-05)
export async function listarMovimentacoesDoBanco(): Promise<IMovimentacao[]> {
  const colecao = await getColecaoMovimentacoes();
  const lista = await colecao.find().sort({ dateTime: -1 }).toArray();
  return lista.map((m) => ({ ...m, _id: m._id.toString() }));
}
