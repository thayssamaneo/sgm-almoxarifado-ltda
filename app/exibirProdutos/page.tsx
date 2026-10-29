"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/views/useAuth";
import { Navbar } from "../lib/views/Navbar";
import { StatCards } from "../lib/views/StatCards";
import { ProdutosTable } from "../lib/views/ProdutosTable";
import { ConfirmModal } from "../lib/views/ConfirmModal";
import { IProduto } from "../lib/models/produtoModel";
import { IEstatisticasDashboard } from "../lib/controllers/dashboardController";

// Busca os produtos e as estatísticas da API
async function carregarDadosEstoque() {
  const [resProd, resDash] = await Promise.all([
    fetch("/api/produtos"),
    fetch("/api/dashboard"),
  ]);
  const dadosProd = await resProd.json();
  const dadosDash = await resDash.json();
  return {
    produtos: dadosProd.sucesso ? dadosProd.produtos : [],
    estatisticas: dadosDash.sucesso ? dadosDash.estatisticas : null,
  };
}

// Executa a exclusão segura de produto no backend (RF-03)
async function requisitarExclusaoProduto(id: string, perfil: string) {
  const res = await fetch(`/api/produtos/${id}?perfil=${perfil}`, { method: "DELETE" });
  return await res.json();
}

// Cabeçalho da página de produtos
function CabecalhoProdutos() {
  return (
    <div className="painel-cabecalho">
      <div>
        <h2 className="painel-titulo">Estoque de Produtos</h2>
        <p className="painel-subtitulo">Listagem geral e controle de inventário físico</p>
      </div>
    </div>
  );
}

// Conteúdo principal do painel de produtos
function PainelProdutos({
  mensagem,
  produtos,
  perfil,
  onExcluir,
}: {
  mensagem: { texto: string; erro: boolean } | null;
  produtos: IProduto[];
  perfil?: string;
  onExcluir: (id: string, nome: string) => void;
}) {
  return (
    <div className="painel-principal">
      <CabecalhoProdutos />
      {mensagem && (
        <div className={`mensagem-feedback ${mensagem.erro ? "mensagem-erro" : "mensagem-sucesso"}`}>
          {mensagem.texto}
        </div>
      )}
      <ProdutosTable produtos={produtos} perfilUsuario={perfil} aoExcluir={onExcluir} />
    </div>
  );
}

// Hook auxiliar para gerenciar os dados de produtos
function useDadosEstoque(usuario: any) {
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [stats, setStats] = useState<IEstatisticasDashboard | null>(null);

  const atualizar = async () => {
    const dados = await carregarDadosEstoque();
    setProdutos(dados.produtos);
    setStats(dados.estatisticas);
  };

  useEffect(() => {
    if (usuario) atualizar();
  }, [usuario]);

  return { produtos, stats, atualizar };
}

// Página principal de listagem de produtos (exibirProdutos.js)
export default function ExibirProdutosPage() {
  const { usuario, carregando } = useAuth();
  const { produtos, stats, atualizar } = useDadosEstoque(usuario);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState<{ id: string; nome: string } | null>(null);
  const [mensagem, setMensagem] = useState<{ texto: string; erro: boolean } | null>(null);

  const abrirConfirmacao = (id: string, nome: string) => (setItemParaExcluir({ id, nome }), setModalAberto(true));

  const confirmarExclusao = async () => {
    if (!itemParaExcluir || !usuario) return;
    const res = await requisitarExclusaoProduto(itemParaExcluir.id, usuario.tipo);
    setMensagem({ texto: res.mensagem, erro: !res.sucesso });
    setModalAberto(false);
    if (res.sucesso) atualizar();
  };

  if (carregando) return null;
  return (
    <>
      <Navbar usuario={usuario} />
      <main className="app-container">
        <StatCards stats={stats} />
        <PainelProdutos mensagem={mensagem} produtos={produtos} perfil={usuario?.tipo} onExcluir={abrirConfirmacao} />
      </main>
      <ConfirmModal
        aberto={modalAberto}
        titulo="Exclusão Segura de Produto"
        mensagem={`Deseja remover permanentemente o produto "${itemParaExcluir?.nome}" do estoque?`}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setModalAberto(false)}
      />
    </>
  );
}
