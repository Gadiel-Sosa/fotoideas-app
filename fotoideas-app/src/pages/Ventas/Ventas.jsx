import { useState } from "react";

import "../Ventas/Ventas.css";

import SaleHeader from "../../components/ventas/SaleHeader/SaleHeader";
import ScannerInput from "../../components/ventas/ScannerInput/ScannerInput";
import SaleTable from "../../components/ventas/SaleTable/SaleTable";
import PaymentPanel from "../../components/ventas/PaymentPanel/PaymentPanel";
import SaleSummary from "../../components/ventas/SaleSummary/SaleSummary";
import ConsultarVentas from "../../components/ventas/ConsultarVentas/ConsultarVentas";
import CorteCaja from "../../components/ventas/CorteCaja/CorteCaja";
import ConsultarCorteCaja from "../../components/ventas/ConsultarCorteCaja/ConsultarCorteCaja";

import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import Header from "../../components/layout/Header/Header";

import { getProductoPorCodigo } from "../../services/productService";

const Ventas = () => {

  // hooks de react (creamos el estado-evento)
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [tab, setTab] = useState("registrar");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [search, setSearch] = useState("");


  // AGREGAR PRODUCTO POR CÓDIGO DE BARRAS
  const handleAddProduct = async (codigo) => {
    if (!codigo || codigo.trim() === "") {
      return;
    }

    try {
      const producto = await getProductoPorCodigo(codigo);

      // Verificar si el producto existe
      if (!producto) {
        alert("Producto no encontrado");
        return;
      }

      // Emitir un sonido de "Beep" exitoso
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880 Hz = Tono agudo clásico de POS
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1); // Dura 0.1 segundos
      } catch (e) {
        console.log("Audio no soportado o bloqueado");
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
  };

  return (
    <>
      <Header
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

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

          <Button
            variant={tab === "Consultarcorte" ? "primary" : "secondary"}
            onClick={() => setTab("Consultarcorte")}
          >
            Corte de Caja
          </Button>

        </div>

        <br />

        {tab === "registrar" && (
          <>
            <Section>
              <ScannerInput onScan={handleAddProduct} />
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

        {tab === "consultarcorte" && (
          <Section>
            <ConsultarCorteCaja />
          </Section>
        )}
      </PageContainer>
    </>
  )
}

export default Ventas