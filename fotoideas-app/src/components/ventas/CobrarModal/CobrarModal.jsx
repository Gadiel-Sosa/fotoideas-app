import { useState } from "react";
import "./CobrarModal.css";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";

const CobrarModal = ({ total, onConfirm, onCancel }) => {
  const [recibido, setRecibido] = useState("");
  const [cambio, setCambio] = useState(0);

  const handleRecibidoChange = (e) => {
    const valor = parseFloat(e.target.value) || 0;
    setRecibido(valor);
    const cambioCalculado = valor - total;
    setCambio(cambioCalculado > 0 ? cambioCalculado : 0);
  };

  const handleConfirm = () => {
    const recibidoNum = parseFloat(recibido) || 0;
    if (recibidoNum < total) {
      alert(`El monto recibido ($${recibidoNum.toFixed(2)}) es menor al total ($${total.toFixed(2)})`);
      return;
    }
    onConfirm(recibidoNum, cambio);
  };

  return (
    <div className="cobrar-modal-backdrop">
      <div className="cobrar-modal">
        <h3>Cobrar Venta</h3>
        
        <div className="cobrar-total">
          <span>Total a pagar:</span>
          <strong>${total.toFixed(2)}</strong>
        </div>

        <Input
          label="Dinero recibido"
          type="number"
          value={recibido}
          onChange={handleRecibidoChange}
          placeholder="Ingrese el monto recibido"
          autoFocus
        />

        <div className="cobrar-cambio">
          <span>Cambio:</span>
          <strong className={cambio > 0 ? "cambio-positivo" : "cambio-cero"}>
            ${cambio.toFixed(2)}
          </strong>
        </div>

        <div className="cobrar-buttons">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirmar Cobro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CobrarModal;