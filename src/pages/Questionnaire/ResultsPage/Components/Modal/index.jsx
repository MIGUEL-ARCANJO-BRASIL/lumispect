import React from "react";

// ===================================
// DADOS DAS PERGUNTAS (Centralize se possível)
// ===================================
const QUESTIONS_DATA = [
  {
    id: 1,
    text: "Eu me sinto desconfortável em ambientes com muitas pessoas.",
  },
  { id: 2, text: "Eu prefiro seguir uma rotina estrita todos os dias." },
  {
    id: 3,
    text: "Eu tenho dificuldade em manter contato visual durante conversas.",
  },
  {
    id: 4,
    text: "Eu sou frequentemente criticado por falar demais sobre um único assunto.",
  },
  {
    id: 5,
    text: "Eu me sinto sobrecarregado por cheiros, sons ou luzes fortes.",
  },
  {
    id: 6,
    text: "Eu acho que as pessoas levam as coisas que digo de forma muito literal.",
  },
  {
    id: 7,
    text: "Eu sou habilidoso em perceber as intenções e emoções dos outros.",
  },
  {
    id: 8,
    text: "Eu desenvolvo interesses intensos e me aprofundo neles por longos períodos.",
  },
  { id: 9, text: "Eu me sinto à vontade em situações sociais espontâneas." },
  {
    id: 10,
    text: "Eu tenho movimentos repetitivos ou 'stimming' (como balançar, bater os dedos).",
  },
];

const ModalDetailsResult = ({ isOpen, onClose, answers }) => {
  if (!isOpen || !answers) return null;

  // Converte as respostas para uma lista que inclui o texto da pergunta
  const detailedResponses = QUESTIONS_DATA.map((q) => ({
    id: q.id,
    text: q.text,
    // Garante que a resposta seja exibida, se não, mostra "Não respondida"
    answer: answers[q.id] || "Não respondida",
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Detalhes das Suas Respostas</h2>
        <p className="modal-subtitle">
          As respostas são apresentadas na ordem original do questionário.
        </p>
        <div className="response-list-container">
          {detailedResponses.map((item) => (
            <div key={item.id} className="response-item">
              <span className="response-id">Q{item.id}:</span>
              <p className="response-question">{item.text}</p>
              <span className="response-answer">{item.answer}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="action-button modal-close-action">
          Fechar Detalhes
        </button>
      </div>
    </div>
  );
};

export default ModalDetailsResult;
