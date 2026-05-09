import TableContainer from "../../ui/TableContainer/TableContainer";
import EmptyState from "../../ui/EmptyState/EmptyState";

const InventoryTable = ({ productos, handleAccionDesdeTabla }) => {
  if (productos.length === 0) {
    return <EmptyState message="No hay productos registrados en el inventario" />;
  }

  return (
    <TableContainer>
      <table className="sale-table">
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
                <span style={{ fontWeight: 'bold', color: p.stock <= 5 ? '#ef4444' : '#10b981' }}>
                  {p.stock}
                </span>
              </td>
              <td>
                <span style={{ 
                  backgroundColor: p.estado === 'inactivo' ? '#fee2e2' : '#dcfce7',
                  color: p.estado === 'inactivo' ? '#991b1b' : '#166534',
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' 
                }}>
                  {p.estado === 'inactivo' ? 'Inactivo' : 'Activo'}
                </span>
              </td>
              <td style={{ display: 'flex', gap: '8px' }}>
                <button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleAccionDesdeTabla(p, "actualizar")}>Editar</button>
                <button style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleAccionDesdeTabla(p, "borrar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
};

export default InventoryTable;