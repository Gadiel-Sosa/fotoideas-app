import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

const MainLayout = () => {
    return (
        <div className="layout">
            <Sidebar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout