import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Header = () => {
  return (
    <header className="main-header">
      <Link to="/" className="header-logo">
        Lumispect
      </Link>
      <nav className="header-nav">
        <Link to="/instructions" title="Veja como o teste funciona">
          Instruções
        </Link>
        <a href="#sobre-projeto" title="Saiba mais sobre o projeto Lumispect">
          Sobre Nós
        </a>
      </nav>
    </header>
  );
};

export default Header;
