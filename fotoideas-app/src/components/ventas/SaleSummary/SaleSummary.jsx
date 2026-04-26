import { useState } from "react";

import "./SaleSummary.css";

import Button from "../../ui/Button/Button";
import Modal from "../../ui/Modal/Modal";
import CobrarModal from "../CobrarModal/CobrarModal"; // ← Importar el nuevo modal
import { registrarVenta } from "../../../services/ventaService";

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

  const handleConfirmarCobro = async (recibido, cambio) => {
    console.log(`Cobro confirmado: Recibido $${recibido.toFixed(2)}, Cambio $${cambio.toFixed(2)}`);
    
    try {
      const usuarioLocal = JSON.parse(localStorage.getItem("user"));
      
      // Consultamos al backend cuál es el turno (corte) que está activo en este momento
      const corteResponse = await fetch("http://localhost:3000/api/corte/datos");
      const corteData = await corteResponse.json();
      const idCorteActivo = corteData.success && corteData.datos.id_corte ? corteData.datos.id_corte : 1;

      const nuevaVenta = {
        id_corte_caja: idCorteActivo, // Asigna la venta al turno real abierto
        id_empleado: usuarioLocal ? usuarioLocal.id_empleado : 1,
        total_venta: total,
        forma_pago: "Efectivo", 
        productos: productos // Tus productos del carrito
      };

      // Guardamos la venta en la BD de PostgreSQL
      await registrarVenta(nuevaVenta);
      alert("Venta guardada en la base de datos con éxito.");
      
      setShowCobrarModal(false);
      setProductos([]); // Esto vacía el carrito visual para la siguiente venta
      
      if (onCobrar) onCobrar();
      
    } catch (error) {
      console.error("Error al guardar venta:", error);
      alert("Error al guardar la venta: " + error.message);
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