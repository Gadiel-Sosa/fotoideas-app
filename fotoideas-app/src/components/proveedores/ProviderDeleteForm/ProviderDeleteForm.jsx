import "./ProviderDeleteForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const ProviderDeleteForm = ({
  formData,
  handleChange,
  handleConfirmar,
  resetForm
}) => {

  return (

    <div className="provider-delete-form">

      {/* FILA SUPERIOR */}

      <div className="provider-delete-top">

        <div className="provider-static-field">

          <label>ID del proveedor:</label>

          <span>
            {formData.id_proveedor || "Auto generado por la BD"}
          </span>

        </div>

        <Input
          label="Fecha movimiento"
          name="fecha_movimiento"
          type="date"
          value={formData.fecha_movimiento || ""}
          onChange={handleChange}
        />

        <Input
          label="Hora movimiento"
          name="hora_movimiento"
          type="time"
          value={formData.hora_movimiento || ""}
          onChange={handleChange}
        />

      </div>

      {/* FILA MOVIMIENTO */}

      <div className="provider-delete-row">

        <div className="provider-select-field">

          <label>Tipo movimiento:</label>

          <select
            name="tipo_movimiento"
            value={formData.tipo_movimiento || ""}
            onChange={handleChange}
          >

            <option value="" disabled>
              -- Seleccionar --
            </option>

            <option>Baja</option>

            <option>Eliminación</option>

          </select>

        </div>

        <div className="provider-select-field">

          <label>Estado:</label>

          <select
            name="estado_proveedor"
            value={formData.estado_proveedor || ""}
            onChange={handleChange}
          >

            <option value="" disabled>
              -- Seleccionar --
            </option>

            <option>Activo</option>

            <option>Inactivo</option>

          </select>

        </div>

      </div>

      {/* DESCRIPCIÓN */}

      <div className="provider-delete-description">

        <label>Descripción movimiento:</label>

        <textarea
          name="descripcion_movimiento"
          value={formData.descripcion_movimiento || ""}
          onChange={handleChange}
          placeholder="Descripción..."
        />

      </div>

      {/* BOTONES */}

      <div className="provider-delete-buttons">

        <Button
          variant="danger"
          onClick={resetForm}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleConfirmar}
        >
          Confirmar 
        </Button>

      </div>

    </div>
  );
};

export default ProviderDeleteForm;


