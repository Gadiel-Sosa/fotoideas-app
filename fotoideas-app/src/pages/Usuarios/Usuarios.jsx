import { useState, useEffect } from "react";

import "./Usuarios.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import UserActions from "../../components/usuarios/UserActions/UserActions";
import UserTable from "../../components/usuarios/UserTable/UserTable";
import UserAddForm from "../../components/usuarios/UserAddForm/UserAddForm";
import UserUpdateForm from "../../components/usuarios/UserUpdateForm/UserUpdateForm";
import UserDeleteForm from "../../components/usuarios/UserDeleteForm/UserDeleteForm";

const initialUserState = {
  id_empleado: "",
  nombre_empleado: "",
  telefono_empleado: "",
  direccion_empleado: "",
  fecha_nacimiento: "",
  rfc_empleado: "",
  nss_empleado: "",
  id_sucursal: 1, // Por defecto la sucursal 1
  username: "",
  password: "",
  estado_credencial: true,
  id_rol: 1, // Para el select de Rol
  estado: "Activo" // Para el select de Estado
};

const Usuarios = () => {

  const [tab, setTab] = useState("gestionar");
  const [accion, setAccion] = useState("agregar");
  const [usuariosList, setUsuariosList] = useState([]);
  const [formData, setFormData] = useState(initialUserState);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData(initialUserState);
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios");
      const data = await response.json();
      if (data.success) {
        setUsuariosList(data.usuarios);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Cargar usuarios cuando se entra a la pestaña "consultar"
  useEffect(() => {
    if (tab === "consultar") {
      cargarUsuarios();
    }
  }, [tab]);

  const handleAccionDesdeTabla = (usuario, nuevaAccion) => {
    setAccion(nuevaAccion);
    setTab("gestionar");

    // Formatear la fecha para que el input type="date" la entienda (YYYY-MM-DD)
    let fechaNac = "";
    try {
      if (usuario.fecha_nacimiento) {
        fechaNac = new Date(usuario.fecha_nacimiento).toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn("Fecha de nacimiento no válida o ausente, se dejará en blanco", error);
    }

    setFormData({
      id_empleado: usuario.id_empleado || "",
      nombre_empleado: usuario.nombre_empleado || "",
      telefono_empleado: usuario.telefono_empleado || "",
      direccion_empleado: usuario.direccion_empleado || "",
      fecha_nacimiento: fechaNac,
      rfc_empleado: usuario.rfc_empleado || "",
      nss_empleado: usuario.nss_empleado || "",
      id_sucursal: usuario.id_sucursal || 1,
      username: usuario.username || "",
      password: "", // Nunca mostramos la contraseña actual por seguridad
      estado_credencial: usuario.estado_credencial !== undefined ? usuario.estado_credencial : true,
      id_rol: usuario.id_rol || 1,
      estado: usuario.estado_credencial === false ? "Inactivo" : "Activo"
    });
  };

  const handleConfirmar = async () => {
    // Validar longitud de la contraseña por seguridad
    if ((accion === "agregar" || (accion === "actualizar" && formData.password)) &&
      (formData.password.length < 8 || formData.password.length > 12)) {
      alert("Por seguridad, la contraseña debe tener entre 8 y 12 caracteres.");
      return;
    }

    try {
      let url = "http://localhost:3000/api/usuarios";
      let method = "POST"; // Agregar

      if (accion === "actualizar") {
        url = `http://localhost:3000/api/usuarios/${formData.id_empleado}`;
        method = "PUT";
      } else if (accion === "borrar") {
        url = `http://localhost:3000/api/usuarios/${formData.id_empleado}`;
        method = "DELETE";
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`Usuario ${accion === 'agregar' ? 'registrado' : accion === 'actualizar' ? 'actualizado' : 'desactivado'} exitosamente`);
        resetForm();
        if (accion !== "agregar") setTab("consultar");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  const filteredUsers = usuariosList.filter((usuario) => {

    // Si la barra de búsqueda está vacía, mostramos a todos
    if (!search) return true; 

    const texto = search.toLowerCase();

    return (
      usuario.nombre_empleado?.toLowerCase().includes(texto) ||
      usuario.username?.toLowerCase().includes(texto) ||
      // Lo convertimos a string por seguridad en caso de que venga vacío o como número
      String(usuario.telefono_empleado || "").toLowerCase().includes(texto) ||
      usuario.rfc_empleado?.toLowerCase().includes(texto)
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
              Acceso Denegado: No tienes permisos para ver el módulo de usuarios.
            </h2>
          </Section>
        ) : (

        <div className="usuarios-container">

          <h2>Usuarios</h2>

          <div className="tabs usuarios-top">

            <Button
              variant={tab === "gestionar" ? "primary" : "secondary"}
              onClick={() => setTab("gestionar")}
            >
              Gestionar Usuarios
            </Button>

            <Button
              variant={tab === "consultar" ? "primary" : "secondary"}
              onClick={() => setTab("consultar")}
            >
              Consultar Usuarios
            </Button>

          </div>

          {tab === "gestionar" && (
            <Section className="usuarios-section">

              <div className="user-actions-wrapper">
                <UserActions
                  accion={accion}
                  setAccion={setAccion}
                  resetForm={resetForm}
                />

                {accion === "agregar" && (
                  <UserAddForm
                    formData={formData}
                    handleChange={handleChange}
                    handleConfirmar={handleConfirmar}
                    resetForm={resetForm}
                  />
                )}

                {accion === "actualizar" && (
                  <UserUpdateForm
                    formData={formData}
                    handleChange={handleChange}
                    handleConfirmar={handleConfirmar}
                    resetForm={resetForm}
                  />
                )}

                {accion === "borrar" && (
                  <UserDeleteForm
                    formData={formData}
                    handleConfirmar={handleConfirmar}
                    resetForm={resetForm}
                  />
                )}
              </div>
            </Section>
          )}

          {tab === "consultar" && (
            <Section>
              <UserTable
                usuarios={filteredUsers}
                usuariosList={filteredUsers}
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

export default Usuarios;