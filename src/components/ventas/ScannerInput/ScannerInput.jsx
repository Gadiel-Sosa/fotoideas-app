import { useState, useRef, useEffect } from "react";
import Input from "../../ui/Input/Input";

const ScannerInput = ({ onAdd, placeholder = "Escanea o escribe código..."}) => {

  const [codigo, setCodigo] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {inputRef.current?.focus()}, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    onAdd(codigo.trim());
    setCodigo("");
    inputRef.current?.focus();

  }


  return (

    <form onSubmit={handleSubmit} className="scanner-container">
      <Input
        ref={inputRef}
        value={codigo}
        placeholder={placeholder}
        onChange={(e) => setCodigo(e.target.value)}
      />
    </form>

  )

}

export default ScannerInput;