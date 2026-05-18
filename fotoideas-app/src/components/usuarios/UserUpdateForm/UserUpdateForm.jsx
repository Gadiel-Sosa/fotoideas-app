import "./UserUpdateForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const UserUpdateForm = ({ formData, handleChange, handleConfirmar, resetForm }) => {

  return (

    <div className="user-form">

      {/* Fila superior */}
      <div className="user-top-info">
        <div className="user-info-item">
          <label>ID del usuario:</label>
          <span>{formData.id_empleado || "Auto generado por la BD"}</span>
        </div>
      </div>

      <div className="user-grid">
        <Input
          label="Nombre del empleado"
          placeholder="Nombre..."
          name="nombre_empleado"
          value={formData.nombre_empleado}
          onChange={handleChange}
        />

        <Input
          label="Teléfono"
          placeholder="Teléfono..."
          name="telefono_empleado"
          value={formData.telefono_empleado}
          onChange={handleChange}
        />

        <div className="user-full">
          <Input
            label="Dirección"
            placeholder="Dirección..."
            name="direccion_empleado"
            value={formData.direccion_empleado}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Fecha de nacimiento"
          type="date"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
        />

        <Input
          label="RFC"
          placeholder="RFC..."
          name="rfc_empleado"
          value={formData.rfc_empleado}
          onChange={handleChange}
        />

        <Input
          label="NSS"
          placeholder="Número de Seguro Social..."
          name="nss_empleado"
          value={formData.nss_empleado}
          onChange={handleChange}
        />

        <Input
          label="Usuario"
          placeholder="Usuario..."
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Dejar en blanco para no cambiar..."
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {/* Fila Inferior (Rol y Estado) */}
      <div className="user-row">
        <div className="user-field">
          <label>Rol del sistema:</label>
          <select name="id_rol" value={formData.id_rol} onChange={handleChange}>
            <option value={1}>Administrador</option>
            <option value={2}>Empleado</option>
          </select>
        </div>

        <div className="user-field">
          <label>Estado del usuario:</label>
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="user-buttons">
        <Button variant="danger" onClick={resetForm}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirmar}>
          Confirmar
        </Button>
      </div>

    </div>
  );
};

export default UserUpdateForm
