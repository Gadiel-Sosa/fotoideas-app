import { useState } from "react";
import "../styles/ventas.css";

import SaleHeader from "../components/ventas/SaleHeader";
import ScannerInput from "../components/ventas/ScannerInput";
import SaleTable from "../components/ventas/SaleTable";
import PaymentPanel from "../components/ventas/PaymentPanel";
import SaleSummary from "../components/ventas/SaleSummary";
import SaleTicket from "../components/ventas/SaleTicket";
import ConsultarVentas from "../components/ventas/ConsultarVentas";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]); //  ventas registradas
  const [tab, setTab] = useState("registrar"); // pestaña activa

  const productosDB = {
    "123": { nombre: "Coca Cola", precio: 10 },
    "456": { nombre: "Pan", precio: 15 },
    "789": { nombre: "Leche", precio: 20 },
  };

  const handleAddProduct = (codigo) => {
    const producto = productosDB[codigo];
    if (!producto) return alert("Producto no encontrado");

    const existe = productos.find((p) => p.codigo === codigo);
    if (existe) {
      const nuevos = productos.map((p) =>
        p.codigo === codigo ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setProductos(nuevos);
    } else {
      setProductos([...productos, { codigo, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }]);
    }
  };

  const handleGenerarTicket = () => {
    const now = new Date();
    const nuevaVenta = {
      id_venta: ventas.length + 1,
      fecha_venta: now.toLocaleDateString(),
      hora_venta: now.toLocaleTimeString(),
      forma_pago: "Efectivo",
      lista_productos: productos,
      subtotal_venta: productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
      Impuesto_iva: productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0) * 0.16,
      total_venta: productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0) * 1.16,
      estado_venta: "Realizada",
    };
    setVentas([...ventas, nuevaVenta]);
    setProductos([]);
    alert("Venta registrada y ticket generado");
  };

  return (
    <div className="ventas-container">
      <SaleHeader />

      {/* Pestañas */}
      <div className="tabs">
        <button className={tab === "registrar" ? "btn-primary" : ""} onClick={() => setTab("registrar")}>Registrar Venta</button>
        <button className={tab === "consultar" ? "btn-primary" : ""} onClick={() => setTab("consultar")}>Consultar Ventas</button>
      </div>

      {tab === "registrar" && (
        <>
          <ScannerInput onAdd={handleAddProduct} />

          <div className="ventas-grid">
            <SaleTable productos={productos} setProductos={setProductos} />

            <div className="right-panel">
              <PaymentPanel />
              <SaleSummary productos={productos} setProductos={setProductos} />
              <SaleTicket productos={productos} onGenerarTicket={handleGenerarTicket} />
            </div>
          </div>
        </>
      )}

      {tab === "consultar" && <ConsultarVentas ventas={ventas} />}
    </div>
  );
};

export default Ventas;