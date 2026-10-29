"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Interface para as propriedades da barra de navegação
interface NavbarProps {
  usuario: { nome: string; email: string; tipo: string } | null;
}

// Renderiza a marca e logotipo do Almoxarifado
function NavBrand() {
  return (
    <Link href="/dashboard" className="navbar-marca">
      <div className="navbar-logo-icone">AL</div>
      <div>
        <h1>Almoxarifado LTDA</h1>
      </div>
    </Link>
  );
}

// Renderiza os dados do usuário e botão de logout
function UserSection({ usuario, onLogout }: { usuario: NavbarProps["usuario"]; onLogout: () => void }) {
  if (!usuario) return null;
  const classeBadge = usuario.tipo === "Gestor" ? "badge-gestor" : "badge-operador";
  return (
    <div className="navbar-usuario-info">
      <span style={{ fontSize: "0.9rem" }}>Olá, <strong>{usuario.nome}</strong></span>
      <span className={`badge-perfil ${classeBadge}`}>{usuario.tipo}</span>
      <button onClick={onLogout} className="btn-sair">Sair</button>
    </div>
  );
}

// Lista de rotas disponíveis por perfil de usuário
function obterRotasPermitidas(tipo?: string) {
  const rotas = [
    { href: "/dashboard", label: "📊 Dashboard" },
    { href: "/exibirProdutos", label: "📦 Estoque" },
    { href: "/cadastroMovimentacao", label: "🔄 Movimentação" },
    { href: "/exibirMovimentacao", label: "📜 Histórico" },
  ];
  if (tipo === "Gestor") {
    rotas.splice(2, 0, { href: "/cadastroProdutos", label: "➕ Novo Produto" });
    rotas.push({ href: "/criarContaOperador", label: "👥 Equipe" });
  }
  return rotas;
}

// Renderiza o menu de navegação de links
function NavLinksMenu({ rotas, pathname }: { rotas: { href: string; label: string }[]; pathname: string }) {
  return (
    <nav className="navbar-menu">
      <div className="navbar-links">
        {rotas.map((r) => (
          <Link key={r.href} href={r.href} className={`navbar-link ${pathname === r.href ? "ativo" : ""}`}>
            {r.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// Barra de navegação principal da aplicação
export function Navbar({ usuario }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const rotas = obterRotasPermitidas(usuario?.tipo);
  const handleLogout = () => {
    localStorage.removeItem("usuario_almoxarifado");
    router.push("/login");
  };

  return (
    <header className="navbar-header">
      <div className="navbar-topo">
        <NavBrand />
        <UserSection usuario={usuario} onLogout={handleLogout} />
      </div>
      {usuario && <NavLinksMenu rotas={rotas} pathname={pathname} />}
    </header>
  );
}
