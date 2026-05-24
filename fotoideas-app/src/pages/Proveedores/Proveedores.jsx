import { useState, useEffect } from "react";

import "./Proveedores.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import ProviderActions from "../../components/proveedores/ProviderActions/ProviderActions";

import ProviderAddForm from "../../components/proveedores/ProviderAddForm/ProviderAddForm";
import ProviderUpdateForm from "../../components/proveedores/ProviderUpdateForm/ProviderUpdateForm";
import ProviderDeleteForm from "../../components/proveedores/ProviderDeleteForm/ProviderDeleteForm";

import ProviderTable from "../../components/proveedores/ProviderTable/ProviderTable";

import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider
} from "../../services/providerService";

const initialProviderState = {

  id_proveedor: "",

  nombre_proveedor: "",

  nombre_empresa: "",

  telefono_proveedor: "",

  correo_proveedor: "",

  RFC_proveedor: "",

  direccion_proveedor: "",

  giro: "",

  estado_proveedor: "",

  tipo_movimiento: "",

  descripcion_movimiento: "",

  fecha_movimiento: "",

  hora_movimiento: ""
};

const Proveedores = () => {

  const [tab, setTab] = useState("gestionar");

  const [accion, setAccion] = useState("agregar");

  const [proveedoresList, setProveedoresList] = useState([]);

  const [formData, setFormData] = useState(initialProviderState);

  const [search, setSearch] = useState("");

  // Obtener datos del usuario logueado y verificar si es Admin
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (userLocal) {
      setUsuario(userLocal);
    }
  }, []);

  const isAdmin = usuario && (usuario.nombre_rol === "Admin" || usuario.nombre_rol === "Administrador");

  // MANEJO INPUTS

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // RESET FORM

  const resetForm = () => {
    setFormData(initialProviderState);
  };

  // CARGAR PROVEEDORES

  const cargarProveedores = async () => {

    try {

      const data = await getProviders();

      if (data.success) {
        setProveedoresList(data.proveedores);
      }

    } catch (error) {

      console.error(error);
    }
  };

  // CONSULTAS

  useEffect(() => {

    if (tab === "consultar") {
      cargarProveedores();
    }

  }, [tab]);

  // TABLA → FORMULARIO

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

  // AGREGAR

  const handleAgregarProveedor = async () => {

    try {

      const data = await createProvider(formData);

      if (data.success) {

        alert("Proveedor agregado correctamente");

        resetForm();

      } else {

        alert(data.error);
      }

    } catch (error) {

      alert("Error del servidor");
    }
  };

  // ACTUALIZAR

  const handleActualizarProveedor = async () => {

    try {

      const data = await updateProvider(
        formData.id_proveedor,
        formData
      );

      if (data.success) {

        alert("Proveedor actualizado");

        resetForm();

        setTab("consultar");

      } else {

        alert(data.error);
      }

    } catch (error) {

      alert("Error del servidor");
    }
  };

  // ELIMINAR

  const handleEliminarProveedor = async () => {

    try {

      const data = await deleteProvider(
        formData.id_proveedor
      );

      if (data.success) {

        alert("Proveedor eliminado");

        resetForm();

        setTab("consultar");

      } else {

        alert(data.error);
      }

    } catch (error) {

      alert("Error del servidor");
    }
  };

  // CONFIRMAR SEGÚN ACCIÓN

  const acciones = {

    agregar: handleAgregarProveedor,

    actualizar: handleActualizarProveedor,

    borrar: handleEliminarProveedor
  };

  const handleConfirmar = () => {
    acciones[accion]();
  };

  const filteredProviders = proveedoresList.filter((proveedor) => {

  const textoBusqueda = search.toLowerCase();

  return (
    proveedor.nombre_proveedor?.toLowerCase().includes(textoBusqueda) ||
    proveedor.nombre_empresa?.toLowerCase().includes(textoBusqueda) ||
    proveedor.correo_proveedor?.toLowerCase().includes(textoBusqueda) ||
    proveedor.telefono_proveedor?.toLowerCase().includes(textoBusqueda)
  );
});

  return (
    <>
      <Header
        showSearch={isAdmin && tab === "consultar"}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      <PageContainer>

        {usuario && !isAdmin ? (
          <Section>
            <h2 style={{ color: "#ef4444", textAlign: "center", marginTop: "50px" }}>
              Acceso Denegado: No tienes permisos para ver el módulo de proveedores.
            </h2>
          </Section>
        ) : (

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

              <ProviderActions
                accion={accion}
                setAccion={setAccion}
                resetForm={resetForm}
              />

              {accion === "agregar" && (

                <ProviderAddForm
                  formData={formData}
                  handleChange={handleChange}
                  handleConfirmar={handleConfirmar}
                />
              )}

              {accion === "actualizar" && (

                <ProviderUpdateForm
                  formData={formData}
                  handleChange={handleChange}
                  handleConfirmar={handleConfirmar}
                />
              )}

              {accion === "borrar" && (

                <ProviderDeleteForm
                  formData={formData}
                  handleChange={handleChange}
                  handleConfirmar={handleConfirmar}
                  resetForm={resetForm}
                />
              )}

            </Section>
          )}

          {tab === "consultar" && (

            <Section className="proveedores-section">

              <ProviderTable
                proveedores={filteredProviders}
                handleAccionDesdeTabla={handleAccionDesdeTabla}
              />

            </Section>
          )}

        </div>

        )}

      </PageContainer>
    </>
  );
};

export default Proveedores
