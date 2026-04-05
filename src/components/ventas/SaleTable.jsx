import "../../styles/ventas.css";

export default function SaleTable({ productos, setProductos }) {
  const handleEliminar = (codigo) => {
    const nuevos = productos.filter((p) => p.codigo !== codigo);
    setProductos(nuevos);
  };

  return (
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
        {productos.length === 0 ? (
          <tr>
            <td colSpan="5">No hay productos</td>
          </tr>
        ) : (
          productos.map((p) => (
            <tr key={p.codigo}>
              <td>{p.nombre}</td>
              <td>{p.cantidad}</td>
              <td>${p.precio.toFixed(2)}</td>
              <td>${(p.precio * p.cantidad).toFixed(2)}</td>
              <td>
                <button className="btn-eliminar" onClick={() => handleEliminar(p.codigo)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}