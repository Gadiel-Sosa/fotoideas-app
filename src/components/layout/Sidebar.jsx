import { Link, useLocation } from "react-router-dom";
import "../../styles/sidebar.css";
import PageTitle from "../ui/PageTitle";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    {name: "Dashboard", path: "/dashboard"},
    {name: "Ventas", path: "/ventas" },
    {name: "Inventario", path: "/inventario" },
    {name: "Proveedores", path: "/proveedores" },
    {name: "Usuarios", path: "/usuarios" },
    {name: "Reportes", path: "/reportes"},
    {name: "Cerrar Sesión", path: "/"},
  ];

  return (
    <div className="sidebar">
      <PageTitle title="FOTOIDEAS"/>

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