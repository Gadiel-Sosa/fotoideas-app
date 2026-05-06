import { useState } from "react";

import "./SaleSummary.css";

import Button from "../../ui/Button/Button";
import CobrarModal from "../CobrarModal/CobrarModal"; // ← Importar el nuevo modal
import { registrarVenta } from "../../../services/ventaService";

const SaleSummary = ({ productos, setProductos, rol, onCobrar }) => {

  const [showModal, setShowModal] = useState(false);
  const [showCobrarModal, setShowCobrarModal] = useState(false); // ← Estado para modal de cobro
  const [showTicketPrompt, setShowTicketPrompt] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

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
      
      // Preparamos los datos del ticket por si el usuario decide generarlo
      setTicketData({
        recibido, cambio, total, subtotal, iva,
        productosGuardados: [...productos],
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString()
      });

      setShowCobrarModal(false);
      setShowTicketPrompt(true); // Lanzamos la pregunta del ticket
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
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '24px',
            width: '500px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit'
          }}>
            {/* Encabezado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f3f4f6', paddingBottom: '16px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#111827' }}>Venta Actual</span>
                <span style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: '500' }}>Carrito de compras</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#374151' }}>{new Date().toLocaleDateString()}</span>
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{new Date().toLocaleTimeString()}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  En proceso
                </span>
              </div>
            </div>
            
            {/* Cuerpo sin el textarea, solo confirmación */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center', margin: '10px 0' }}>
              <h3 style={{ margin: 0, color: '#111827' }}>¿Deseas cancelar esta venta?</h3>
              <p style={{ margin: 0, color: '#4b5563' }}>Se vaciará el carrito con <strong>{productos.length}</strong> producto(s). ¿Está seguro?</p>
            </div>

            {/* Pie con los botones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setShowModal(false)} style={{ backgroundColor: '#ef4444', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
                Cancelar
              </button>
              <button onClick={handleCancelarVenta} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cobro */}
      {showCobrarModal && (
        <CobrarModal
          total={total}
          onConfirm={handleConfirmarCobro}
          onCancel={() => setShowCobrarModal(false)}
        />
      )}

      {/* Modal de Pregunta: ¿Imprimir Ticket? */}
      {showTicketPrompt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '24px',
            width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', fontFamily: 'inherit'
          }}>
            <h3 style={{ margin: 0, color: '#111827', fontSize: '1.4rem' }}>¡Venta Exitosa!</h3>
            <p style={{ margin: 0, color: '#4b5563' }}>La venta se ha registrado correctamente en el sistema.</p>
            <p style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.1rem' }}>¿Deseas generar e imprimir el ticket?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => {
                  setShowTicketPrompt(false);
                  if (onCobrar) onCobrar();
                }}
                style={{ backgroundColor: '#6b7280', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
              >
                No, continuar
              </button>
              <button
                onClick={() => {
                  setShowTicketPrompt(false);
                  setShowTicket(true);
                }}
                style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
              >
                Sí, generar ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Ticket Visual */}
      {showTicket && ticketData && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '8px', padding: '24px',
            width: '350px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'monospace'
          }}>
            {/* Contenido del Ticket */}
            <div id="ticket-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#000' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '12px' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem' }}>FOTO IDEAS</h2>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Ticket de Venta</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{ticketData.fecha} - {ticketData.hora}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 0', borderBottom: '1px dashed #ccc' }}>
                {ticketData.productosGuardados.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ flex: 1, paddingRight: '10px' }}>{p.cantidad}x {p.nombre}</span>
                    <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '8px', fontSize: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span>${ticketData.subtotal.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>IVA (16%):</span><span>${ticketData.iva.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.15rem' }}><span>TOTAL:</span><span>${ticketData.total.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Efectivo:</span><span>${ticketData.recibido.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cambio:</span><span>${ticketData.cambio.toFixed(2)}</span></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}><p style={{ margin: 0 }}>¡Gracias por su compra!</p></div>
            </div>
            {/* Botones del Ticket */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={() => { setShowTicket(false); if (onCobrar) onCobrar(); }}
                style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}
              >Cerrar</button>
              <button
                onClick={() => {
                  const printContent = document.getElementById('ticket-content').innerHTML;
                  const printWindow = window.open('', '', 'width=400,height=600');
                  printWindow.document.write('<html><head><title>Ticket de Venta</title><style>body { font-family: monospace; padding: 20px; color: black; }</style></head><body>');
                  printWindow.document.write(printContent);
                  printWindow.document.write('</body></html>');
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }}
                style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}
              >Imprimir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleSummary;