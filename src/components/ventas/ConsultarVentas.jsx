import "../../styles/ventas.css";

const ConsultarVentas = ({ ventas }) => {
  if (ventas.length === 0) {
    return <p>No hay ventas registradas</p>;
  }

  return (
    <div className="consultar-ventas">
      <h3>Consultar Ventas</h3>
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
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.fecha_venta}</td>
              <td>{v.hora_venta}</td>
              <td>{v.forma_pago}</td>
              <td>
                <ul>
                  {v.lista_productos.map((p) => (
                    <li key={p.codigo}>
                      {p.nombre} x {p.cantidad} - ${p.precio.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
              <td>${v.subtotal_venta.toFixed(2)}</td>
              <td>${v.Impuesto_iva.toFixed(2)}</td>
              <td>${v.total_venta.toFixed(2)}</td>
              <td>{v.estado_venta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultarVentas;