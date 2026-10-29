"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Interface para usuário na sessão do cliente
export interface UsuarioSessao {
  _id?: string;
  nome: string;
  email: string;
  tipo: "Gestor" | "Operador";
}

// Obtém o usuário armazenado no localStorage
function lerUsuarioDoStorage(): UsuarioSessao | null {
  if (typeof window === "undefined") return null;
  const salvo = localStorage.getItem("usuario_almoxarifado");
  return salvo ? JSON.parse(salvo) : null;
}

// Hook para gerenciar e proteger o acesso às páginas do almoxarifado
export function useAuth(exigirAuth = true, exigirGestor = false) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const user = lerUsuarioDoStorage();
    if (exigirAuth && !user) {
      router.push("/login");
      return;
    }
    if (exigirGestor && user?.tipo !== "Gestor") {
      router.push("/dashboard");
      return;
    }
    setUsuario(user);
    setCarregando(false);
  }, [exigirAuth, exigirGestor, router]);

  return { usuario, carregando };
}
