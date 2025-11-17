import React from "react";
// Certifique-se de que o CSS para .loading-screen e .spinner está no seu style.css

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner-container">
        {/* Ícone ou animação. Usaremos um spinner CSS puro */}
        <div className="spinner"></div>
        <p className="loading-text">Carregando resultados...</p>
        <p className="loading-subtext">Processando suas respostas...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
