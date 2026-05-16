import "./UserDeleteForm.css";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const UserDeleteForm = ({ formData, handleConfirmar, resetForm }) => {

  return (

    <div className="user-delete-form">

      {/* FILA 1 */}
      <div className="user-delete-top">
        <div className="user-static-field">
          <label>ID del empleado a dar de baja:</label>
          <span>{formData.id_empleado || "No seleccionado"}</span>
        </div>

        <div className="user-static-field">
          <label>Nombre:</label>
          <span>{formData.nombre_empleado || "No seleccionado"}</span>
        </div>
      </div>

      {/* FILA 2 (Confirmación Textual) */}
      <div className="user-delete-description" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <label style={{ color: '#ef4444', fontWeight: 'bold' }}>Advertencia de Baja</label>
        <p style={{ marginTop: '8px', color: '#4b5563', lineHeight: '1.5' }}>
          ¿Estás seguro de que deseas desactivar al usuario <strong>{formData.username || formData.nombre_empleado}</strong>?
          <br /><br />
          Esta acción le quitará el acceso al sistema inmediatamente. Sin embargo, su historial de ventas y movimientos seguirá intacto en la base de datos para fines de auditoría.
        </p>
      </div>

      {/* BOTONES */}
      <div className="user-delete-buttons">
        <Button variant="secondary" onClick={resetForm}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirmar}>
          Confirmar Baja
        </Button>
      </div>

    </div>

  );
};

export default UserDeleteForm
