import { NextResponse } from "next/server";
import { autenticarUsuario } from "@/app/lib/controllers/usuarioController";

// Rota POST para login e autenticação de usuários
export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();
    const resultado = await autenticarUsuario(email, senha);
    if (!resultado.sucesso) {
      return NextResponse.json(resultado, { status: 401 });
    }
    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro interno no servidor ao tentar login." },
      { status: 500 }
    );
  }
}
