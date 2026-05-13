import "./UserDeleteForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const UserDeleteForm = () => {

  return (

    <div className="user-form">

      {/* top */}
      <div className="user-delete-top">

        <div className="user-info-item">
          <label>ID del cajero:</label>
          <span>id_cajero</span>
        </div>

        <div className="user-info-item">
          <label>Fecha movimiento:</label>
          <span>fecha_movimiento</span>
        </div>

        <div className="user-info-item">
          <label>Hora movimiento:</label>
          <span>hora_movimiento</span>
        </div>

      </div>

      {/* info */}
      <div className="user-delete-content">

        <Input
          label="Tipo movimiento"
          placeholder="tipo_movimiento"
        />

        <div className="user-delete-status">

          <label>Estado:</label>
          <span>estado_cajero</span>

        </div>

      </div>

      {/* descripcion */}
      <div className="user-description">

        <label>Descripción movimiento:</label>

        <textarea
          placeholder="descripcion_movimiento"
        />

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

export default UserDeleteForm