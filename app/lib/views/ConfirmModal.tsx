"use client";

// Propriedades do modal de confirmação segura
interface ConfirmModalProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

// Modal para exclusão segura de produtos (RF-03)
export function ConfirmModal({ aberto, titulo, mensagem, aoConfirmar, aoCancelar }: ConfirmModalProps) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <h3 className="modal-titulo">{titulo}</h3>
        <p className="modal-descricao">{mensagem}</p>
        <div className="modal-acoes">
          <button onClick={aoCancelar} className="btn-cancelar">Cancelar</button>
          <button onClick={aoConfirmar} className="btn-confirmar-exclusao">Confirmar Exclusão</button>
        </div>
      </div>
    </div>
  );
}
