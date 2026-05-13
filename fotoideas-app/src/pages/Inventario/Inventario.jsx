import { useState, useEffect } from "react";

import "../Inventario/Inventario.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import InventoryForm from "../../components/inventario/InventoryForm/InventoryForm";
import InventoryTable from "../../components/inventario/InventoryTable/InventoryTable";

const Inventario = () => {

  const [tab, setTab] = useState("gestionar");
  const [accion, setAccion] = useState("agregar"); // Estado para alternar: agregar, actualizar, borrar
  const [productos, setProductos] = useState([]); // Estado para la tabla de consultar
  const [proveedoresList, setProveedoresList] = useState([]); // Lista para el dropdown de proveedores
  
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

  const cargarProveedores = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/proveedores");
      const data = await response.json();
      if (data.success) {
        setProveedoresList(data.proveedores);
      }
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };
  
  // Ejecutar la carga de productos cada vez que el usuario cambie a la pestaña "consultar"
  useEffect(() => {
    if (tab === "consultar") {
      cargarProductos();
    }
  }, [tab]);

  // Cargar lista de proveedores una sola vez al montar el componente (para el dropdown del formulario)
  useEffect(() => {
    cargarProveedores();
  }, []);

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
              <InventoryForm
                formData={formData}
                handleChange={handleChange}
                accion={accion}
                setAccion={setAccion}
                handleConfirmar={handleConfirmar}
                resetForm={resetForm}
                proveedoresList={proveedoresList}
              />
            </Section>
          )}

          {tab === "consultar" && (
            <Section className="inventario-section">
              <InventoryTable
                productos={productos}
                handleAccionDesdeTabla={handleAccionDesdeTabla}
              />
            </Section>
          )}

        </div>
      </PageContainer>
    </>
  );
};

export default Inventario
