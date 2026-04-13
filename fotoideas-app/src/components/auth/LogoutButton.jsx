import { useNavigate } from "react-router-dom";

const Logout = () =>{
    const navigate = useNavigate()
    const handleLogout = () =>{
        localStorage.removeItem("auth")
        navigate("/", {replace: true})
    }

    return (
        <div onClick={handleLogout}>
            Cerrar Sesión
        </div>
    )
}

export default Logout