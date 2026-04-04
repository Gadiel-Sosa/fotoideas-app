import Sidebar from "../components/Sidebar";
import "../styles/layout.css";

export default function MainLayout( { children }) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="content">{children}</div>
        </div>
    );
}