"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Cabeçalho visual do formulário de login
function CabecalhoLogin() {
  return (
    <div style={{ textAlign: "center", marginBottom: "28px" }}>
      <div className="navbar-logo-icone" style={{ margin: "0 auto 12px", width: "54px", height: "54px", fontSize: "1.5rem" }}>
        AL
      </div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>Almoxarifado LTDA</h2>
      <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px" }}>
        Sistema de Gerenciamento Interno de Estoque
      </p>
    </div>
  );
}

// Botões para preenchimento rápido em testes
function BotoesAcessoRapido({ onPreencher }: { onPreencher: (email: string, pass: string) => void }) {
  return (
    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
      <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "8px", textAlign: "center" }}>Contas de demonstração:</p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button type="button" onClick={() => onPreencher("gestor@almoxarifado.com", "123")} className="btn-sair" style={{ color: "#2563eb" }}>Gestor</button>
        <button type="button" onClick={() => onPreencher("operador@almoxarifado.com", "123")} className="btn-sair" style={{ color: "#475569" }}>Operador</button>
      </div>
    </div>
  );
}

// Submete as credenciais para autenticação na API
async function enviarLogin(email: string, senha: string) {
  const resposta = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return await resposta.json();
}

// Campos de entrada do formulário de login
function CamposLogin({ email, setEmail, senha, setSenha, enviando }: any) {
  return (
    <>
      <div className="grupo-campo">
        <label>E-mail</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-controle" />
      </div>
      <div className="grupo-campo">
        <label>Senha</label>
        <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="input-controle" />
      </div>
      <button type="submit" disabled={enviando} className="btn-principal">
        {enviando ? "Autenticando..." : "Entrar no Sistema"}
      </button>
    </>
  );
}

// Página de Login (login.js) para Gestores e Operadores
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const res = await enviarLogin(email, senha);
    if (!res.sucesso) return (setErro(res.mensagem), setEnviando(false));
    localStorage.setItem("usuario_almoxarifado", JSON.stringify(res.usuario));
    router.push("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="painel-principal" style={{ maxWidth: "440px", width: "100%", padding: "32px" }}>
        <CabecalhoLogin />
        {erro && <div className="mensagem-feedback mensagem-erro">{erro}</div>}
        <form onSubmit={onSubmit}>
          <CamposLogin email={email} setEmail={setEmail} senha={senha} setSenha={setSenha} enviando={enviando} />
        </form>
        <BotoesAcessoRapido onPreencher={(em, ps) => { setEmail(em); setSenha(ps); }} />
      </div>
    </div>
  );
}
