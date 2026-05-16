import "./UserUpdateForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const UserUpdateForm = () => {

  return (

    <div className="user-form">

      {/* info superior */}

      <div className="user-update-top">

        <div className="user-info-item">

          <label>ID del cajero:</label>

          <span>Auto generado por la BD</span>

        </div>

      </div>

      {/* movimiento */}

      <div className="user-update-row">

        <div className="user-field">

          <label>Tipo de movimiento:</label>

          <select defaultValue="">

            <option value="" disabled>
              -- Seleccionar --
            </option>

            <option>Alta</option>

            <option>Actualización</option>

            <option>Baja</option>

          </select>

        </div>

        <div className="user-description-box">

          <label>Descripción movimiento:</label>

          <textarea
            placeholder="Descripción..."
          ></textarea>

        </div>

      </div>

      {/* grid */}

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

      </div>

      {/* fila inferior */}

      <div className="user-bottom-info">

        <Input
          label="Hora movimiento"
          type="time"
        />

        <Input
          label="Fecha movimiento"
          type="date"
        />

      </div>

      {/* botones */}

      <div className="user-buttons">

        <Button variant="secondary">
          Cancelar
        </Button>

        <Button variant="primary">
          Confirmar
        </Button>

      </div>

    </div>
  );
};

export default UserUpdateForm
