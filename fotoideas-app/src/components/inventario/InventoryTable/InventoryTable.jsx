import TableContainer from "../../ui/TableContainer/TableContainer";
import EmptyState from "../../ui/EmptyState/EmptyState";
import "./InventoryTable.css";

const InventoryTable = ({ productos, handleAccionDesdeTabla }) => {
  if (productos.length === 0) {
    return <EmptyState message="No hay productos registrados en el inventario" />;
  }

  return (
    <TableContainer>
      <div className="inventory-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio Público</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.codigo_barras_producto || "N/A"}</td>
              <td>{p.nombre_producto}</td>
              <td>{p.categoria || "Sin categoría"}</td>
              <td>${Number(p.precio_publico || 0).toFixed(2)}</td>
              <td>
                <span className={`stock-badge ${p.stock <= 5 ? 'stock-low' : 'stock-ok'}`}>
                  {p.stock}
                </span>
              </td>
              <td>
                <span className={`status-badge ${p.estado === 'inactivo' ? 'status-inactive' : 'status-active'}`}>
                  {p.estado === 'inactivo' ? 'Inactivo' : 'Activo'}
                </span>
              </td>
              <td className="action-buttons">
                <button onClick={() => handleAccionDesdeTabla(p, "actualizar")}>Editar</button>
                <button onClick={() => handleAccionDesdeTabla(p, "borrar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </TableContainer>
  );
};

export default InventoryTable;