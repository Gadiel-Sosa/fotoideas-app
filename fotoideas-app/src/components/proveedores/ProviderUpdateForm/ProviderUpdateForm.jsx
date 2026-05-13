import "./ProviderUpdateForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const ProviderUpdateForm = () => {

  return (

    <div className="provider-form">

      <div className="provider-grid">

        <Input
          label="ID proveedor"
          placeholder="Número de proveedor..."
        />

        <Input
          label="Razón social"
          placeholder="Nombre de la empresa..."
        />

        <Input
          label="Movimiento"
          placeholder="Tipo de movimiento..."
        />

        <Input
          label="Contacto"
          placeholder="Nombre del contacto..."
        />

        <Input
          label="Teléfono"
          placeholder="Teléfono del proveedor..."
        />

        <Input
          label="Correo electrónico"
          placeholder="Correo electrónico..."
        />

        <Input
          label="Dirección"
          placeholder="Dirección..."
        />

        <Input
          label="Hora movimiento"
          placeholder=""
          type="time" 
        />

        <Input
          label="Fecha movimiento"
          placeholder="fecha_movimiento"
          type = "date"
        />

      </div>

      <div className="provider-row">

        <div className="provider-field">
          <label>Giro:</label>

          <select defaultValue="" required>
            <option value="" disabled>
              Seleccione un giro...
            </option>
          </select>
        </div>

        <div className="provider-field">
          <label>Estado:</label>

          <select defaultValue="" required>
            <option value="" disabled>
              Seleccione un estado...
            </option>
          </select>
        </div>

      </div>

      <div className="provider-description">

        <label>Descripción movimiento</label>

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

export default ProviderUpdateForm