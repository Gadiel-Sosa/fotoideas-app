import "../../styles/ventas.css";

import TableContainer from "../ui/TableContainer";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";


const SaleTicket = ({productos, onGenerarTicket}) => {

  const subtotal = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const iva = subtotal * 0.16;

  const total = subtotal + iva;


  if (productos.length === 0) {
    return (
      <EmptyState message="No hay productos en la venta" />
    )
  }


  return (

    <div className="sale-ticket-container">

      <h3>Ticket</h3>

      <TableContainer>

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

      </TableContainer>


      <div className="ticket-summary">

        <p>Subtotal: ${subtotal.toFixed(2)}</p>

        <p>IVA (16%): ${iva.toFixed(2)}</p>

        <p>Total: ${total.toFixed(2)}</p>

      </div>


      <Button variant="primary"  onClick={onGenerarTicket}>
        Generar Ticket
      </Button>

    </div>

  )
}

export default SaleTicket;