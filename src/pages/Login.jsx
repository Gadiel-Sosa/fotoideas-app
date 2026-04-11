import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";

import Input from "../components/ui/Input/Input";
import authServices from "../services/authServices"
import Button from "../components/ui/Button/Button";


const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ user: "", pass: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const handleLogin = (event) => {
    event.preventDefault();

    // Validación temporal
    if (authServices.login(form)) {
      navigate("/dashboard")
    }else{
      setError("Usuario o contraseña incorrecta")
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