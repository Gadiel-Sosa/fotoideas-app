import { useState, useEffect } from "react";

import "../Inventario/Inventario.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import TableContainer from "../../components/ui/TableContainer/TableContainer";
import EmptyState from "../../components/ui/EmptyState/EmptyState";

const Inventario = () => {

  const [tab, setTab] = useState("gestionar");
  const [accion, setAccion] = useState("agregar"); // Estado para alternar: agregar, actualizar, borrar
  const [productos, setProductos] = useState([]); // Estado para la tabla de consultar
  
  // Estado para capturar todos los datos del formulario
  const [formData, setFormData] = useState({
    id_producto: "",
    codigo_barras: "",
    nombre: "",
    categoria: "",
    descripcion: "",
    costo_unitario: "",
    precio_publico: "",
    estado: "activo",
    stock: "",
    proveedor: "",
    descripcion_movimiento: "",
    tipo_movimiento: "",
    fecha_movimiento: new Date().toISOString().split('T')[0], // Obtiene la fecha de hoy
    hora_movimiento: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) // Hora actual
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función centralizada para limpiar los campos
  const resetForm = () => {
    setFormData({
      id_producto: "", codigo_barras: "", nombre: "", categoria: "",
      descripcion: "", costo_unitario: "", precio_publico: "",
      estado: "activo", stock: "", proveedor: "",
      descripcion_movimiento: "", tipo_movimiento: "",
      fecha_movimiento: new Date().toISOString().split('T')[0],
      hora_movimiento: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Efecto para cargar los productos cuando entramos a la pestaña "consultar"
  useEffect(() => {
    if (tab === "consultar") {
      cargarProductos();
    }
  }, [tab]);

  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/productos");
      const data = await response.json();
      if (data.success) {
        setProductos(data.productos);
      }
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    }
  };

  // Función que se activa al darle click a "Editar" o "Eliminar" en la tabla
  const handleAccionDesdeTabla = (producto, nuevaAccion) => {
    setAccion(nuevaAccion);
    setTab("gestionar"); // Nos cambia a la pestaña de formulario
    setFormData({
      id_producto: producto.id_producto || "",
      codigo_barras: producto.codigo_barras_producto || "",
      nombre: producto.nombre_producto || "",
      categoria: producto.categoria || "",
      descripcion: producto.descripcion || "",
      costo_unitario: "", // Vacío por ahora, pendiente de historial de compras
      precio_publico: producto.precio_publico || "",
      estado: producto.estado || "activo",
      stock: producto.stock || "0",
      proveedor: "", // Vacío
      descripcion_movimiento: "", // Vacío para que el usuario escriba el motivo
      tipo_movimiento: nuevaAccion === "borrar" ? "Baja de Inventario" : "Actualización de Datos",
      fecha_movimiento: new Date().toISOString().split('T')[0],
      hora_movimiento: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleConfirmar = async () => {
    if (accion === "agregar") {
      if (!formData.nombre || !formData.precio_publico) {
        alert("El nombre y el precio público son obligatorios.");
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await response.json();

        if (data.success) {
          alert(`Producto guardado exitosamente. ID asignado: ${data.id_producto}`);
          resetForm();
        } else {
          alert("Error al guardar: " + data.error);
        }
      } catch (error) {
        alert("Error de conexión con el servidor.");
      }
    } else if (accion === "actualizar") {
      try {
        const response = await fetch(`http://localhost:3000/api/productos/${formData.id_producto}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
          alert("Producto actualizado exitosamente");
          resetForm();
          setTab("consultar"); // Regresamos a la tabla para ver los cambios
        } else {
          alert("Error al actualizar: " + data.error);
        }
      } catch (error) {
        alert("Error de conexión con el servidor.");
      }
    } else if (accion === "borrar") {
      try {
        const response = await fetch(`http://localhost:3000/api/productos/${formData.id_producto}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
          alert("Producto dado de baja exitosamente");
          resetForm();
          setTab("consultar"); // Regresamos a la tabla para ver los cambios
        } else {
          alert("Error al borrar: " + data.error);
        }
      } catch (error) {
        alert("Error de conexión con el servidor.");
      }
    }
  };

  return (
    <>
      <Header />

      <PageContainer>
        <div className="inventario-container">

          <h2>Inventario</h2>

          <div className="tabs inventario-top">

            <Button
              variant={tab === "gestionar" ? "primary" : "secondary"}
              onClick={() => setTab("gestionar")}
            >
              Gestionar Productos
            </Button>

            <Button
              variant={tab === "consultar" ? "primary" : "secondary"}
              onClick={() => setTab("consultar")}
            >
              Consultar Inventario
            </Button>

          </div>

          {tab === "gestionar" && (
            <Section className="inventario-section">

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
                        <input type="text" name="id_producto" value={formData.id_producto} onChange={handleChange} className="form-input" placeholder="Ingrese ID..." />
                      )}
                    </div>
                    {accion !== "borrar" ? (
                      <div className="form-col">
                        <label className="form-label">Código de Barras</label>
                        <input type="text" name="codigo_barras" value={formData.codigo_barras} onChange={handleChange} className="form-input" placeholder="Código de barras..." />
                      </div>
                    ) : (
                      <div className="form-col">
                        <label className="form-label">Estado</label>
                        <select name="estado" value={formData.estado} onChange={handleChange} className="form-select">
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
                          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-input" placeholder="Nombre del producto..." />
                        </div>
                        <div className="form-col">
                          <label className="form-label">Categoría</label>
                          <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} className="form-input" placeholder="Categoría..." />
                        </div>
                      </div>

                      {/* Fila 3: Descripción (Medio / Completo) */}
                      <div>
                        <label className="form-label">Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-textarea" placeholder="Descripción detallada del producto..." rows={3}></textarea>
                      </div>

                      {/* Fila 4: Costo Unitario, Precio Público, Estado */}
                      <div className="form-row">
                        <div className="form-col">
                          <label className="form-label">Costo Unitario</label>
                          <input type="number" name="costo_unitario" value={formData.costo_unitario} onChange={handleChange} className="form-input" placeholder="$0.00" />
                        </div>
                        <div className="form-col">
                          <label className="form-label">Precio Público</label>
                          <input type="number" name="precio_publico" value={formData.precio_publico} onChange={handleChange} className="form-input" placeholder="$0.00" />
                        </div>
                        <div className="form-col">
                          <label className="form-label">Estado</label>
                          <select name="estado" value={formData.estado} onChange={handleChange} className="form-select">
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                          </select>
                        </div>
                      </div>

                      {/* Fila 5: Stock y Proveedor */}
                      <div className="form-row">
                        <div className="form-col">
                          <label className="form-label">Stock</label>
                          <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-input" placeholder="0" />
                        </div>
                        <div className="form-col">
                          <label className="form-label">Proveedor</label>
                          <input type="text" name="proveedor" value={formData.proveedor} onChange={handleChange} className="form-input" placeholder="Nombre del proveedor..." />
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
                        <input type="text" name="tipo_movimiento" value={formData.tipo_movimiento} onChange={handleChange} className="form-input" placeholder="Ej. Baja por merma, caducidad..." />
                      </div>
                      <div className="form-col">
                      </div>
                    </div>
                  )}

                  {(accion === "actualizar" || accion === "borrar") && (
                    <>
                      <div>
                        <label className="form-label">Descripción de Movimiento</label>
                        <textarea name="descripcion_movimiento" value={formData.descripcion_movimiento} onChange={handleChange} className="form-textarea" placeholder="Especifique los detalles del movimiento..." rows={2}></textarea>
                      </div>

                      <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                        <div className="form-col" style={{ flex: 'none', width: '200px' }}>
                          <label className="form-label">Hora de Movimiento</label>
                          <input type="time" name="hora_movimiento" value={formData.hora_movimiento} onChange={handleChange} className="form-input" />
                        </div>
                        <div className="form-col" style={{ flex: 'none', width: '200px' }}>
                          <label className="form-label">Fecha de Movimiento</label>
                          <input type="date" name="fecha_movimiento" value={formData.fecha_movimiento} onChange={handleChange} className="form-input" />
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

            </Section>
          )}

          {tab === "consultar" && (
            <Section className="inventario-section">

              {productos.length === 0 ? (
                <EmptyState message="No hay productos registrados en el inventario" />
              ) : (
                <TableContainer>
                  <table className="sale-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio Público</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p.id_producto}>
                          <td>{p.id_producto}</td>
                          <td>{p.codigo_barras_producto || "N/A"}</td>
                          <td>{p.nombre_producto}</td>
                          <td>{p.categoria || "Sin categoría"}</td>
                          <td>${Number(p.precio_publico || 0).toFixed(2)}</td>
                          <td>
                            <span style={{ 
                              fontWeight: 'bold', 
                              color: p.stock <= 5 ? '#ef4444' : '#10b981' 
                            }}>
                              {p.stock}
                            </span>
                          </td>
                          <td>
                            <span style={{ 
                              backgroundColor: p.estado === 'inactivo' ? '#fee2e2' : '#dcfce7',
                              color: p.estado === 'inactivo' ? '#991b1b' : '#166534',
                              padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' 
                            }}>
                              {p.estado === 'inactivo' ? 'Inactivo' : 'Activo'}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              style={{ backgroundColor: '#3b82f6', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                              onClick={() => handleAccionDesdeTabla(p, "actualizar")}
                            >
                              Editar
                            </button>
                            <button 
                              style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                              onClick={() => handleAccionDesdeTabla(p, "borrar")}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableContainer>
              )}

            </Section>
          )}

        </div>
      </PageContainer>
    </>
  );
};

export default Inventario
