import TableContainer from "../../ui/TableContainer/TableContainer";
import EmptyState from "../../ui/EmptyState/EmptyState";
import "../../inventario/InventoryTable/InventoryTable.css"; // Reutilizamos estilos

const ProviderTable = ({ proveedores, handleAccionDesdeTabla }) => {
  if (!proveedores || proveedores.length === 0) {
    return <EmptyState message="No hay proveedores registrados en el sistema" />;
  }

  return (
    <TableContainer>
      <div className="inventory-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Contacto</th>
            <th>Empresa</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>RFC</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id_proveedor}>
              <td>{p.id_proveedor}</td>
              <td style={{ fontWeight: 'bold' }}>{p.nombre_proveedor}</td>
              <td>{p.nombre_empresa || "N/A"}</td>
              <td>{p.telefono_proveedor || "N/A"}</td>
              <td>{p.correo_proveedor || "N/A"}</td>
              <td>{p.rfc_proveedor || "N/A"}</td>
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

export default ProviderTable;