import TableContainer from "../../ui/TableContainer/TableContainer";
import EmptyState from "../../ui/EmptyState/EmptyState";
import "./UserTable.css";

const UserTable = ({ usuarios, handleAccionDesdeTabla }) => {
  if (!usuarios || usuarios.length === 0) {
    return <EmptyState message="No hay usuarios registrados en el sistema" />;
  }

  return (
    <TableContainer>
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id_empleado}>
                <td>{user.id_empleado}</td>
                <td><strong>{user.nombre_empleado}</strong></td>
                <td>{user.username}</td>
                <td>{user.nombre_rol || "Sin asignar"}</td>
                <td>{user.telefono_empleado || "N/A"}</td>
                <td>
                  <span className={`status-badge ${user.estado_credencial ? 'status-active' : 'status-inactive'}`}>
                    {user.estado_credencial ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button onClick={() => handleAccionDesdeTabla(user, "actualizar")}>Editar</button>
                  <button onClick={() => handleAccionDesdeTabla(user, "borrar")}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableContainer>
  );
};

export default UserTable;