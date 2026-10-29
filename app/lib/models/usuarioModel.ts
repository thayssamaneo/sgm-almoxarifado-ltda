import { ObjectId } from "mongodb";
import { obterConexao } from "./db";

// Interface para o documento de Usuário
export interface IUsuario {
  _id?: string | ObjectId;
  nome: string;
  email: string;
  senha?: string;
  tipo: "Gestor" | "Operador";
}

// Obtém a coleção de usuários do banco
async function getColecaoUsuarios() {
  const db = await obterConexao();
  return db.collection<IUsuario>("usuarios");
}

// Busca usuário por email cadastrado
export async function buscarUsuarioPorEmail(email: string): Promise<IUsuario | null> {
  const colecao = await getColecaoUsuarios();
  const usuario = await colecao.findOne({ email });
  if (!usuario) return null;
  return { ...usuario, _id: usuario._id.toString() };
}

// Busca usuário pelo ID
export async function buscarUsuarioPorId(id: string): Promise<IUsuario | null> {
  const colecao = await getColecaoUsuarios();
  const usuario = await colecao.findOne({ _id: new ObjectId(id) as unknown as ObjectId });
  if (!usuario) return null;
  return { ...usuario, _id: usuario._id.toString() };
}

// Cria um novo usuário (Operador ou Gestor)
export async function criarUsuario(dados: Omit<IUsuario, "_id">): Promise<string> {
  const colecao = await getColecaoUsuarios();
  const resultado = await colecao.insertOne(dados as IUsuario);
  return resultado.insertedId.toString();
}

// Lista todos os usuários sem expor as senhas
export async function listarUsuarios(): Promise<Omit<IUsuario, "senha">[]> {
  const colecao = await getColecaoUsuarios();
  const usuarios = await colecao.find({}, { projection: { senha: 0 } }).toArray();
  return usuarios.map((u) => ({ ...u, _id: u._id.toString() }));
}
