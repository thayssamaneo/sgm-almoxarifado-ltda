import { NextResponse } from "next/server";
import {
  obterHistoricoMovimentacoes,
  registrarMovimentacaoController,
} from "@/app/lib/controllers/movimentacaoController";

// Rota GET para obter histórico de movimentações (RF-05)
export async function GET() {
  try {
    const historico = await obterHistoricoMovimentacoes();
    return NextResponse.json({ sucesso: true, movimentacoes: historico });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao buscar histórico." }, { status: 500 });
  }
}

// Rota POST para registrar nova movimentação (RF-04)
export async function POST(request: Request) {
  try {
    const dados = await request.json();
    const resultado = await registrarMovimentacaoController(dados);
    const status = resultado.sucesso ? 201 : 400;
    return NextResponse.json(resultado, { status });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao registrar movimentação." }, { status: 500 });
  }
}
