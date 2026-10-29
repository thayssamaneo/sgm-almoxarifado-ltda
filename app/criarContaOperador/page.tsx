"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/views/useAuth";
import { Navbar } from "../lib/views/Navbar";
import { IUsuario } from "../lib/models/usuarioModel";

// Envia a criação do novo operador para a API
async function enviarNovoUsuario(dados: any, perfilSolicitante: string) {
  const resposta = await fetch("/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...dados, perfilSolicitante }),
  });
  return await resposta.json();
}

// Busca a lista de usuários registrados
async function carregarUsuarios() {
  const resposta = await fetch("/api/usuarios");
  const dados = await resposta.json();
  return dados.sucesso ? dados.usuarios : [];
}

// Renderiza os campos de credenciais
function CamposCredenciais({ form, setForm }: any) {
  return (
    <div className="grid-duplo">
      <div className="grupo-campo">
        <label>E-mail</label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-controle" />
      </div>
      <div className="grupo-campo">
        <label>Senha</label>
        <input type="password" required value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} className="input-controle" />
      </div>
    </div>
  );
}

// Formulário de criação de conta
function FormCamposConta({ form, setForm, onSubmit, salvando }: any) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grupo-campo">
        <label>Nome Completo</label>
        <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="input-controle" />
      </div>
      <CamposCredenciais form={form} setForm={setForm} />
      <div className="grupo-campo">
        <label>Cargo</label>
        <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="input-controle">
          <option value="Operador">Operador (Movimentação e consulta)</option>
          <option value="Gestor">Gestor (Controle total)</option>
        </select>
      </div>
      <button type="submit" disabled={salvando} className="btn-principal" style={{ marginTop: "12px" }}>
        {salvando ? "Criando Conta..." : "Cadastrar Usuário"}
      </button>
    </form>
  );
}

// Renderiza a linha individual de usuário
function LinhaUsuario({ u }: { u: Omit<IUsuario, "senha"> }) {
  const badgeClasse = u.tipo === "Gestor" ? "badge-gestor" : "badge-operador";
  return (
    <tr>
      <td><strong>{u.nome}</strong></td>
      <td>{u.email}</td>
      <td><span className={`badge-perfil ${badgeClasse}`}>{u.tipo}</span></td>
    </tr>
  );
}

// Lista dos usuários cadastrados no almoxarifado
function ListaUsuariosCadastrados({ lista }: { lista: Omit<IUsuario, "senha">[] }) {
  return (
    <div style={{ marginTop: "32px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
      <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "#0f172a" }}>Equipe Cadastrada</h3>
      <div className="tabela-container">
        <table className="tabela-dados">
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Cargo</th></tr>
          </thead>
          <tbody>
            {lista.map((u) => <LinhaUsuario key={u._id?.toString()} u={u} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Página criarContaOperador.js para Gestor criar novos Operadores (UC7)
export default function CriarContaOperadorPage() {
  const { usuario, carregando } = useAuth(true, true);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", tipo: "Operador" });
  const [usuarios, setUsuarios] = useState<Omit<IUsuario, "senha">[]>([]);
  const [mensagem, setMensagem] = useState<{ texto: string; erro: boolean } | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { carregarUsuarios().then(setUsuarios); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setSalvando(true);
    const res = await enviarNovoUsuario(form, usuario.tipo);
    setMensagem({ texto: res.mensagem, erro: !res.sucesso });
    setSalvando(false);
    if (res.sucesso) {
      setForm({ nome: "", email: "", senha: "", tipo: "Operador" });
      carregarUsuarios().then(setUsuarios);
    }
  };

  if (carregando) return null;
  return (
    <>
      <Navbar usuario={usuario} />
      <main className="app-container">
        <div className="painel-principal formulario-box" style={{ maxWidth: "700px" }}>
          <h2 className="painel-titulo">Criar Conta de Operador / Gestor</h2>
          <p className="painel-subtitulo" style={{ marginBottom: "20px" }}>Gestão de acesso da equipe do Almoxarifado (UC7)</p>
          {mensagem && <div className={`mensagem-feedback ${mensagem.erro ? "mensagem-erro" : "mensagem-sucesso"}`}>{mensagem.texto}</div>}
          <FormCamposConta form={form} setForm={setForm} onSubmit={handleSubmit} salvando={salvando} />
          <ListaUsuariosCadastrados lista={usuarios} />
        </div>
      </main>
    </>
  );
}
