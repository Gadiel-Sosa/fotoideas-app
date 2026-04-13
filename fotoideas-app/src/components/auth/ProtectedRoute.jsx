import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuth = localStorage.getItem("auth") === "true";

  // revisamos las credenciales
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;// protege grupos completos de rutas
}

export default ProtectedRoute