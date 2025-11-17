import React, { useState } from "react";
import "./style.css";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";
import { useNavigate } from "react-router-dom";

const baseQuestions = [
  {
    id: 1,
    text: "Quando estou lendo uma história, normalmente me concentro mais nos personagens do que nos fatos.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 2,
    text: "Frequentemente me pego mais concentrado em detalhes do que no quadro geral.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 3,
    text: "Costumo ter dificuldades em entender o que outra pessoa está pensando ou sentindo.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 4,
    text: "Costumo gostar de planejar todas as minhas atividades de forma minuciosa.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 5,
    text: "Costumo me perder durante conversas porque tenho dificuldades em acompanhar o ritmo.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 6,
    text: "Costumo gostar de realizar atividades sociais só quando estritamente necessário.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 7,
    text: "Frequentemente me sinto mais confortável fazendo as mesmas coisas de forma repetitiva.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 8,
    text: "Normalmente percebo pequenos sons que outras pessoas não percebem.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 9,
    text: "Normalmente consigo manter conversas regulares com outras pessoas.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
  {
    id: 10,
    text: "Costumo perceber padrões em coisas ao meu redor que outras pessoas não veem.",
    options: [
      "Concordo totalmente",
      "Concordo parcialmente",
      "Discordo parcialmente",
      "Discordo totalmente",
    ],
  },
];

const complementaryQuestions = [
  {
    id: 11,
    text: "Tenho dificuldade para fazer ou manter amizades.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 12,
    text: "Tenho dificuldade para interpretar expressões faciais, gestos ou linguagem corporal.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 13,
    text: "Mudanças inesperadas na minha rotina me estressam muito.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 14,
    text: "Tenho interesses intensos e específicos que dominam grande parte do meu tempo.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 15,
    text: "Entro em hiperfoco e perco a noção do tempo com facilidade.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 16,
    text: "Tenho comportamentos repetitivos (mexer mãos, balançar, repetir palavras).",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 17,
    text: "Sou muito sensível (ou pouco sensível) a sons, luzes, cheiros ou texturas.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 18,
    text: "Entendo as coisas de forma muito literal e tenho dificuldade com ironias e sarcasmo.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 19,
    text: "Sinto dificuldade em acompanhar o ritmo social de uma conversa.",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
  {
    id: 20,
    text: 'Preciso "mascarar" meu jeito natural para parecer normal, e isso me exausta.',
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
  },
];

const allQuestions = [...baseQuestions, ...complementaryQuestions];

const QuestionnairePage = () => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const navigate = useNavigate();

  const handleGoToGame = () => {
    navigate(-1);
  };

  const handleAnswer = (id, value) => {
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
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Questionário Concluído. Respostas Finais:", answers);
    alert(
      "Questionário concluído. As respostas estão prontas para serem enviadas/processadas."
    );
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
            {/* <div className="question-map-section">
              <div className="question-map-container">
                <h3 className="question-map-title">Questões</h3>
                <div className="question-map">
                  {allQuestions.map((q, index) => {
                    const isCurrent = index === currentQuestionIndex;
                    const isAnsweredMap = answers[q.id] !== undefined;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`question-map-button 
                          ${isCurrent ? "current" : ""} 
                          ${isAnsweredMap ? "answered" : ""}`}
                        aria-label={`Ir para a Pergunta ${q.id}`}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>
                <div className="question-map-legend">
                  <div className="legend-item">
                    <div className="legend-color current"></div>
                    <span>Atual</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color answered"></div>
                    <span>Respondida</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color"></div>
                    <span>Pendente</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionnairePage;
