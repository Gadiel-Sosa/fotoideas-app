import { useState } from "react";

import "./SaleSummary.css";

import Button from "../../ui/Button/Button";
import PinModal from "../../ui/PinModal/PinModal";

import CobrarModal from "../CobrarModal/CobrarModal";
import CancelSaleModal from "../CancelSaleModal/CancelSaleModal";
import TicketPromptModal from "../TicketPromtModal/TicketPromtModal";
import TicketModal from "../TicketModal/TicketModal";

import { registrarVenta } from "../../../services/ventaService";

const SaleSummary = ({
  productos,
  setProductos,
  rol,
  onCobrar
}) => {

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [showPinModal, setShowPinModal] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");

  const [showCobrarModal, setShowCobrarModal] = useState(false);

  const [showTicketPrompt, setShowTicketPrompt] = useState(false);

  const [showTicket, setShowTicket] = useState(false);

  const [ticketData, setTicketData] = useState(null);

  const subtotal = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const iva = subtotal * 0.16;

  const total = subtotal + iva;

  const handleAbrirCobro = () => {

    if (productos.length === 0) {

      alert("No hay productos para cobrar");

      return;
    }

    setShowCobrarModal(true);
  };

  const handleAbrirPin = () => {

    setShowCancelModal(false);

    if (rol === "Admin" || rol === "Administrador") {
      cancelarVentaDirecta();
    } else {
      setShowPinModal(true);
    }
  };

  const cancelarVentaDirecta = () => {
    setProductos([]);
    setAdminPassword("");
    setShowPinModal(false);
    alert("Venta cancelada correctamente");
  };

  const handleCancelarVenta = async () => {

    if (!adminPassword.trim()) {

      alert("Ingrese el PIN de seguridad");

      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPassword })
      });
      const data = await response.json();
      
      if (data.success) {
        cancelarVentaDirecta();
      } else {
        alert("PIN incorrecto o no tiene permisos de administrador.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al verificar el PIN.");
    }
  };

  const handleConfirmarCobro = async (
    recibido,
    cambio
  ) => {

    try {

      const usuarioLocal = JSON.parse(
        localStorage.getItem("user")
      );

      const corteResponse = await fetch(
        `http://localhost:3000/api/corte/datos?id_empleado=${
          usuarioLocal
            ? usuarioLocal.id_empleado
            : 1
        }`
      );

      const corteData =
        await corteResponse.json();

      const idCorteActivo =
        corteData.success &&
        corteData.datos.id_corte
          ? corteData.datos.id_corte
          : 1;

      const nuevaVenta = {

        id_corte_caja: idCorteActivo,

        id_empleado: usuarioLocal
          ? usuarioLocal.id_empleado
          : 1,

        total_venta: total,

        forma_pago: "Efectivo",

        productos
      };

      await registrarVenta(nuevaVenta);

      setTicketData({

        recibido,

        cambio,

        total,

        subtotal,

        iva,

        productosGuardados: [...productos],

        fecha:
          new Date().toLocaleDateString(),

        hora:
          new Date().toLocaleTimeString()
      });

      setShowCobrarModal(false);

      setShowTicketPrompt(true);

    } catch (error) {

      console.error(error);

      alert(
        "Error al guardar venta"
      );
    }
  };

  return (

    <div className="sale-summary">

      <h2>
        Total: ${total.toFixed(2)}
      </h2>

      <div className="sale-summary-buttons">

        <Button
          variant="primary"
          onClick={handleAbrirCobro}
        >
          Cobrar
        </Button>

        <Button
          variant="danger"
          onClick={() =>
            setShowCancelModal(true)
          }
        >
          Cancelar venta
        </Button>

      </div>

      <CancelSaleModal
        visible={showCancelModal}
        productos={productos}
        onCancel={() =>
          setShowCancelModal(false)
        }
        onConfirm={handleAbrirPin}
      />

      <PinModal
        visible={showPinModal}
        password={adminPassword}
        setPassword={setAdminPassword}
        onCancel={() => {

          setShowPinModal(false);

          setAdminPassword("");
        }}
        onConfirm={handleCancelarVenta}
      />

      {showCobrarModal && (

        <CobrarModal
          total={total}
          onConfirm={
            handleConfirmarCobro
          }
          onCancel={() =>
            setShowCobrarModal(false)
          }
        />
      )}

      <TicketPromptModal
        visible={showTicketPrompt}
        onClose={() => {

          setShowTicketPrompt(false);

          if (onCobrar) {

            onCobrar();
          }
        }}
        onGenerate={() => {

          setShowTicketPrompt(false);

          setShowTicket(true);
        }}
      />

      <TicketModal
        visible={showTicket}
        ticketData={ticketData}
        onClose={() => {

          setShowTicket(false);

          if (onCobrar) {

            onCobrar();
          }
        }}
      />

    </div>
  );
};

export default SaleSummary