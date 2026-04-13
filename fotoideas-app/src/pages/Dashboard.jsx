import { useState, useEffect } from "react";
import Header from "../components/layout/Header/Header";
import PageContainer from "../components/ui/PageContainer/PageContainer";
import StatsGrid from "../components/ui/StatsGrid/StatsGrid";
import Card from "../components/ui/Card/Card";

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventasDelDia: 0,
    inventario: 0,
    proveedores: 0,
    alertas: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error al obtener stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <PageContainer>
      <Header />

      <StatsGrid>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <Card title="Ventas del Día" value={`$${stats.ventasDelDia}`} subtitle="Actualizado hoy" />
          <Card title="Inventario" value={stats.inventario.toString()} subtitle="Productos totales" />
          <Card title="Proveedores" value={stats.proveedores.toString()} subtitle="Activos" />
          <Card title="Alertas" value={stats.alertas.toString()} subtitle="Stock bajo" />
        </div>
      </StatsGrid>

      <div
        style={{
          background: "white",
          marginTop: "30px",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>Productos con stock bajo</h3>
        <br />
        <p>Aquí se mostrarán datos desde la base de datos</p>
      </div>
    </PageContainer>
  );
}

export default Dashboard