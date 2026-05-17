import "./Header.css";

import { FaEnvelope } from "react-icons/fa";

import SearchBar from "../SearchBar/SearchBar";

const Header = ({
  showSearch = false,
  searchValue = "",
  onSearchChange
}) => {

  return (

    <header className="header">

      <div className="header-logo">
        FOTOIDEAS
      </div>

      {showSearch && (
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Buscar..."
        />
      )}

      <div className="header-actions">

        <FaEnvelope />

        <span className="notification-dot"></span>

      </div>

    </header>
  );
};

export default Header