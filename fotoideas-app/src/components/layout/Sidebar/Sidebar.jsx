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

  const menu = [
  { name: "Tablero", path: "/dashboard", icon: <FaHome /> },
  { name: "Ventas", path: "/ventas", icon: <FaCashRegister /> },
  { name: "Inventario", path: "/inventario", icon: <FaBox /> },
  { name: "Proveedores", path: "/proveedores", icon: <FaTruck /> },
  { name: "Usuarios", path: "/usuarios", icon: <FaUsers /> },
  { name: "Reportes", path: "/reportes", icon: <FaChartBar /> }
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-top">

        <div className="user-box">
          <FaUserCircle />
          <span>Usuario X</span>
        </div>
        <nav className="sidebar-menu">

          {menu.map((item) => (

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