import "./UserTable.css";

const UserTable = () => {

  return (

    <div className="user-table-container">

      <table className="user-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>RFC</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td>1</td>
            <td>Juan Pérez</td>
            <td>9999999999</td>
            <td>JUAP010101XX1</td>
            <td>juan_admin</td>
            <td>Administrador</td>
            <td>Activo</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
};

export default UserTable