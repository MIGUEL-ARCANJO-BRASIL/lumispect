import React, { useState, useEffect } from "react";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";
import { useNavigate } from "react-router-dom";

import "./style.css";
import ModalDetailsResult from "./Components/Modal";
import LoadingScreen from "../../../components/UI/LoadingScreen";

// Chaves de armazenamento
const STORAGE_KEY_ANSWERS = "questionnaireAnswers";
const STORAGE_KEY_INDEX = "currentQuestionIndex";
const STORAGE_KEY_AVATAR = "avatarGameChoices";

// ===================================
// LÓGICA DE PONTUAÇÃO (Mantida)
// ===================================
const SCORING_BASE = {
  "Concordo totalmente": 4,
  "Concordo parcialmente": 3,
  "Discordo parcialmente": 2,
  "Discordo totalmente": 1,
};

const INVERTED_QUESTIONS = [];
const MAX_SCORE = 40;

const calculateScore = (answers) => {
  let totalScore = 0;
  for (const id in answers) {
    const questionId = parseInt(id);
    const answer = answers[id];
    let score = 0;

    if (questionId >= 1 && questionId <= 10) {
      score = SCORING_BASE[answer] || 0;
      if (INVERTED_QUESTIONS.includes(questionId)) {
        score = 5 - score;
      }
    }
    totalScore += score;
  }
  const scorePercentage = Math.round((totalScore / MAX_SCORE) * 100);
  return { totalScore, scorePercentage };
};

const getResultData = (scorePercentage) => {
  let category, recommendationText, nextStepsLink;
  if (scorePercentage >= 70) {
    category = "Traços autistas são mais prováveis";
    recommendationText = `Atenção, o resultado do seu teste sugere que você experiementou de forma mais intensa os sintomas do autismo, provavelmente causando incômodo considerável, e que pode ficar bem complicado se não for devidamente diagnosticado com rapidez. Recomendamos procurar ajuda médica especializada para lidar com esse provável quadro de autismo o quanto antes.`;
    nextStepsLink =
      "Fazer uma boa TERAPIA é uma forma de impedir que o desconforto avance.";
  } else if (scorePercentage >= 40) {
    category = "Sinais de Atenção: Traços de Rigidez e Sensibilidade";
    recommendationText = `O seu resultado indica uma presença moderada de traços relacionados ao espectro. Embora não seja um diagnóstico, esses traços podem impactar seu bem-estar diário. Considerar uma avaliação com um profissional pode ser útil para melhor autoconhecimento e desenvolvimento de estratégias.`;
  } else {
    category = "Traços Comuns ou Baixa Probabilidade";
    recommendationText = `O seu resultado sugere que as suas experiências se alinham mais com o padrão neurotípico, com pouca intensidade nos traços avaliados. Continue focando no seu bem-estar geral.`;
  }
  return { category, recommendationText, nextStepsLink };
};

const ResultsPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAnswersJSON = sessionStorage.getItem(STORAGE_KEY_ANSWERS);

    if (!savedAnswersJSON) {
      navigate("/questionnaire");
      return;
    }

    try {
      const loadedAnswers = JSON.parse(savedAnswersJSON);
      setAnswers(loadedAnswers);

      const { scorePercentage } = calculateScore(loadedAnswers);
      const resultData = getResultData(scorePercentage);

      setResult({
        score: scorePercentage,
        category: resultData.category,
        recommendation: resultData.recommendationText,
        nextSteps: resultData.nextStepsLink,
      });

      setLoading(false);
    } catch (error) {
      console.error("Erro processando respostas:", error);
      navigate("/questionnaire");
      return;
    }
  }, [navigate]);

  const handleRetake = () => {
    sessionStorage.removeItem(STORAGE_KEY_ANSWERS);
    sessionStorage.removeItem(STORAGE_KEY_INDEX);
    sessionStorage.removeItem(STORAGE_KEY_AVATAR);

    navigate("/avatar-game");
  };

  const handleFinish = () => {
    sessionStorage.removeItem(STORAGE_KEY_ANSWERS);
    sessionStorage.removeItem(STORAGE_KEY_INDEX);
    sessionStorage.removeItem(STORAGE_KEY_AVATAR);

    navigate("/");
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true); // Abre o modal
  };

  if (loading || !result) {
    return <LoadingScreen />;
  }

  // Define a cor de destaque do gráfico com base na pontuação
  let scoreColor;
  if (result.score >= 70) {
    scoreColor = "#dc3545"; // Cor Forte para High
  } else if (result.score >= 40) {
    scoreColor = "var(--amarelo-destaque)"; // Amarelo para Medium
  } else {
    scoreColor = "#79c743"; // Verde para Low
  }

  return (
    <div className="results-page">
      <Header />
      <main className="results-main">
        <div className="results-container">
          <h1 className="results-title">
            Resultado do{" "}
            <span className="title-highlight">Questionário Lumispect</span>
          </h1>

          <div className="result-card">
            <div className="score-section">
              {/* GRÁFICO DE ROSCA (DONUT) */}

              <div
                className={`score-circle score-${
                  result.score >= 70
                    ? "high"
                    : result.score >= 40
                    ? "medium"
                    : "low"
                }`}
                // Injeta o gradiente dinâmico no estilo
                style={{
                  backgroundImage: `conic-gradient(${scoreColor} ${result.score}%, #e9ecef ${result.score}%)`,
                }}
              >
                <p className="score-number">{result.score}%</p>
              </div>
            </div>

            <div className="explanation-section">
              <p className="explanation-text">
                Esta porcentagem representa o quão alinhadas estão suas
                respostas com o escore máximo possível de traços avaliados pelo
                questionário Lumispect.
              </p>
            </div>

            {/* BOTÃO DE DETALHES */}
            <div className="center-actions-group">
              <button
                onClick={handleViewDetails}
                className="action-button detail-button"
              >
                <i className="fas fa-search button-icon"></i> Ver Detalhes
              </button>
            </div>

            <hr className="divider" />

            <div className="recommendation-section">
              <h3 className="category-title">Categoria - {result.category}</h3>

              <p className="recommendation-text">{result.recommendation}</p>

              {/* Condicional para o Next Steps, agora correto */}
              {result.score >= 70 && (
                <div className="next-steps">
                  <p className="next-steps-text">{result.nextSteps}</p>
                  <a href="#" className="call-to-action-button">
                    <i className="fas fa-arrow-right"></i> Ver Terapias
                    Recomendadas
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="action-buttons-section">
          <button
            onClick={handleRetake}
            className="action-button retake-button"
          >
            <i className="fas fa-redo button-icon"></i> Refazer Questionário
          </button>

          <button
            onClick={handleFinish}
            className="action-button finish-button"
          >
            <i className="fas fa-home button-icon"></i> Concluir
          </button>
        </div>
        <div className="results-action-footer">
          {/* COLUNA ESQUERDA - Aviso Legal e Mensagem Final */}
          <div className="left-column">
            <h2 className="final-message-highlight">
              Experiência LUMISPECT Concluída!
            </h2>

            <p className="disclaimer-text">
              Lembre-se: o LUMISPECT é uma ferramenta de triagem e
              autoconhecimento, e não substitui o diagnóstico clínico. Se os
              resultados levantarem preocupações, recomendamos que você procure
              um profissional de saúde qualificado para uma avaliação formal.
            </p>

            <p className="final-message-title">
              Obrigado por completar a sua autoavaliação
            </p>
          </div>

          {/* COLUNA DIREITA - Ações (Email, Download, Refazer, Concluir) */}
          <div className="right-column">
            <p className="email-prompt">Receba seus resultados por Email</p>
            <div className="email-input-group">
              <input
                type="email"
                placeholder="Seu email"
                className="email-input"
              />
              <a className="action-button email-submit-button">Enviar</a>
            </div>

            <div className="action-buttons-group column-buttons">
              <button
                onClick={() => {
                  window.print();
                }}
                className="action-button download-button"
              >
                <i className="fas fa-file-pdf button-icon"></i> Baixar Pdf
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ModalDetailsResult
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        answers={answers}
      />
    </div>
  );
};

export default ResultsPage;
