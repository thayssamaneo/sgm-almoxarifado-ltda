import { NextResponse } from "next/server";
import {
  obterListaDeProdutos,
  adicionarProdutoController,
} from "@/app/lib/controllers/produtoController";

// Rota GET para listar os produtos cadastrados (RF-02)
export async function GET() {
  try {
    const produtos = await obterListaDeProdutos();
    return NextResponse.json({ sucesso: true, produtos });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao buscar produtos." }, { status: 500 });
  }
}

// Rota POST para cadastrar um novo produto (RF-01)
export async function POST(request: Request) {
  try {
    const corpo = await request.json();
    const { perfilUsuario, ...dadosProduto } = corpo;
    const resultado = await adicionarProdutoController(dadosProduto, perfilUsuario);
    const status = resultado.sucesso ? 201 : 400;
    return NextResponse.json(resultado, { status });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao cadastrar produto." }, { status: 500 });
  }
}
