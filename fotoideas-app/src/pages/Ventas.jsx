import { useState } from "react";

import "../styles/Ventas.css";

import SaleHeader from "../components/ventas/SaleHeader/SaleHeader"
import ScannerInput from "../components/ventas/ScannerInput/ScannerInput";
import SaleTable from "../components/ventas/SaleTable/SaleTable";
import PaymentPanel from "../components/ventas/PaymentPanel/PaymentPanel";
import SaleSummary from "../components/ventas/SaleSummary/SaleSummary";
import SaleTicket from "../components/ventas/SaleTicket/SaleTicket";
import ConsultarVentas from "../components/ventas/ConsultarVentas/ConsultarVentas";

import PageContainer from "../components/ui/PageContainer/PageContainer";
import Section from "../components/ui/Section/Section";
import Button from "../components/ui/Button/Button";


const Ventas = () => {

  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [tab, setTab] = useState("registrar");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  //const rol = localStorage.getItem("rol");

  // para pruebas remotas
  const productosDB = {
    "123": { nombre: "Coca Cola", precio: 10 },
    "456": { nombre: "Pan", precio: 15 },
    "789": { nombre: "Leche", precio: 20 }
  };


  const subtotal = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );


  const iva = subtotal * 0.16;

  const total = subtotal + iva;

  const handleAddProduct = (codigo) => {

    const producto = productosDB[codigo];
    if (!producto) return alert("Producto no encontrado");

    const existe = productos.find(
      (p) => p.codigo === codigo
    );

    if (existe) {
      setProductos(
        productos.map((p) =>
          p.codigo === codigo
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    }else {
      setProductos([...productos,{
          codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1
        }
      ]);
    }
  };


  const handleGenerarTicket = () => {
    const now = new Date();

    const nuevaVenta = {
      id_venta: ventas.length + 1,
      fecha_venta: now.toLocaleDateString(),
      hora_venta: now.toLocaleTimeString(),
      forma_pago: paymentMethod,
      lista_productos: productos,
      subtotal_venta: subtotal,
      Impuesto_iva: iva,
      total_venta: total,
      estado_venta: "Realizada"
    };


    setVentas([...ventas, nuevaVenta]);
    setProductos([]);
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

        </div>
        <br />

      {tab === "registrar" && (
        <>
          <Section>
            <ScannerInput onAdd={handleAddProduct} />
          </Section>

          <Section title="Detalle venta">
            <div className="ventas-grid">

              <SaleTable productos={productos} setProductos={setProductos} />

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
                />

                <SaleTicket productos={productos} onGenerarTicket={handleGenerarTicket} />

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
    </PageContainer>
  );
};

export default Ventas;