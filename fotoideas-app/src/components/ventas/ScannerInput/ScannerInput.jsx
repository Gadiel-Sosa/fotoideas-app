import { useState, useRef, useEffect } from "react";
import "./ScannerInput.css";

const ScannerInput = ({ onScan }) => {
  const [codigo, setCodigo] = useState("");
  const inputRef = useRef(null);

  // Opción extra: Si quieres que el usuario nunca pierda el foco del escáner
  // (por ejemplo, después de hacer clic en otro lado de la pantalla),
  // puedes descomentar esto para forzar que siempre esté activo:
  /*
  useEffect(() => {
    const handleGlobalClick = () => inputRef.current?.focus();
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);
  */

  const handleKeyDown = (e) => {
    // La pistola siempre manda un 'Enter' al terminar de leer
    if (e.key === "Enter") {
      e.preventDefault(); // Evitamos que recargue la página accidentalmente
      
      if (codigo.trim() !== "") {
        onScan(codigo.trim()); // Enviamos el código leído al componente padre (Ventas)
        setCodigo(""); // Limpiamos el input en milisegundos para el siguiente producto
      }
    }
  };

  return (
    <div className="scanner-container">
      <input
        ref={inputRef}
        type="text"
        className="scanner-input"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus // Mantiene el cursor parpadeando aquí automáticamente
        placeholder="Escanea el código de barras aquí..."
      />
    </div>
  );
};

export default ScannerInput;