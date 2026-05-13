import "./UserAddForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const UserAddForm = () => {

  return (

    <div className="user-form">

      {/* fila superior */}
      <div className="user-top-info">

        <div className="user-info-item">
          <label>ID del cajero:</label>
          <span>id_cajero</span>
        </div>

      </div>

      {/* grid principal */}
      <div className="user-grid">

        <Input
          label="Nombre del cajero"
          placeholder="nombre_cajero"
        />

        <Input
          label="Teléfono"
          placeholder="telefono_cajero"
        />

        <div className="user-full">
          <Input
            label="Dirección"
            placeholder="direccion_cajero"
          />
        </div>

        <Input
          label="Fecha de nacimiento"
          type="date"
        />

        <Input
          label="RFC"
          placeholder="rfc_cajero"
        />

        <Input
          label="NSS"
          placeholder="nss_cajero"
        />

        <Input
          label="Usuario"
          placeholder="nombre_usuario"
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="contraseña_usuario"
        />

      </div>

      {/* fila inferior */}
      <div className="user-row">

        <div className="user-field">

          <label>Rol:</label>

          <select defaultValue="">
            <option value="" disabled>
              rol_cajero
            </option>
          </select>

        </div>

        <div className="user-field">

          <label>Estado:</label>

          <select defaultValue="">
            <option value="" disabled>
              estado_cajero
            </option>
          </select>

        </div>

      </div>

      {/* botones */}
      <div className="user-buttons">

        <Button variant="danger">
          Cancelar
        </Button>

        <Button variant="primary">
          Confirmar
        </Button>

      </div>

    </div>
  );
};

export default UserAddForm