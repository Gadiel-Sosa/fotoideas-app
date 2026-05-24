import { useNavigate } from "react-router-dom";

const Logout = () =>{
    const navigate = useNavigate()
    const handleLogout = () =>{
        localStorage.removeItem("auth")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/", {replace: true})
    }

    return (
        <div onClick={handleLogout}>
            Cerrar Sesión
        </div>
    )
}

export default Logout