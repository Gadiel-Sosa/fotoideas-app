import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";

import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";


const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ user: "", pass: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Limpiamos errores previos en caso de reintento

    try {
      // Petición al backend que conectamos con Docker (Postgres)
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Transformamos tu 'user' y 'pass' a los nombres que espera la API
        body: JSON.stringify({ username: form.user, password: form.pass })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Guardamos el token de autorización
        localStorage.setItem("auth", "true");
        // Guardamos la información del empleado que la API nos devuelve
        localStorage.setItem("user", JSON.stringify(data.user)); 
        
        navigate("/dashboard");
      } else {
        // Mostramos el error exacto que la base de datos devuelve (ej. "inactivo")
        setError(data.error || "Usuario o contraseña incorrecta");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error de conexión con el servidor.");
    }
  }


  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        <Input
          name="user"
          type="text"
          placeholder="Usuario"
          value={form.user}
          onChange={handleChange}
          required
        />

        <Input
          name="pass"
          type="password"
          placeholder="Contraseña"
          value={form.pass}
          onChange={handleChange}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
}

export default Login