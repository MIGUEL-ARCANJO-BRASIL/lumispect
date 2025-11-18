import React, { useState } from "react";
// Importe o CSS se ele estiver em um arquivo separado, como Modal.css
import "./style.css";

// Função auxiliar para gerar conteúdo de texto para compartilhamento
const generateShareContent = (result, answers) => {
  let content = `*Resultado do Questionário Lumispect*\n\n`;
  content += `*Pontuação: ${result.score}%* (${result.category})\n`;
  content += `*Recomendação:* ${result.recommendation
    .split("Recomendamos procurar")[0]
    .trim()}\n\n`;

  content += `--- Respostas Detalhadas ---\n`;

  result.questions.forEach((q) => {
    const answer = answers[q.id] || "Não respondida";
    content += `Q${q.id}: ${q.text}\n   R: ${answer}\n`;
  });

  content += `\nLembre-se: Este é um teste de triagem e não substitui o diagnóstico clínico.`;
  return content;
};

const ModalDetailsResult = ({
  isOpen,
  onClose,
  answers,
  questions,
  result,
}) => {
  // Estado para controlar a visibilidade das questões detalhadas
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);

  if (!isOpen || !answers || !result) return null;

  let headerColor;
  if (result.score >= 70) {
    headerColor = "high";
  } else if (result.score >= 40) {
    headerColor = "medium";
  } else {
    headerColor = "low";
  }

  // FUNÇÃO DE DOWNLOAD VIA API (CORRETA)
  const handleDownloadPdf = async () => {
    // Usa o 'answers' do escopo do componente (não precisa passar por parâmetro)
    try {
      const response = await fetch("http://localhost:3001/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envia o objeto de respostas
        body: JSON.stringify({ answers, result }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao gerar o PDF: ${response.status} - ${errorText}`
        );
      }

      // 2. Converte a resposta em um Blob (o arquivo PDF)
      const blob = await response.blob();

      // 3. Cria um link temporário para forçar o download no navegador
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Lumispect_Relatorio_Detalhado.pdf";

      // Dispara o clique e limpa
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Libera a memória

      console.log("PDF baixado com sucesso!");
    } catch (error) {
      console.error("Falha ao baixar o PDF:", error);
      alert(
        "Erro ao gerar o relatório. Verifique se o servidor de API está rodando (porta 3001) e se as respostas foram enviadas corretamente."
      );
    }
  };

  const handleShareWhatsapp = () => {
    const shareText = generateShareContent(result, answers);
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(
      "Meu Resultado do Questionário Lumispect"
    );
    const body = encodeURIComponent(generateShareContent(result, answers));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Função para alternar a visibilidade das questões
  const toggleQuestionsVisibility = () => {
    setShowDetailedQuestions(!showDetailedQuestions);
  };

  // Converte as respostas para uma lista que inclui o texto da pergunta
  const detailedResponses = questions.map((q) => ({
    id: q.id,
    text: q.text,
    answer: answers[q.id] || "Não respondida",
  }));

  // --- RENDERIZAÇÃO DO MODAL ---
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botão de Fechar */}
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title print-header">
          Detalhes do Resultado Lumispect
        </h2>

        {/* Seção de Resumo do Resultado */}
        <div className={`result-summary-box ${headerColor}`}>
          <h3 className="summary-title">Resumo do Teste</h3>
          <p className="summary-score">
            Pontuação: <strong>{result.score}%</strong>
          </p>
          <p className="summary-category">
            Categoria: <strong>{result.category}</strong>
          </p>
          <p className="summary-recommendation">{result.recommendation}</p>
        </div>

        <hr className="modal-divider" />

        {/* Botão para Mostrar/Ocultar Questões Detalhadas */}
        <button
          onClick={toggleQuestionsVisibility}
          className="action-button detail-toggle-button"
        >
          <i
            className={`fas fa-chevron-${
              showDetailedQuestions ? "up" : "down"
            } button-icon`}
          ></i>
          {showDetailedQuestions ? "Ocultar" : "Mostrar"} Questões Detalhadas
        </button>

        {/* Seção Ocultável de Questões Detalhadas */}
        {showDetailedQuestions && (
          <>
            <h3 className="modal-subtitle detailed-list-title">
              Respostas Detalhadas por Questão
            </h3>
            <div className="response-list-container">
              {detailedResponses.map((item) => (
                <div key={item.id} className="response-item">
                  <span className="response-id">Q{item.id}:</span>
                  <p className="response-question">{item.text}</p>
                  <span className="response-answer">{item.answer}</span>
                </div>
              ))}
            </div>
            <hr className="modal-divider" />
          </>
        )}

        {/* Seção de Ações e Compartilhamento */}
        <div className="modal-actions-group">
          {/* NOVO BOTÃO: DOWNLOAD VIA API (RELATÓRIO FORMATADO) */}
          <button
            onClick={handleDownloadPdf}
            className="action-button download-button primary-action"
          >
            <i className="fas fa-download button-icon"></i> Baixar Relatório PDF
          </button>

          <h4 className="share-prompt">Compartilhar Resultado</h4>
          <div className="share-buttons-group">
            <button
              onClick={handleShareWhatsapp}
              className="action-button share-button whatsapp-button"
            >
              <i className="fab fa-whatsapp button-icon"></i> WhatsApp
            </button>
            <button
              onClick={handleShareEmail}
              className="action-button share-button email-button"
            >
              <i className="fas fa-envelope button-icon"></i> Email
            </button>
          </div>
        </div>

        <button onClick={onClose} className="action-button modal-close-action">
          Fechar Detalhes
        </button>
      </div>
    </div>
  );
};

export default ModalDetailsResult;
