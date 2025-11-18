import { Link } from "react-router-dom";
import "./style.css";
const STORAGE_KEY_ANSWERS = "questionnaireAnswers";
const STORAGE_KEY_INDEX = "currentQuestionIndex";
const Header = () => {
  
  sessionStorage.removeItem(STORAGE_KEY_ANSWERS);
  sessionStorage.removeItem(STORAGE_KEY_INDEX);
  return (
    <header className="main-header">
      <Link to="/" className="header-logo">
        Lumispect
        <span>
          <img src="" alt="" />
        </span>
      </Link>
      <nav className="header-nav">
        <Link to="/instructions" title="Veja como o teste funciona">
          Instruções
        </Link>
        <Link to="/about-us">Sobre Nós</Link>
      </nav>
    </header>
  );
};

export default Header;
