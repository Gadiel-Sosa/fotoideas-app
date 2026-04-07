import { useState } from "react";

import "../../styles/ventas.css";

import TableContainer from "../ui/TableContainer";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import EmptyState from "../ui/EmptyState";


const SaleTable = ({productos, setProductos}) =>{

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);


  const handleEliminar = () => {
    const nuevos = productos.filter(
      (p) => p.codigo !== productoSeleccionado.codigo
    );

    setProductos(nuevos);
    setProductoSeleccionado(null);
  }


  if (productos.length === 0) {
    return (
      <EmptyState message="No hay productos en la venta" />
    )
  }


  return (

    <TableContainer>
      <table className="sale-table">
        <thead>
          <tr>

            <th>Producto</th>
            <th>Cant</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th>Acción</th>

          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (

            <tr key={p.codigo}>

              <td>{p.nombre}</td>

              <td>{p.cantidad}</td>

              <td>${p.precio.toFixed(2)}</td>

              <td>${(p.precio * p.cantidad).toFixed(2)}</td>

              <td>

                <Button variant="danger" onClick={() => setProductoSeleccionado(p)}>
                  Eliminar
                </Button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {productoSeleccionado && (

        <Modal

          title="¿Eliminar producto de la venta?"

          message={`Eliminar ${productoSeleccionado.nombre}`}

          confirmText="Eliminar"

          cancelText="Cancelar"

          onConfirm={handleEliminar}

          onCancel={() => setProductoSeleccionado(null)}

        />

      )}

    </TableContainer>

  )

}

export default SaleTable