import "./SearchBar.css";

import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar..."
}) => {

  return (

    <div className="searchbar">

      <FaSearch className="searchbar-icon" />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="searchbar-input"
      />

    </div>

  );
};

export default SearchBar