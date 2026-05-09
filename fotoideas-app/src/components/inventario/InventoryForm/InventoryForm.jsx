import Button from "../../ui/Button/Button";

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
        <div className="inventario-form-frame">
          
          <div className="form-row">
            <div className="form-col">
              <label className="form-label">ID del Producto</label>
              {accion === "agregar" ? (
                <input type="text" className="form-input" placeholder="Autogenerado por BD" disabled style={{ backgroundColor: '#f3f4f6' }} />
              ) : (
                <input type="text" name="id_producto" value={formData.id_producto ?? ""} onChange={handleChange} className="form-input" placeholder="Ingrese ID..." />
              )}
            </div>
            {accion !== "borrar" ? (
              <div className="form-col">
                <label className="form-label">Código de Barras</label>
                <input type="text" name="codigo_barras" value={formData.codigo_barras ?? ""} onChange={handleChange} className="form-input" placeholder="Código de barras..." />
              </div>
            ) : (
              <div className="form-col">
                <label className="form-label">Estado</label>
                <select name="estado" value={formData.estado ?? "activo"} onChange={handleChange} className="form-select">
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            )}
          </div>

          {(accion === "agregar" || accion === "actualizar") && (
            <>
              {/* Fila 2: Nombre (Izq) y Categoría (Der) */}
              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre ?? ""} onChange={handleChange} className="form-input" placeholder="Nombre del producto..." />
                </div>
                <div className="form-col">
                  <label className="form-label">Categoría</label>
                  <input type="text" name="categoria" value={formData.categoria ?? ""} onChange={handleChange} className="form-input" placeholder="Categoría..." />
                </div>
              </div>

              {/* Fila 3: Descripción (Medio / Completo) */}
              <div>
                <label className="form-label">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} className="form-textarea" placeholder="Descripción detallada del producto..." rows={3}></textarea>
              </div>

              {/* Fila 4: Costo Unitario, Precio Público, Estado */}
              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Costo Unitario</label>
                  <input type="number" name="costo_unitario" value={formData.costo_unitario ?? ""} onChange={handleChange} className="form-input" placeholder="$0.00" />
                </div>
                <div className="form-col">
                  <label className="form-label">Precio Público</label>
                  <input type="number" name="precio_publico" value={formData.precio_publico ?? ""} onChange={handleChange} className="form-input" placeholder="$0.00" />
                </div>
                <div className="form-col">
                  <label className="form-label">Estado</label>
                  <select name="estado" value={formData.estado ?? "activo"} onChange={handleChange} className="form-select">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Fila 5: Stock y Proveedor */}
              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Stock</label>
                  <input type="number" name="stock" value={formData.stock ?? ""} onChange={handleChange} className="form-input" placeholder="0" />
                </div>
                <div className="form-col">
                  <label className="form-label">Proveedor</label>
                  <input type="text" name="proveedor" value={formData.proveedor ?? ""} onChange={handleChange} className="form-input" placeholder="Nombre del proveedor..." />
                </div>
                <div className="form-col">
                  {/* Columna vacía para alinear */}
                </div>
              </div>
            </>
          )}

          {accion === "borrar" && (
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Tipo de Movimiento</label>
                <input type="text" name="tipo_movimiento" value={formData.tipo_movimiento ?? ""} onChange={handleChange} className="form-input" placeholder="Ej. Baja por merma, caducidad..." />
              </div>
              <div className="form-col">
              </div>
            </div>
          )}

          {(accion === "actualizar" || accion === "borrar") && (
            <>
              <div>
                <label className="form-label">Descripción de Movimiento</label>
                <textarea name="descripcion_movimiento" value={formData.descripcion_movimiento ?? ""} onChange={handleChange} className="form-textarea" placeholder="Especifique los detalles del movimiento..." rows={2}></textarea>
              </div>

              <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                <div className="form-col" style={{ flex: 'none', width: '200px' }}>
                  <label className="form-label">Hora de Movimiento</label>
                  <input type="time" name="hora_movimiento" value={formData.hora_movimiento ?? ""} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-col" style={{ flex: 'none', width: '200px' }}>
                  <label className="form-label">Fecha de Movimiento</label>
                  <input type="date" name="fecha_movimiento" value={formData.fecha_movimiento ?? ""} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </>
          )}

        </div>

        {/* 3. Botones Inferiores (Izquierda) */}
        <div className="inventario-form-footer">
          <Button variant="danger" onClick={resetForm}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmar}>Confirmar</Button>
        </div>
      </div>
    </>
  );
};

export default InventoryForm;