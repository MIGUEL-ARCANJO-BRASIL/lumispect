import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import "./style.css"; // Importa o CSS da página

// Importe imagens ou ícones de assets, se necessário.
// Exemplo:
// import iconFocus from "../assets/icon-focus.png";

const Instructions = () => {
  // Array para o conteúdo dos 4 pilares
  const instructionSteps = [
    {
      icon: "fas fa-bullseye",
      title: "Concentre-se",
      text: "Mantenha o foco total na tela. Pequenos detalhes farão a diferença.",
    },
    {
      icon: "fas fa-bolt",
      title: "Seja Rápido",
      text: "A velocidade da sua resposta é crucial. Não hesite!",
    },
    {
      icon: "fas fa-mouse-pointer",
      title: "Selecione as Respostas",
      text: "Use o mouse ou a tela de toque para interagir com o jogo.",
    },
    {
      icon: "fas fa-question-circle",
      title: "Sem Certo ou Errado",
      text: "O objetivo é mapear seu padrão, não te julgar. Apenas seja você.",
    },
  ];

  return (
    <div className="instructions-page">
      <Header />

      <main className="instructions-main">
        {/* Conteúdo Centralizado */}
        <div className="instructions-content">
          <h1 className="instructions-title">
            <span className="title-prefix">Como Funciona o</span>
            <span className="title-highlight"> Lumispect</span>
            <span>?</span>
          </h1>
          <h2 className="instructions-subtitle">
            Você participará de uma série de jogos rápidos e divertidos.
          </h2>

          <hr className="divider" />

          <div className="steps-container">
            {instructionSteps.map((step, index) => (
              <div key={index} className="step-card">
                <i className={`${step.icon} step-icon`}></i>

                <h3 className="step-title">{step.title}</h3>
                <p className="step-text">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="ready-section">
            <p className="ready-text">
              Descubra seus padrões de atenção, foco e velocidade de pensamento
              através de jogos cognitivos interativos.
            </p>

            <Link
              to="/avatar-game"
              className="start-button button primary-button"
            >
              <i className="fas fa-play"></i> Começar
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Instructions;
