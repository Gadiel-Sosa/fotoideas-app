import Button from "../../ui/Button/Button";
import "../../inventario/InventoryForm/InventoryForm.css"; 

const ProviderAddForm = ({ formData, handleChange, accion, handleConfirmar, resetForm }) => {
  return (
    <div className="inventario-content">
      <div className="inventory-form">
        <div className="inventory-form-grid">
          
          <div className="form-group">
            <label>ID del Proveedor</label>
            {accion === "agregar" ? (
              <input type="text" placeholder="Autogenerado por BD" disabled style={{ backgroundColor: '#f3f4f6' }} />
            ) : (
              <input type="text" name="id_proveedor" value={formData.id_proveedor ?? ""} onChange={handleChange} placeholder="Ingrese ID..." />
            )}
          </div>

          <div className="form-group">
            <label>RFC</label>
            <input type="text" name="RFC_proveedor" value={formData.RFC_proveedor ?? ""} onChange={handleChange} placeholder="RFC del proveedor..." disabled={accion === "borrar"} />
          </div>

          <div className="form-group">
            <label>Nombre del Contacto</label>
            <input type="text" name="nombre_proveedor" value={formData.nombre_proveedor ?? ""} onChange={handleChange} placeholder="Nombre completo..." disabled={accion === "borrar"} />
          </div>

          <div className="form-group">
            <label>Empresa / Razón Social</label>
            <input type="text" name="nombre_empresa" value={formData.nombre_empresa ?? ""} onChange={handleChange} placeholder="Nombre de la empresa..." disabled={accion === "borrar"} />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" name="telefono_proveedor" value={formData.telefono_proveedor ?? ""} onChange={handleChange} placeholder="10 dígitos..." disabled={accion === "borrar"} />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="correo_proveedor" value={formData.correo_proveedor ?? ""} onChange={handleChange} placeholder="correo@ejemplo.com..." disabled={accion === "borrar"} />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Dirección</label>
            <textarea name="direccion_proveedor" value={formData.direccion_proveedor ?? ""} onChange={handleChange} placeholder="Dirección detallada..." disabled={accion === "borrar"} rows={2}></textarea>
          </div>

          {accion === "borrar" && (
             <div className="form-group" style={{ gridColumn: 'span 2', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>
                <p>⚠️ Atención: Esta acción eliminará permanentemente al proveedor. Solo procederá si no tiene un historial de compras asociado.</p>
             </div>
          )}

        </div>
      </div>

      {/* Botones Inferiores */}
      <div className="inventory-form-actions">
        <Button variant="danger" onClick={resetForm}>Cancelar</Button>
        <Button variant="primary" onClick={handleConfirmar}>Confirmar</Button>
      </div>
    </div>
  );
};

export default ProviderAddForm;