import React, { useState } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import "./style.css";

const questions = [
  "Você costuma começar várias tarefas ao mesmo tempo, mas tem dificuldade para terminá-las?",
  "Você se distrai com facilidade quando está tentando se concentrar em algo importante?",
  "Você frequentemente esquece compromissos, objetos ou o que estava prestes a fazer?",
  "Você se sente inquieto(a) ou tem dificuldade em ficar parado(a) por muito tempo?",
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionIndex, answerValue) => {
    if (answers[questionIndex] === answerValue) {
      const newAnswers = { ...answers };
      delete newAnswers[questionIndex];
      setAnswers(newAnswers);
    } else {
      setAnswers({
        ...answers,
        [questionIndex]: answerValue,
      });
    }
  };
  return (
    <div className="questionnaire-page">
      <Header />

      <main className="questionnaire-main">
        <div className="questionnaire-container">
          {/* Título Principal */}
          <h1 className="questionnaire-title">
            <span className="title-highlight">Autoavaliação</span> Cognitiva
          </h1>

          {/* Lista de Perguntas */}
          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={index} className="question-card">
                <p className="question-number">{index + 1}</p>
                <p className="question-text">{question}</p>

                {/* Opções de Resposta */}
                <div className="answer-options">
                  <button
                    onClick={() => handleAnswer(index, "Sim")}
                    // 🔑 Sintaxe correta para classe condicional:
                    className={`answer-button button-yes ${
                      answers[index] === "Sim" ? "selected" : ""
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => handleAnswer(index, "Não")}
                    className={`answer-button button-no ${
                      answers[index] === "Não" ? "selected" : ""
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botão de Finalização */}
          <div className="results-section">
            <button className="result-button primary-button">
              <i className="fas fa-arrow-right button-icon"></i>
              Ver Resultado
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;
