import "./ProviderAddForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const ProviderAddForm = ({
  formData,
  handleChange,
  handleConfirmar,
  resetForm
}) => {

  return (

    <div className="provider-form">

      {/* TOP */}

      <div className="provider-top-info">

        <div className="provider-info-item">

          <label>ID del proveedor:</label>

          <span>
            {formData.id_proveedor || "Auto generado por la BD"}
          </span>

        </div>

      </div>

      {/* GRID */}

      <div className="provider-grid">

        <Input
          label="Nombre del contacto"
          name="nombre_proveedor"
          value={formData.nombre_proveedor}
          onChange={handleChange}
          placeholder="Nombre del proveedor..."
        />

        <Input
          label="Empresa / Razón social"
          name="nombre_empresa"
          value={formData.nombre_empresa}
          onChange={handleChange}
          placeholder="Nombre de la empresa..."
        />

        <Input
          label="Teléfono"
          name="telefono_proveedor"
          value={formData.telefono_proveedor}
          onChange={handleChange}
          placeholder="Teléfono..."
        />

        <Input
          label="Correo electrónico"
          name="correo_proveedor"
          type="email"
          value={formData.correo_proveedor}
          onChange={handleChange}
          placeholder="Correo electrónico..."
        />

        <Input
          label="RFC"
          name="RFC_proveedor"
          value={formData.RFC_proveedor}
          onChange={handleChange}
          placeholder="RFC..."
        />

        <Input
          label="Dirección"
          name="direccion_proveedor"
          value={formData.direccion_proveedor}
          onChange={handleChange}
          placeholder="Dirección..."
        />

      </div>

      {/* FILA EXTRA */}

      <div className="provider-row">

        <div className="provider-field">

          <label>Giro:</label>

          <select defaultValue="">

            <option value="" disabled>
              Seleccione un giro...
            </option>

            <option>Tecnología</option>

            <option>Papelería</option>

            <option>Alimentos</option>

          </select>

        </div>

        <div className="provider-field">

          <label>Estado:</label>

          <select defaultValue="">

            <option value="" disabled>
              Seleccione un estado...
            </option>

            <option>Activo</option>

            <option>Inactivo</option>

          </select>

        </div>

      </div>

      {/* BOTONES */}

      <div className="provider-buttons">

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

export default ProviderAddForm


