import { NextResponse } from "next/server";
import { obterEstatisticasDashboard } from "@/app/lib/controllers/dashboardController";

// Rota GET para estatísticas do dashboard (RN-05)
export async function GET() {
  try {
    const estatisticas = await obterEstatisticasDashboard();
    return NextResponse.json({ sucesso: true, estatisticas });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao obter dados do dashboard." },
      { status: 500 }
    );
  }
}
