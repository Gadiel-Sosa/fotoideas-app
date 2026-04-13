import Sidebar from "../components/layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";

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