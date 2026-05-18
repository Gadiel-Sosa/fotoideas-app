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

  const location = useLocation();

  // Obtener datos del usuario logueado y verificar si es Admin
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (userLocal) {
      setUsuario(userLocal);
    }
  }, []);

  const isAdmin = usuario && (usuario.nombre_rol === "Admin" || usuario.nombre_rol === "Administrador");

  const menu = [
  { name: "Tablero", path: "/dashboard", icon: <FaHome /> },
  { name: "Ventas", path: "/ventas", icon: <FaCashRegister /> },
  { name: "Inventario", path: "/inventario", icon: <FaBox /> },
  { name: "Proveedores", path: "/proveedores", icon: <FaTruck />, reqAdmin: true },
  { name: "Usuarios", path: "/usuarios", icon: <FaUsers />, reqAdmin: true },
  { name: "Reportes", path: "/reportes", icon: <FaChartBar />, reqAdmin: true }
  ];

  // Filtramos para que solo pasen los que NO requieren admin, o si el usuario SÍ es admin
  const menuFiltrado = menu.filter(item => !item.reqAdmin || isAdmin);

  return (
    <aside className="sidebar">

      <div className="sidebar-top">

        <div className="user-box">
          <FaUserCircle />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', lineHeight: '1' }}>{usuario ? usuario.nombre_empleado : "Cargando..."}</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1' }}>{usuario ? usuario.nombre_rol : ""}</span>
          </div>
        </div>
        <nav className="sidebar-menu">

          {menuFiltrado.map((item) => (

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

        <Link to="/" className="menu-item logout">
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </Link>

      </div>

    </aside>
  );
}

export default Sidebar