import { useState } from "react";

import "../../styles/ventas.css";

import Button from "../ui/Button";
import Modal from "../ui/Modal";

const SaleSummary = ({ productos, setProductos, rol }) => {

  const [showModal, setShowModal] = useState(false);
  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);


  const handleCancelarVenta = () => {
    setProductos([]);
    setShowModal(false);
  };

  return (
    <div className="sale-summary">
      <h2>Total: ${total.toFixed(2)}</h2>

      <div className="buttons">

        <Button variant="primary">
          Cobrar
        </Button>


        <Button variant="danger" disabled={rol !== "Admin"} onClick={() => setShowModal(true)} >
          Cancelar venta
        </Button>

      </div>


      {showModal && (
        <Modal
          title="¿Deseas cancelar toda la venta?"
          onConfirm={handleCancelarVenta}
          onCancel={() => setShowModal(false)}
          confirmText="Sí, cancelar"
          cancelText="No"
        />
      )}

    </div>
  )
}

export default SaleSummary