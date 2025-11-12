// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Questionnaire from "./pages/Questionnaire";

const QuizPage = () => (
  <div style={{ padding: "4rem", textAlign: "center" }}>
    <h1>Quiz</h1>
    <p>Página em desenvolvimento</p>
  </div>
);

const Games = () => (
  <div style={{ padding: "4rem", textAlign: "center" }}>
    <h1>Jogos</h1>
    <p>Página em desenvolvimento</p>
  </div>
);

const Results = () => (
  <div style={{ padding: "4rem", textAlign: "center" }}>
    <h1>Resultados</h1>
    <p>Página em desenvolvimento</p>
  </div>
);

const About = () => (
  <div style={{ padding: "4rem", textAlign: "center" }}>
    <h1>Sobre Nós</h1>
    <p>Página em desenvolvimento</p>
  </div>
);

const References = () => (
  <div style={{ padding: "4rem", textAlign: "center" }}>
    <h1>Referências</h1>
    <p>Página em desenvolvimento</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/games" element={<Games />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/references" element={<References />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
