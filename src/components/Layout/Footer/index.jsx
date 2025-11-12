import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logos">
        <div className="logo-item">
          <span style={{ fontWeight: "600", color: "#888" }}>Logo Fametro</span>
        </div>
        <div className="logo-item">
          <span style={{ fontWeight: "600", color: "#888" }}>
            Logo Inovatech
          </span>
        </div>
        <Link to="/references" className="logo-item references">
          Referências
        </Link>
      </div>
      <div className="copyright">
        &copy; 2025 Lumispect. Plataforma Gamificada de Autoavaliação Cognitiva.
      </div>
    </footer>
  );
};

export default Footer;
