import { useState, useEffect } from "react";
import { FaHome,
  FaCashRegister,
  FaBox,
  FaTruck,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaUserCircle
 } from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {

  const [usuario, setUsuario] = useState(null);
  const location = useLocation();

<<<<<<< HEAD
  useEffect(() => {
    // Recuperamos los datos del usuario logueado de la persistencia local
=======
  // Obtener datos del usuario logueado y verificar si es Admin
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
>>>>>>> a5cd69375545ee203ee97348d86e486b78ab0f17
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (userLocal) {
      setUsuario(userLocal);
    }
  }, []);

<<<<<<< HEAD
  // Lógica de detección de rol consistente con el resto del proyecto
  const isAdmin = usuario && (usuario.nombre_rol === "Admin" || usuario.nombre_rol === "Administrador");

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  };

=======
  const isAdmin = usuario && (usuario.nombre_rol === "Admin" || usuario.nombre_rol === "Administrador");

>>>>>>> a5cd69375545ee203ee97348d86e486b78ab0f17
  const menu = [
  { name: "Tablero", path: "/dashboard", icon: <FaHome /> },
  { name: "Ventas", path: "/ventas", icon: <FaCashRegister /> },
  { name: "Inventario", path: "/inventario", icon: <FaBox /> },
<<<<<<< HEAD
  { name: "Proveedores", path: "/proveedores", icon: <FaTruck />, adminOnly: true },
  { name: "Usuarios", path: "/usuarios", icon: <FaUsers />, adminOnly: true },
  { name: "Reportes", path: "/reportes", icon: <FaChartBar />, adminOnly: true }
=======
  { name: "Proveedores", path: "/proveedores", icon: <FaTruck />, reqAdmin: true },
  { name: "Usuarios", path: "/usuarios", icon: <FaUsers />, reqAdmin: true },
  { name: "Reportes", path: "/reportes", icon: <FaChartBar />, reqAdmin: true }
>>>>>>> a5cd69375545ee203ee97348d86e486b78ab0f17
  ];

  // Filtramos para que solo pasen los que NO requieren admin, o si el usuario SÍ es admin
  const menuFiltrado = menu.filter(item => !item.reqAdmin || isAdmin);

  return (
    <aside className="sidebar">

      <div className="sidebar-top">

        <div className="user-box">
          <FaUserCircle />
<<<<<<< HEAD
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
              {usuario ? usuario.nombre_empleado : "Invitado"}
            </span>
            <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
              {isAdmin ? "Admin" : "Empleado"}
            </span>
=======
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', lineHeight: '1' }}>{usuario ? usuario.nombre_empleado : "Cargando..."}</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1' }}>{usuario ? usuario.nombre_rol : ""}</span>
>>>>>>> a5cd69375545ee203ee97348d86e486b78ab0f17
          </div>
        </div>
        <nav className="sidebar-menu">

<<<<<<< HEAD
          {menu
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => (
=======
          {menuFiltrado.map((item) => (
>>>>>>> a5cd69375545ee203ee97348d86e486b78ab0f17

            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "menu-item active"
                  : "menu-item"
              }
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>

          ))}

        </nav>

      </div>

      <div className="sidebar-bottom">

        <Link to="/" className="menu-item logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </Link>

      </div>

    </aside>
  );
}

export default Sidebar