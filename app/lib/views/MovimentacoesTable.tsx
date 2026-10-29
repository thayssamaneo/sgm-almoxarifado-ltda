"use client";

import { IMovimentacao } from "../models/movimentacaoModel";

// Propriedades do componente de histórico de movimentações
interface MovimentacoesTableProps {
  movimentacoes: IMovimentacao[];
}

// Formata a data ISO para o padrão brasileiro
function formatarDataHora(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString("pt-BR");
  } catch {
    return isoString;
  }
}

// Renderiza a badge do tipo de movimentação
function BadgeTipo({ tipo }: { tipo: "Entrada" | "Saída" }) {
  const classe = tipo === "Entrada" ? "badge-tipo-entrada" : "badge-tipo-saida";
  return <span className={classe}>{tipo}</span>;
}

// Renderiza uma linha individual de movimentação
function MovimentacaoLinha({ item }: { item: IMovimentacao }) {
  return (
    <tr>
      <td>{formatarDataHora(item.dateTime)}</td>
      <td><strong>{item.nomeProduto || item.idProduto}</strong></td>
      <td><BadgeTipo tipo={item.tipo} /></td>
      <td><strong>{item.quantidade}</strong> un.</td>
      <td>{item.nomeUsuario || item.idUsuario}</td>
    </tr>
  );
}

// Tabela dinâmica do histórico de movimentações (RF-05)
export function MovimentacoesTable({ movimentacoes }: MovimentacoesTableProps) {
  if (movimentacoes.length === 0) {
    return <p style={{ color: "#64748b", padding: "16px" }}>Nenhuma movimentação registrada até o momento.</p>;
  }

  return (
    <div className="tabela-container">
      <table className="tabela-dados">
        <thead>
          <tr>
            <th>Data e Horário</th>
            <th>Produto</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Responsável</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((item) => (
            <MovimentacaoLinha key={item._id?.toString()} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
