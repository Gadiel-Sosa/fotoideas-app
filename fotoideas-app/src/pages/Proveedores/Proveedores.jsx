import { useState, useEffect } from "react";

import "./Proveedores.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import ProviderActions from "../../components/proveedores/ProviderActions/ProviderActions";
import ProviderAddForm from "../../components/proveedores/ProviderAddForm/ProviderAddForm";
import ProviderTable from "../../components/proveedores/ProviderTable/ProviderTable";

const Proveedores = () => {

  const [tab, setTab] = useState("gestionar");
  const [accion, setAccion] = useState("agregar"); // agregar, actualizar, borrar
  const [proveedoresList, setProveedoresList] = useState([]); // Datos para la tabla

  // Estado para capturar los datos del formulario de proveedores
  const [formData, setFormData] = useState({
    id_proveedor: "",
    nombre_proveedor: "",
    nombre_empresa: "",
    telefono_proveedor: "",
    correo_proveedor: "",
    RFC_proveedor: "",
    direccion_proveedor: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      id_proveedor: "", nombre_proveedor: "", nombre_empresa: "",
      telefono_proveedor: "", correo_proveedor: "", RFC_proveedor: "", direccion_proveedor: ""
    });
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

  // Cargar datos cuando se entra a la pestaña de consultas
  useEffect(() => {
    if (tab === "consultar") {
      cargarProveedores();
    }
  }, [tab]);

  const handleAccionDesdeTabla = (proveedor, nuevaAccion) => {
    setAccion(nuevaAccion);
    setTab("gestionar");
    setFormData({
      id_proveedor: proveedor.id_proveedor || "",
      nombre_proveedor: proveedor.nombre_proveedor || "",
      nombre_empresa: proveedor.nombre_empresa || "",
      telefono_proveedor: proveedor.telefono_proveedor || "",
      correo_proveedor: proveedor.correo_proveedor || "",
      RFC_proveedor: proveedor.rfc_proveedor || "",
      direccion_proveedor: proveedor.direccion_proveedor || ""
    });
  };

  const handleConfirmar = async () => {
    if (accion === "agregar") {
      if (!formData.nombre_proveedor) {
        alert("El nombre del contacto del proveedor es obligatorio.");
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/api/proveedores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
          alert(`Proveedor guardado exitosamente. ID asignado: ${data.id_proveedor}`);
          resetForm();
        } else {
          alert("Error al guardar: " + data.error);
        }
      } catch (error) {
        alert("Error de conexión con el servidor.");
      }
    } else if (accion === "actualizar") {
      try {
        const response = await fetch(`http://localhost:3000/api/proveedores/${formData.id_proveedor}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
          alert("Proveedor actualizado exitosamente");
          resetForm();
          setTab("consultar"); // Regresamos a la tabla
        } else {
          alert("Error al actualizar: " + data.error);
        }
      } catch (error) {
        alert("Error de conexión con el servidor.");
      }
    } else if (accion === "borrar") {
      try {
        const response = await fetch(`http://localhost:3000/api/proveedores/${formData.id_proveedor}`, {
          method: "DELETE"
        });
        const data = await response.json();
        if (data.success) {
          alert("Proveedor eliminado exitosamente");
          resetForm();
          setTab("consultar");
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

        <div className="proveedores-container">

          <h2>Proveedor</h2>

          <div className="tabs proveedores-top">

            <Button
              variant={tab === "gestionar" ? "primary" : "secondary"}
              onClick={() => setTab("gestionar")}
            >
              Gestionar Proveedores
            </Button>

            <Button
              variant={tab === "consultar" ? "primary" : "secondary"}
              onClick={() => setTab("consultar")}
            >
              Consultar Proveedores
            </Button>

          </div>

          {tab === "gestionar" && (
            <Section className="proveedores-section">
              <ProviderActions accion={accion} setAccion={setAccion} />
              <ProviderAddForm 
                formData={formData}
                handleChange={handleChange}
                accion={accion}
                handleConfirmar={handleConfirmar}
                resetForm={resetForm}
              />
            </Section>
          )}

          {tab === "consultar" && (
            <Section className="proveedores-section">
              <ProviderTable 
                proveedores={proveedoresList}
                handleAccionDesdeTabla={handleAccionDesdeTabla}
              />
            </Section>
          )}

        </div>

      </PageContainer>
    </>
  );
};

export default Proveedores