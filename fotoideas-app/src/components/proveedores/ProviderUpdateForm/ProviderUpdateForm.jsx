import "./ProviderUpdateForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const ProviderUpdateForm = ({
  formData,
  handleChange,
  handleConfirmar,
  resetForm
}) => {

  return (

    <div className="provider-update-form">

      {/* FILA 1 */}

      <div className="provider-update-row">

        <div className="provider-static-field">

          <label>ID del proveedor:</label>

          <span>
            {formData.id_proveedor || "Auto generado por la BD"}
          </span>

        </div>

        <Input
          label="Empresa / Razón social"
          name="Nombre de la empresa..."
          value={formData.nombre_empresa}
          onChange={handleChange}
          placeholder="Nombre de la empresa..."
        />

      </div>

      {/* FILA 2 */}

      <div className="provider-update-row">
        <div className="provider-select-field">
          <label>Tipo movimiento:</label>
          <select defaultValue="">
            <option value="" disabled> -- Seleccionar -- </option>
            <option>Alta</option> 
            <option>Actualización</option>
          </select>
        </div>
        <div className="provider-description-box">
          <label>Descripción movimiento:</label>
          <textarea placeholder="Descripción..." />
        </div>
      </div>

      {/* FILA 3 */}

      <div className="provider-update-row">

        <Input
          label="Nombre del contacto"
          name="Nombre del proveedor..."
          value={formData.nombre_proveedor}
          onChange={handleChange}
          placeholder="Nombre del proveedor..."
        />

        <Input
          label="Teléfono"
          name="Teléfono..."
          value={formData.telefono_proveedor}
          onChange={handleChange}
          placeholder="Teléfono..."
        />

      </div>

      {/* FILA 4 */}

      <div className="provider-update-row">

        <Input
          label="Correo electrónico"
          name="Correo electrónico..."
          value={formData.correo_proveedor}
          onChange={handleChange}
          placeholder="Correo electrónico..."
        />

        <Input
          label="Dirección"
          name="Dirección..."
          value={formData.direccion_proveedor}
          onChange={handleChange}
          placeholder="Dirección..."
        />

      </div>

      {/* FILA 5 */}

      <div className="provider-update-row">

        <div className="provider-select-field">

          <label>Giro:</label>

          <select defaultValue="">

            <option value="" disabled>
              -- Seleccionar --
            </option>
            <option>Tecnología</option>

            <option>Papelería</option>

            <option>Alimentos</option>

          </select>

        </div>

        <div className="provider-select-field">

          <label>Estado:</label>

          <select defaultValue="">

            <option value={formData.estado} disabled>
              -- Seleccionar --
            </option>
            <option>Activo</option>

            <option>Inactivo</option>

          </select>

        </div>

      </div>

      {/* FILA 6 */}

      <div className="provider-update-row">
        <Input
          label="Hora movimiento"
          type="time"
        />
        <Input
          label="Fecha movimiento"
          type="date"
        />
      </div>

      {/* BOTONES */}

      <div className="provider-update-buttons">

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

export default ProviderUpdateForm



