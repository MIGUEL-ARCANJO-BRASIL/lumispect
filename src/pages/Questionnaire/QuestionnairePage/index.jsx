import React, { useState, useEffect } from "react";
import "./style.css";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";
import { useNavigate } from "react-router-dom";

// Chaves de armazenamento
const STORAGE_KEY_ANSWERS = "questionnaireAnswers";
const STORAGE_KEY_INDEX = "currentQuestionIndex";

// 1. CONSTANTES DE OPÇÕES DEFINIDAS PRIMEIRO
const BASE_OPTIONS = [
  "Concordo totalmente",
  "Concordo parcialmente",
  "Discordo parcialmente",
  "Discordo totalmente",
];

// 2. MATRIZES DE PERGUNTAS (Não alteradas)
const baseQuestions = [
  {
    id: 1,
    text: "Quando estou lendo uma história, normalmente me concentro mais nos personagens do que nos fatos.",
    options: BASE_OPTIONS,
  },
  {
    id: 2,
    text: "Frequentemente me pego mais concentrado em detalhes do que no quadro geral.",
    options: BASE_OPTIONS,
  },
  {
    id: 3,
    text: "Costumo ter dificuldades em entender o que outra pessoa está pensando ou sentindo.",
    options: BASE_OPTIONS,
  },
  {
    id: 4,
    text: "Costumo gostar de planejar todas as minhas atividades de forma minuciosa.",
    options: BASE_OPTIONS,
  },
  {
    id: 5,
    text: "Costumo me perder durante conversas porque tenho dificuldades em acompanhar o ritmo.",
    options: BASE_OPTIONS,
  },
  {
    id: 6,
    text: "Costumo gostar de realizar atividades sociais só quando estritamente necessário.",
    options: BASE_OPTIONS,
  },
  {
    id: 7,
    text: "Frequentemente me sinto mais confortável fazendo as mesmas coisas de forma repetitiva.",
    options: BASE_OPTIONS,
  },
  {
    id: 8,
    text: "Normalmente percebo pequenos sons que outras pessoas não percebem.",
    options: BASE_OPTIONS,
  },
  {
    id: 9,
    text: "Normalmente consigo manter conversas regulares com outras pessoas.",
    options: BASE_OPTIONS,
  },
  {
    id: 10,
    text: "Costumo perceber padrões em coisas ao meu redor que outras pessoas não veem.",
    options: BASE_OPTIONS,
  },
];

const allQuestions = [...baseQuestions];

const QuestionnairePage = () => {
  // 1. Inicializa o estado lendo do sessionStorage
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = sessionStorage.getItem(STORAGE_KEY_ANSWERS);
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem(STORAGE_KEY_INDEX);
    // Garante que o índice salvo é um número válido e não excede o total de perguntas
    const index = savedIndex ? parseInt(savedIndex, 10) : 0;
    return index < allQuestions.length ? index : 0;
  });

  const navigate = useNavigate();

  // 2. Efeito para salvar respostas e índice sempre que eles mudam
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    sessionStorage.setItem(STORAGE_KEY_INDEX, currentQuestionIndex.toString());
  }, [answers, currentQuestionIndex]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  const handleGoToGame = () => {
    navigate(-1);
  };

  const handleAnswer = (id, value) => {
    // A lógica de exclusão/alternância está correta, mas garante que usa setAnswers
    if (answers[id] === value) {
      const newAnswers = { ...answers };
      delete newAnswers[id];
      setAnswers(newAnswers);
    } else {
      setAnswers({ ...answers, [id]: value });
    }
  };

  const handleNext = () => {
    if (!isAnswered) return;

    if (currentQuestionIndex < allQuestions.length - 1) {
      // Esta chamada salva o novo índice através do useEffect
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      // Esta chamada salva o novo índice através do useEffect
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Questionário Concluído. Respostas Finais:", answers);

    // Salva as respostas finais (embora o useEffect já tenha feito isso)
    sessionStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));

    // Limpa o índice da pergunta, pois a sessão terminou
    sessionStorage.removeItem(STORAGE_KEY_INDEX);

    setTimeout(() => {
      navigate("/results");
    }, 0);
  };

  // Calculo de progresso
  const progressPercentage =
    ((currentQuestionIndex + 1) / allQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="questionnaire-page">
      <Header />

      <main className="questionnaire-main">
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">
            Questionário <span className="title-highlight">Lumispect</span>
          </h1>

          <div className="main-content-wrapper">
            <div className="question-section">
              <button
                onClick={handleGoToGame}
                className="nav-button back-to-game top-left-button"
              >
                <i className="fas fa-arrow-left"></i> Voltar
              </button>
              <div className="question-card single-question-view">
                <p className="question-progress">
                  Pergunta {currentQuestionIndex + 1} de {allQuestions.length} (
                  {answeredCount} respondida{answeredCount !== 1 ? "s" : ""})
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <p className="question-text">{currentQuestion.text}</p>

                <div className="answer-options full-width-options">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(currentQuestion.id, option)}
                      className={`answer-button large-button ${
                        answers[currentQuestion.id] === option ? "selected" : ""
                      }`}
                      aria-pressed={answers[currentQuestion.id] === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="navigation-section">
                <button
                  onClick={handlePrev}
                  className="nav-button prev"
                  disabled={currentQuestionIndex === 0}
                >
                  <i className="fas fa-arrow-left"></i> Anterior
                </button>

                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    className="result-button final-button"
                    disabled={!isAnswered}
                  >
                    <i className="fas fa-flag-checkered button-icon"></i>{" "}
                    Finalizar
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="nav-button next"
                    disabled={!isAnswered}
                  >
                    Próxima <i className="fas fa-arrow-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionnairePage;
