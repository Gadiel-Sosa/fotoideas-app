import { useEffect, useState } from "react";
import "./ConsultarVentas.css"
import EmptyState from "../../ui/EmptyState/EmptyState";
import TableContainer from "../../ui/TableContainer/TableContainer";
import { obtenerVentas, cancelarVentaRealizada } from "../../../services/ventaService";

const ConsultarVentas = () => {
  const [ventas, setVentas] = useState([]);

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

  const handleCancelar = async (idVenta) => {
    if (window.confirm("¿Estás seguro de cancelar y eliminar esta venta?")) {
      try {
        await cancelarVentaRealizada(idVenta);
        alert("Venta cancelada exitosamente");
        cargarVentas(); // Recarga la tabla para desaparecer la venta
      } catch (error) {
        alert("Error al cancelar: " + error.message);
      }
    }
  };

  if (ventas.length === 0) {
    return <EmptyState message="No hay ventas registradas" />
  }

  return (

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
                <button 
                  style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => handleCancelar(v.id_venta)}
                  title="Anular venta"
                >
                  Cancelar Venta
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </TableContainer>

  );

};

export default ConsultarVentas;