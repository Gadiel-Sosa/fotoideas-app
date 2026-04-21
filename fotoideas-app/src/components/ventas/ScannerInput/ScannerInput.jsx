import { useState } from "react";
import "./ScannerInput.css"; // ← Importar el CSS

const ScannerInput = ({ onAdd }) => {
  const [codigo, setCodigo] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (codigo.trim()) {
        onAdd(codigo);
        setCodigo("");
      }
    }
  };

  return (
    <input
      type="text"
      className="scanner-input" // ← Agregar la clase
      placeholder="Escanea o escribe código..."
      value={codigo}
      onChange={(e) => setCodigo(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

export default ScannerInput;