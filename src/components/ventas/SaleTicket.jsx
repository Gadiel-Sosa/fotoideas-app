import "../../styles/ventas.css";

const SaleTicket = ({ productos, onGenerarTicket }) => {
  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <div className="sale-ticket-container">
      <h3>Ticket</h3>

      {productos.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <>
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.codigo}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>${(p.precio * p.cantidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>IVA (16%): ${iva.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>

          <button className="btn-generar-ticket" onClick={onGenerarTicket}>
            Generar Ticket
          </button>
        </>
      )}
    </div>
  );
};

export default SaleTicket;