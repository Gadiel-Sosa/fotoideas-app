import "./UserDeleteForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const UserDeleteForm = () => {

  return (

    <div className="user-delete-form">

      {/* FILA 1 */}

      <div className="user-delete-top">

        <div className="user-static-field">

          <label>ID del cajero:</label>

          <span>
            Auto generado por la BD
          </span>

        </div>

        <Input
          label="Fecha movimiento"
          type="date"
        />

        <Input
          label="Hora movimiento"
          type="time"
        />

      </div>

      {/* FILA 2 */}

      <div className="user-delete-row">

        <div className="user-select-field">

          <label>Tipo movimiento:</label>

          <select defaultValue="">

            <option value="" disabled>
              -- Seleccionar --
            </option>

            <option>Baja</option>

            <option>Eliminación</option>

          </select>

        </div>

        <div className="user-select-field">

          <label>Estado:</label>

          <select defaultValue="">

            <option value="" disabled>
              -- Seleccionar --
            </option>

            <option>Activo</option>

            <option>Inactivo</option>

          </select>

        </div>

      </div>

      {/* FILA 3 */}

      <div className="user-delete-description">

        <label>Descripción movimiento:</label>

        <textarea
          placeholder="Descripción..."
        />

      </div>

      {/* BOTONES */}

      <div className="user-delete-buttons">

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

export default UserDeleteForm

