import {
  IUsuario,
  buscarUsuarioPorEmail,
  criarUsuario,
  listarUsuarios,
} from "../models/usuarioModel";

// Valida credenciais e autentica o usuário
export async function autenticarUsuario(
  email: string,
  senha?: string
): Promise<{ sucesso: boolean; mensagem: string; usuario?: Omit<IUsuario, "senha"> }> {
  if (!email || !senha) {
    return { sucesso: false, mensagem: "Email e senha são obrigatórios." };
  }
  const usuario = await buscarUsuarioPorEmail(email.trim().toLowerCase());
  if (!usuario || usuario.senha !== senha) {
    return { sucesso: false, mensagem: "Credenciais inválidas. Verifique os dados." };
  }
  const { senha: _, ...dadosSemSenha } = usuario;
  return { sucesso: true, mensagem: "Login efetuado com sucesso!", usuario: dadosSemSenha };
}

// Controller para criação de novo operador ou gestor (UC7)
export async function criarOperadorController(
  dados: Omit<IUsuario, "_id">,
  perfilSolicitante: string
): Promise<{ sucesso: boolean; mensagem: string; id?: string }> {
  if (perfilSolicitante !== "Gestor") {
    return { sucesso: false, mensagem: "Apenas Gestores podem registrar novos operadores." };
  }
  if (!dados.nome || !dados.email || !dados.senha) {
    return { sucesso: false, mensagem: "Preencha todos os campos obrigatórios." };
  }
  const usuarioExistente = await buscarUsuarioPorEmail(dados.email.trim().toLowerCase());
  if (usuarioExistente) {
    return { sucesso: false, mensagem: "Já existe um usuário cadastrado com este e-mail." };
  }
  const novoId = await criarUsuario({
    nome: dados.nome.trim(),
    email: dados.email.trim().toLowerCase(),
    senha: dados.senha,
    tipo: dados.tipo === "Gestor" ? "Gestor" : "Operador",
  });
  return { sucesso: true, mensagem: "Usuário cadastrado com sucesso!", id: novoId };
}

// Controller para listar usuários registrados
export async function listarUsuariosController(): Promise<Omit<IUsuario, "senha">[]> {
  return await listarUsuarios();
}
