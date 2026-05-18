import TableContainer from "../../ui/TableContainer/TableContainer";
import EmptyState from "../../ui/EmptyState/EmptyState";
import "./ProviderTable.css";

const ProviderTable = ({ proveedores, handleAccionDesdeTabla }) => {
  if (proveedores.length === 0) {
    return <EmptyState message="No hay proveedores registrados en el catálogo" />;
  }

  return (
    <TableContainer>
      <div className="inventory-table">
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empresa</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>RFC</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov) => (
            <tr key={prov.id_proveedor}>
              <td>{prov.id_proveedor}</td>
              <td><strong>{prov.nombre_empresa || 'Sin registro aún'}</strong></td>
              <td>{prov.nombre_proveedor}</td>
              <td>{prov.telefono_proveedor || 'N/A'}</td>
              <td>{prov.rfc_proveedor}</td>
              <td>
                <span className={`status-badge ${(prov.estado || 'Activo').toLowerCase() === 'inactivo' ? 'status-inactive' : 'status-active'}`}>
                  {(prov.estado || 'Activo').toLowerCase() === 'inactivo' ? 'Inactivo' : 'Activo'}
                </span>
              </td>
              <td className="action-buttons">
                <button onClick={() => handleAccionDesdeTabla(prov, "actualizar")}>Editar</button>
                <button onClick={() => handleAccionDesdeTabla(prov, "borrar")}>Eliminar</button>
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