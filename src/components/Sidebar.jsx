import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    {name: "Dashboard", path: "/"},
    { name: "Ventas", path: "/ventas" },
    { name: "Inventario", path: "/inventario" },
    { name: "Proveedores", path: "/proveedores" },
    { name: "Usuarios", path: "/usuarios" },
    {name: "Reportes", path: "/reportes"}
  ];

  return (
    <div className="sidebar">
      <h2>FOTOIDEAD</h2>

      <nav>
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
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}