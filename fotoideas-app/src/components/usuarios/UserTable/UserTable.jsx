import "./UserTable.css";
import TableContainer from "../../ui/TableContainer/TableContainer";
import Button from "../../ui/Button/Button";
import EmptyState from "../../ui/EmptyState/EmptyState";

const UserTable = ({ usuarios, handleAccionDesdeTabla }) => {
  
  if (!usuarios || usuarios.length === 0) {
    return <EmptyState message="No hay usuarios registrados" />;
  }

  return (
    <TableContainer>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Empleado</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_empleado}>
              <td className="text-gray">{u.id_empleado}</td>
              <td className="text-dark">{u.nombre_empleado}</td>
              <td className="text-gray-dark">{u.username || "Sin credencial"}</td>
              <td className="text-gray-dark">{u.nombre_rol || "Sin rol"}</td>
              <td>
                <span className={`status-badge ${u.estado_credencial ? 'status-active' : 'status-inactive'}`}>
                  {u.estado_credencial ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="action-buttons">
                <Button variant="secondary" onClick={() => handleAccionDesdeTabla(u, "actualizar")}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleAccionDesdeTabla(u, "borrar")}>
                  Baja
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
};

export default UserTable;