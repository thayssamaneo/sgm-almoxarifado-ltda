import { NextResponse } from "next/server";
import {
  listarUsuariosController,
  criarOperadorController,
} from "@/app/lib/controllers/usuarioController";

// Rota GET para listar os usuários do sistema
export async function GET() {
  try {
    const usuarios = await listarUsuariosController();
    return NextResponse.json({ sucesso: true, usuarios });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao listar usuários." }, { status: 500 });
  }
}

// Rota POST para criar novo operador (UC7)
export async function POST(request: Request) {
  try {
    const { perfilSolicitante, ...dados } = await request.json();
    const resultado = await criarOperadorController(dados, perfilSolicitante);
    const status = resultado.sucesso ? 201 : 400;
    return NextResponse.json(resultado, { status });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao criar operador." }, { status: 500 });
  }
}
