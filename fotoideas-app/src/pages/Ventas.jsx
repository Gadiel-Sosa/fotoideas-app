import { useState } from "react";

import "../styles/Ventas.css";

import SaleHeader from "../components/ventas/SaleHeader/SaleHeader";
import ScannerInput from "../components/ventas/ScannerInput/ScannerInput";
import SaleTable from "../components/ventas/SaleTable/SaleTable";
import PaymentPanel from "../components/ventas/PaymentPanel/PaymentPanel";
import SaleSummary from "../components/ventas/SaleSummary/SaleSummary";
import SaleTicket from "../components/ventas/SaleTicket/SaleTicket";
import ConsultarVentas from "../components/ventas/ConsultarVentas/ConsultarVentas";
import CorteCaja from "../components/ventas/CorteCaja/CorteCaja";

import PageContainer from "../components/ui/PageContainer/PageContainer";
import Section from "../components/ui/Section/Section";
import Button from "../components/ui/Button/Button";

import { getProductoPorCodigo } from "../services/productService";

const Ventas = () => {

  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [tab, setTab] = useState("registrar");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");

  // AGREGAR PRODUCTO POR CÓDIGO DE BARRAS
  const handleAddProduct = async (codigo) => {
    if (!codigo || codigo.trim() === "") {
      alert("Por favor ingrese un código válido");
      return;
    }

    try {
      const producto = await getProductoPorCodigo(codigo);

      // Verificar si el producto existe
      if (!producto) {
        alert("Producto no encontrado");
        return;
      }

      const existe = productos.find(
        (p) => p.codigo === producto.codigo_barras_producto
      );

      if (existe) {
        setProductos(
          productos.map((p) =>
            p.codigo === producto.codigo_barras_producto
              ? { ...p, cantidad: p.cantidad + 1 }
              : p
          )
        );
      } else {
        setProductos([
          ...productos,
          {
            codigo: producto.codigo_barras_producto,
            nombre: producto.nombre_producto,
            precio: Number(producto.precio_venta),
            cantidad: 1
          }
        ]);
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
      alert(error.message || "Producto no encontrado");
    }
  };

  // Cálculos
  const subtotal = productos.reduce(
    (acc, p) => acc + (p.precio * p.cantidad),
    0
  );

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  // Generar ticket
  const handleGenerarTicket = () => {
    if (productos.length === 0) {
      alert("No hay productos en la venta");
      return;
    }

    const now = new Date();

    const nuevaVenta = {
      id_venta: ventas.length + 1,
      fecha_venta: now.toLocaleDateString(),
      hora_venta: now.toLocaleTimeString(),
      forma_pago: paymentMethod,
      lista_productos: [...productos],
      subtotal_venta: subtotal,
      impuesto_iva: iva,
      total_venta: total,
      estado_venta: "Realizada"
    };

    setVentas([...ventas, nuevaVenta]);
    setProductos([]);
    alert("Venta registrada exitosamente");
  };

  return (
    <PageContainer>
      <SaleHeader
        saleNumber={ventas.length + 1}
        date={new Date().toLocaleDateString()}
        time={new Date().toLocaleTimeString()}
      />

      <br />

      <div className="tabs">
        <Button
          variant={tab === "registrar" ? "primary" : "secondary"}
          onClick={() => setTab("registrar")}
        >
          Registrar Venta
        </Button>

        <Button
          variant={tab === "consultar" ? "primary" : "secondary"}
          onClick={() => setTab("consultar")}
        >
          Consultar Ventas
        </Button>



        <Button
          variant={tab === "corte" ? "primary" : "secondary"}
          onClick={() => setTab("corte")}
        >
          Corte de Caja
        </Button>
      </div>

      <br />

      {tab === "registrar" && (
        <>
          <Section>
            <ScannerInput onAdd={handleAddProduct} />
          </Section>

          <Section title="Detalle venta">
            <div className="ventas-grid">
              <SaleTable
                productos={productos}
                setProductos={setProductos}
              />

              <div className="right-panel">
                <PaymentPanel
                  cashier="Admin"
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />

                <SaleSummary
  productos={productos}
  setProductos={setProductos}
  rol="Admin"
  onCobrar={handleGenerarTicket}
/>

                <SaleTicket
                  productos={productos}
                  onGenerarTicket={handleGenerarTicket}
                />
              </div>
            </div>
          </Section>
        </>
      )}

      {tab === "consultar" && (
        <Section>
          <ConsultarVentas ventas={ventas} />
        </Section>
      )}

      {tab === "corte" && (
  <Section>
    <CorteCaja />
  </Section>
)}
    </PageContainer>
  );
};

export default Ventas;