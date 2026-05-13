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
          <span>id_cajero</span>
        </div>

        <div className="user-info-item">
          <label>Tipo movimiento:</label>
          <span>tipo_movimiento</span>
        </div>

        <div className="user-info-item">
          <label>Descripción movimiento:</label>
          <span>descripcion_movimiento</span>
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

        <div className="user-info-item">
          <label>Hora movimiento:</label>
          <span>hora_movimiento</span>
        </div>

        <div className="user-info-item">
          <label>Fecha movimiento:</label>
          <span>fecha_movimiento</span>
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

export default UserUpdateForm