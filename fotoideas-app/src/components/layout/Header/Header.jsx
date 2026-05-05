import "./Header.css";
import { FaSearch, FaEnvelope } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header">

      <div className="header-logo">
        FOTOIDEAS
      </div>

      <div className="header-search">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search"
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <FaEnvelope />

        <span className="notification-dot"></span>
      </div>

    </header>
  );
};

export default Header;