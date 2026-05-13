import { useState } from "react";

import "./SaleTable.css";

import TableContainer from "../../ui/TableContainer/TableContainer";
import Button from "../../ui/Button/Button";
import Modal from "../../ui/Modal/Modal";
import EmptyState from "../../ui/EmptyState/EmptyState";

const SaleTable = ({ productos = [], setProductos }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const handleEliminar = () => {
    if (!productoSeleccionado) return;
    
    const nuevos = productos.filter(
      (p) => p.codigo !== productoSeleccionado.codigo
    );

    setProductos(nuevos);
    setProductoSeleccionado(null);
  };

  // Botón +
  const incrementarCantidad = (codigo) => {
    setProductos(
      productos.map((p) =>
        p.codigo === codigo ? { ...p, cantidad: obtenerCantidad(p.cantidad) + 1 } : p
      )
    );
  };

  // Botón -
  const disminuirCantidad = (codigo) => {
    setProductos(
      productos.map((p) => {
        if (p.codigo === codigo) {
          const nuevaCantidad = obtenerCantidad(p.cantidad) - 1;
          return { ...p, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 }; // Evita bajar de 1
        }
        return p;
      })
    );
  };

  if (!Array.isArray(productos) || productos.length === 0) {
    return <EmptyState message="No hay productos en la venta" />;
  }

  // Función segura para formatear precio
  const formatearPrecio = (precio) => {
    const num = typeof precio === 'number' ? precio : parseFloat(precio);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Función segura para obtener cantidad
  const obtenerCantidad = (cantidad) => {
    const num = typeof cantidad === 'number' ? cantidad : parseInt(cantidad);
    return isNaN(num) ? 0 : num;
  };

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
          {productos.map((p, index) => {
            // Validar y obtener valores seguros
            const nombre = p?.nombre || "Producto sin nombre";
            const cantidad = obtenerCantidad(p?.cantidad);
            const precio = parseFloat(p?.precio) || 0;
            const subtotal = precio * cantidad;

            return (
              <tr key={p?.codigo || index}>
                <td>{nombre}</td>
                <td style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                  <button 
                    onClick={() => disminuirCantidad(p.codigo)}
                    style={{ width: "28px", height: "28px", cursor: "pointer", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px", fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>
                    {cantidad}
                  </span>
                  <button 
                    onClick={() => incrementarCantidad(p.codigo)}
                    style={{ width: "28px", height: "28px", cursor: "pointer", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px", fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
                  >
                    +
                  </button>
                </td>
                <td>${formatearPrecio(precio)}</td>
                <td>${formatearPrecio(subtotal)}</td>
                <td>
                  <Button 
                    variant="danger" 
                    onClick={() => setProductoSeleccionado(p)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {productoSeleccionado && (
        <Modal
          title="¿Eliminar producto de la venta?"
          message={`Eliminar ${productoSeleccionado.nombre || "este producto"}?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleEliminar}
          onCancel={() => setProductoSeleccionado(null)}
        />
      )}
    </TableContainer>
  );
};

export default SaleTable;