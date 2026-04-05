import { useState } from "react";

export default function SaleSummary({ productos, setProductos }) {
  const rol = localStorage.getItem("rol"); // admin o usuario
  const [showModal, setShowModal] = useState(false);

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const handleCancelarVenta = () => {
    setProductos([]); // limpia toda la venta
    setShowModal(false);
  };

  return (
    <div className="sale-summary">
      <h2>Total: ${total}</h2>

      <div className="buttons">
        <button className="btn-primary">Cobrar</button>

        {rol === "admin" ? (
          <button className="btn-danger" onClick={() => setShowModal(true)}>
            Cancelar venta
          </button>
        ) : (
          <button className="btn-danger" disabled title="Solo admin">
            Cancelar venta
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¿Deseas cancelar toda la venta?</h3>
            <div className="modal-buttons">
              <button onClick={handleCancelarVenta}>Sí, cancelar</button>
              <button onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}