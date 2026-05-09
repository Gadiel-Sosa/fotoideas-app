import Button from "../../ui/Button/Button";
import "./InventoryForm.css";

const InventoryForm = ({ formData, handleChange, accion, setAccion, handleConfirmar, resetForm }) => {
  return (
    <>
      {/* 1. Botones de Acción Superiores */}
      <div className="inventario-actions">
        <Button variant={accion === "agregar" ? "primary" : "secondary"} onClick={() => setAccion("agregar")}>Agregar</Button>
        <Button variant={accion === "actualizar" ? "primary" : "secondary"} onClick={() => setAccion("actualizar")}>Actualizar</Button>
        <Button variant={accion === "borrar" ? "primary" : "secondary"} onClick={() => setAccion("borrar")}>Borrar</Button>
      </div>
      
      <div className="inventario-content">
        {/* 2. Marco del Formulario */}
        <div className="inventory-form">
          
          <div className="inventory-form-grid">
            <div className="form-group">
              <label>ID del Producto</label>
              {accion === "agregar" ? (
                <input type="text" placeholder="Autogenerado por BD" disabled style={{ backgroundColor: '#f3f4f6' }} />
              ) : (
                <input type="text" name="id_producto" value={formData.id_producto ?? ""} onChange={handleChange} placeholder="Ingrese ID..." />
              )}
            </div>
            {accion !== "borrar" ? (
              <div className="form-group">
                <label>Código de Barras</label>
                <input type="text" name="codigo_barras" value={formData.codigo_barras ?? ""} onChange={handleChange} placeholder="Código de barras..." />
              </div>
            ) : (
              <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={formData.estado ?? "activo"} onChange={handleChange}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            )}

          {(accion === "agregar" || accion === "actualizar") && (
            <>
              {/* Fila 2: Nombre (Izq) y Categoría (Der) */}
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre ?? ""} onChange={handleChange} placeholder="Nombre del producto..." />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <input type="text" name="categoria" value={formData.categoria ?? ""} onChange={handleChange} placeholder="Categoría..." />
              </div>

              {/* Fila 3: Descripción (Medio / Completo) */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} placeholder="Descripción detallada del producto..."></textarea>
              </div>

              {/* Fila 4: Costo Unitario, Precio Público, Estado */}
              <div className="form-group">
                <label>Costo Unitario</label>
                <input type="number" name="costo_unitario" value={formData.costo_unitario ?? ""} onChange={handleChange} placeholder="$0.00" />
              </div>
              <div className="form-group">
                <label>Precio Público</label>
                <input type="number" name="precio_publico" value={formData.precio_publico ?? ""} onChange={handleChange} placeholder="$0.00" />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={formData.estado ?? "activo"} onChange={handleChange}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              {/* Fila 5: Stock y Proveedor */}
              <div className="form-group">
                <label>Stock</label>
                <input type="number" name="stock" value={formData.stock ?? ""} onChange={handleChange} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Proveedor</label>
                <input type="text" name="proveedor" value={formData.proveedor ?? ""} onChange={handleChange} placeholder="Nombre del proveedor..." />
              </div>
            </>
          )}

          {accion === "borrar" && (
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Tipo de Movimiento</label>
              <input type="text" name="tipo_movimiento" value={formData.tipo_movimiento ?? ""} onChange={handleChange} placeholder="Ej. Baja por merma, caducidad..." />
            </div>
          )}

          {(accion === "actualizar" || accion === "borrar") && (
            <>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Descripción de Movimiento</label>
                <textarea name="descripcion_movimiento" value={formData.descripcion_movimiento ?? ""} onChange={handleChange} placeholder="Especifique los detalles del movimiento..."></textarea>
              </div>

              <div className="form-group">
                <label>Hora de Movimiento</label>
                <input type="time" name="hora_movimiento" value={formData.hora_movimiento ?? ""} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Fecha de Movimiento</label>
                <input type="date" name="fecha_movimiento" value={formData.fecha_movimiento ?? ""} onChange={handleChange} />
              </div>
            </>
          )}

          </div>
        </div>

        {/* 3. Botones Inferiores (Izquierda) */}
        <div className="inventory-form-actions">
          <Button variant="danger" onClick={resetForm}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmar}>Confirmar</Button>
        </div>
      </div>
    </>
  );
};

export default InventoryForm;