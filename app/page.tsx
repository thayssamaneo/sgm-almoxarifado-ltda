"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Página inicial que redireciona de acordo com o estado de autenticação
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario_almoxarifado");
    if (usuarioSalvo) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
