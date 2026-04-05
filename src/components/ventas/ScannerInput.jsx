import { useState } from "react";

export default function ScannerInput({ onAdd }) {
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!codigo) return;

    onAdd(codigo);
    setCodigo("");
  };

  return (
    <form onSubmit={handleSubmit} className="scanner-container">
      <input
        type="text"
        placeholder="Escanea o escribe código..."
        className="input"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
    </form>
  );
}