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
          <span>Autogenerado por la BD</span>
        </div>

      </div>

      {/* grid principal */}
      <div className="user-grid">

        <Input
          label="Nombre del cajero"
          placeholder="Nombre del cajero..."
        />

        <Input
          label="Teléfono"
          placeholder="Teléfono..."
        />

        <div className="user-full">
          <Input
            label="Dirección"
            placeholder="Dirección..."
          />
        </div>

        <Input
          label="Fecha de nacimiento"
          type="date"
        />

        <Input
          label="RFC"
          placeholder="RFC..."
        />

        <Input
          label="NSS"
          placeholder="NSS..."
        />

        <Input
          label="Usuario"
          placeholder="Usuario..."
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Contraseña..."
        />

      </div>

      {/* fila inferior */}
      <div className="user-row">

        <div className="user-field">

          <label>Rol:</label>

          <select defaultValue="">
            <option value="" disabled>
              -- Seleccionar --
            </option>
          </select>

        </div>

        <div className="user-field">

          <label>Estado:</label>

          <select defaultValue="">
            <option value="" disabled>
              -- Selecionar --
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