import { NextResponse } from "next/server";
import { excluirProdutoController } from "@/app/lib/controllers/produtoController";

// Rota DELETE para exclusão segura de produto (RF-03)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const perfil = searchParams.get("perfil") || "";
    const resultado = await excluirProdutoController(id, perfil);
    const status = resultado.sucesso ? 200 : 403;
    return NextResponse.json(resultado, { status });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: "Erro ao excluir produto." }, { status: 500 });
  }
}
