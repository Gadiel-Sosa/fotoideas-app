import "./styles/global.css"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import ProtectedRoute from "./components/auth/ProtectedRoute"
import MainLayout from "./layouts/MainLayout"

import Dashboard from "./pages/Dashboard"
import Ventas from "./pages/Ventas"
import Inventario from "./pages/Inventario"
import Proveedores from "./pages/Proveedores"
import Usuarios from "./pages/Usuarios"
import Login from "./pages/Login"
import Reportes from "./pages/Reportes"
import Logout from "./components/auth/LogoutButton"


const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* redirect inicial */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* rutas privadas */}
        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/" element={<Logout />} />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App