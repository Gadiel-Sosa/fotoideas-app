import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCashRegister, FaBox, FaUserPlus } from "react-icons/fa";

import { getStats } from "../../services/dashboardService";

import PageContainer from "../../components/ui/PageContainer/PageContainer";
import StatsGrid from "../../components/ui/StatsGrid/StatsGrid";
import Card from "../../components/ui/Card/Card";
import Header from "../../components/layout/Header/Header";
import Section from "../../components/ui/Section/Section";
import "./Dashboard.css";


const Dashboard = () => {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    ventasDelDia: 0,
    inventario: 0,
    proveedores: 0,
    alertas: 0
  });

  const [search, setSearch] = useState("");

  // Obtener datos del usuario logueado
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();

    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (userLocal) {
      setUsuario(userLocal);
    }
  }, []);

  // Validar si el usuario activo es administrador
  const isAdmin = usuario && (usuario.nombre_rol === "Admin" || usuario.nombre_rol === "Administrador");

  const cards = [
    {
      title: "Ventas del Día",
      value: `$${stats.ventasDelDia}`,
      subtitle: "Actualizado hoy"
    },
    {
      title: "Inventario",
      value: stats.inventario,
      subtitle: "Productos totales"
    },
    {
      title: "Proveedores",
      value: stats.proveedores,
      subtitle: "Activos"
    },
    {
      title: "Alertas",
      value: stats.alertas,
      subtitle: "Stock bajo"
    }
  ];


  return (
    <>
      <Header
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      <PageContainer>

        <StatsGrid>

          {cards.map((card) => (
            <div key={card.title} className="hover-card" style={{ height: '100%' }}>
              <Card
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
              />
            </div>

          ))}

        </StatsGrid>

        {/* Solo mostramos los accesos rápidos si el usuario es Administrador */}
        {isAdmin && (
          <Section title="Accesos Rápidos">
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              
              <button onClick={() => navigate('/ventas')} className="quick-action-btn" style={{ flex: 1, padding: '20px', borderRadius: '12px', border: 'none', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <FaCashRegister size={32} />
                Nueva Venta
              </button>

              <button onClick={() => navigate('/inventario')} className="quick-action-btn" style={{ flex: 1, padding: '20px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <FaBox size={32} />
                Añadir Producto
              </button>

              <button onClick={() => navigate('/usuarios')} className="quick-action-btn" style={{ flex: 1, padding: '20px', borderRadius: '12px', border: 'none', backgroundColor: '#8b5cf6', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <FaUserPlus size={32} />
                Añadir Usuario
              </button>

            </div>
          </Section>
        )}

      </PageContainer>
    </>
  )

}

export default Dashboard;