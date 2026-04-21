import { useState } from "react";

import "./SaleSummary.css";

import Button from "../../ui/Button/Button";
import Modal from "../../ui/Modal/Modal";
import CobrarModal from "../CobrarModal/CobrarModal"; // ← Importar el nuevo modal

const SaleSummary = ({ productos, setProductos, rol, onCobrar }) => {

  const [showModal, setShowModal] = useState(false);
  const [showCobrarModal, setShowCobrarModal] = useState(false); // ← Estado para modal de cobro
  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const handleCancelarVenta = () => {
    setProductos([]);
    setShowModal(false);
  };

  const handleAbrirCobro = () => {
    if (productos.length === 0) {
      alert("No hay productos para cobrar");
      return;
    }
    setShowCobrarModal(true);
  };

  const handleConfirmarCobro = (recibido, cambio) => {
    console.log(`Cobro confirmado: Recibido $${recibido.toFixed(2)}, Cambio $${cambio.toFixed(2)}`);
    setShowCobrarModal(false);
    // Llamar a la función de cobro que viene de Ventas
    if (onCobrar) {
      onCobrar();
    }
  };

  return (
    <div className="sale-summary">
      <h2>Total: ${total.toFixed(2)}</h2>

      <div className="buttons">
        <Button variant="primary" onClick={handleAbrirCobro}>  {/* ← Abre el modal de cobro */}
          Cobrar
        </Button>

        <Button variant="danger" disabled={rol !== "Admin"} onClick={() => setShowModal(true)}>
          Cancelar venta
        </Button>
      </div>

      {/* Modal de cancelar venta */}
      {showModal && (
        <Modal
          title="¿Deseas cancelar toda la venta?"
          onConfirm={handleCancelarVenta}
          onCancel={() => setShowModal(false)}
          confirmText="Sí, cancelar"
          cancelText="No"
        />
      )}

      {/* Modal de cobro */}
      {showCobrarModal && (
        <CobrarModal
          total={total}
          onConfirm={handleConfirmarCobro}
          onCancel={() => setShowCobrarModal(false)}
        />
      )}
    </div>
  );
};

export default SaleSummary;