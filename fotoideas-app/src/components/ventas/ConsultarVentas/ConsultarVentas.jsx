import { useEffect, useState } from "react";
import "./ConsultarVentas.css"
import EmptyState from "../../ui/EmptyState/EmptyState";
import TableContainer from "../../ui/TableContainer/TableContainer";
import { obtenerVentas, cancelarVentaRealizada } from "../../../services/ventaService";

const ConsultarVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ventaACancelar, setVentaACancelar] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const data = await obtenerVentas();
      setVentas(data);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  };

  const abrirModalCancelacion = (venta) => {
    setVentaACancelar(venta);
    setMotivoCancelacion("");
    setModalVisible(true);
  };

  const confirmarCancelacion = async () => {
    if (motivoCancelacion.trim() === "") {
      alert("Debe ingresar un motivo válido para cancelar la venta.");
      return;
    }

    try {
      const usuarioLocal = JSON.parse(localStorage.getItem("user"));
      const idRol = usuarioLocal?.id_rol || 1; // Usa el rol del usuario o 1 (Admin) por defecto

      await cancelarVentaRealizada(ventaACancelar.id_venta, motivoCancelacion, idRol);
      alert("Venta eliminada del historial exitosamente");
      setModalVisible(false);
      cargarVentas(); // Recarga la tabla para desaparecer la venta
    } catch (error) {
      alert("Error al cancelar: " + error.message);
    }
  };

  if (ventas.length === 0) {
    return <EmptyState message="No hay ventas registradas" />
  }

  return (
    <>
    <TableContainer>

      <table className="sale-table">

        <thead>

          <tr>

            <th>Folio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Forma de pago</th>
            <th>Productos</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {ventas.map((v) => (

            <tr key={v.id_venta}>

              <td>{v.id_venta}</td>

              {/* Formateamos la fecha para que no traiga zonas horarias extrañas */}
              <td>{new Date(v.fecha_venta).toLocaleDateString()}</td>

              <td>{v.hora_venta}</td>

              <td>{v.forma_pago}</td>

              <td>

                <ul>
                  
                  {/* Verificamos que sea un arreglo válido antes de mapearlo */}
                  {Array.isArray(v.lista_productos) ? v.lista_productos.map((p, index) => (

                    <li key={p.codigo || index}>

                      {/* Convertimos el precio a Número seguro */}
                      {p.nombre} x {p.cantidad} - ${Number(p.precio || 0).toFixed(2)}

                    </li>

                  )) : <li>Sin detalles</li>}

                </ul>

              </td>

              {/* Convertimos todo a números antes de usar toFixed() */}
              <td>${Number(v.subtotal_venta || 0).toFixed(2)}</td>

              <td>${Number(v.impuesto_iva || 0).toFixed(2)}</td>

              <td>${Number(v.total_venta || 0).toFixed(2)}</td>

              <td>{v.estado_venta}</td>
              
              <td>
                {v.estado_venta === 'Completada' ? (
                  <button 
                    style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => abrirModalCancelacion(v)}
                    title="Eliminar del historial"
                  >
                  Eliminar del historial
                  </button>
                ) : (
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Eliminada</span>
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </TableContainer>

    {/* Modal de Cancelación (Ventana Emergente) */}
    {modalVisible && ventaACancelar && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '500px',
          maxWidth: '90%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: 'inherit'
        }}>
          {/* Encabezado del Modal */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '2px solid #f3f4f6',
            paddingBottom: '16px',
            alignItems: 'flex-start'
          }}>
            {/* Izquierda: Folio y ID */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#111827' }}>Folio</span>
              <span style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: '500' }}>ID: {ventaACancelar.id_venta}</span>
            </div>

            {/* Centro: Fecha y Hora */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>{new Date().toLocaleDateString()}</span>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{new Date().toLocaleTimeString()}</span>
            </div>

            {/* Derecha: Estado */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{
                backgroundColor: ventaACancelar.estado_venta === 'Completada' ? '#dcfce7' : '#fee2e2',
                color: ventaACancelar.estado_venta === 'Completada' ? '#166534' : '#991b1b',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {ventaACancelar.estado_venta}
              </span>
            </div>
          </div>
          
          {/* Cuerpo: Motivo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>Motivo de la cancelación:</label>
            <textarea 
              value={motivoCancelacion}
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              placeholder="Escribe el motivo detallado por el cual se elimina del historial..."
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'none', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
              autoFocus
            />
          </div>

          {/* Pie: Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button 
              onClick={() => setModalVisible(false)}
              style={{ backgroundColor: '#ef4444', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
            >
              Cancelar
            </button>
            <button 
              onClick={confirmarCancelacion}
              style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );

};

export default ConsultarVentas;