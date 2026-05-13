import "./ProviderDeleteForm.css";

import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";

const ProviderDeleteForm = () => {

  return (

    <div className="provider-form">

      <div className="provider-grid">

        <Input
          label="ID del proveedor"
          placeholder="Número de proveedor..."
        />

        <Input
          label="Fecha movimiento"
          placeholder=""
          type="date"
        />

        <Input
          label="Hora movimiento"
          placeholder=""
          type="time"
        />

        <Input
          label="Tipo movimiento"
          placeholder="Tipo de movimiento..."
        />

      </div>

      <div className="provider-row">

        <div className="provider-field">
          <label>Estado:</label>

          <select defaultValue="" required>
            <option value="" disabled>
              Seleccione un estado...
            </option>
          </select>
        </div>

      </div>

      <div className="form-group description-box">
        <label>Descripción movimiento:</label>

        <textarea
          placeholder=""
        />
      </div>

      <div className="provider-buttons">

        <Button variant="danger">
          Cancelar
        </Button>

        <Button>
          Confirmar
        </Button>

      </div>

    </div>
  );
};

export default ProviderDeleteForm