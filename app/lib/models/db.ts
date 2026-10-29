import { MongoClient, Db } from "mongodb";

// URI de conexão padrão com o MongoDB local
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "almoxarifado_db";

// Cliente singleton para reaproveitamento de conexão
let clienteMongo: MongoClient | null = null;
let bancoDados: Db | null = null;

// Função para obter a conexão ativa com o MongoDB
export async function obterConexao(): Promise<Db> {
  if (!clienteMongo) {
    clienteMongo = new MongoClient(MONGO_URI);
    await clienteMongo.connect();
    bancoDados = clienteMongo.db(DATABASE_NAME);
    await inicializarColecoes(bancoDados);
  }
  return bancoDados!;
}

// Inicializa dados padrão caso o banco esteja vazio
async function inicializarColecoes(db: Db): Promise<void> {
  const contagemUsuarios = await db.collection("usuarios").countDocuments();
  if (contagemUsuarios === 0) {
    await semearUsuariosPadrao(db);
    await semearProdutosPadrao(db);
  }
}

// Usuários padrão para autenticação no almoxarifado
const USUARIOS_INICIAIS = [
  { nome: "Gestor Principal", email: "gestor@almoxarifado.com", senha: "123", tipo: "Gestor" },
  { nome: "Operador de Estoque", email: "operador@almoxarifado.com", senha: "123", tipo: "Operador" },
];

// Cria os usuários iniciais para Gestor e Operador
async function semearUsuariosPadrao(db: Db): Promise<void> {
  await db.collection("usuarios").insertMany(USUARIOS_INICIAIS);
}

// Lista de produtos iniciais para o estoque
const PRODUTOS_INICIAIS = [
  { nomeProduto: "Furadeira de Impacto", categoria: "Ferramentas", quantidade: 15, preco: 289.9 },
  { nomeProduto: "Chave Inglesa 10 pol", categoria: "Ferramentas", quantidade: 4, preco: 45.5 },
  { nomeProduto: "Capacete de Segurança EPI", categoria: "Segurança", quantidade: 30, preco: 32.0 },
];

// Insere produtos iniciais no almoxarifado
async function semearProdutosPadrao(db: Db): Promise<void> {
  await db.collection("produtos").insertMany(PRODUTOS_INICIAIS);
}
