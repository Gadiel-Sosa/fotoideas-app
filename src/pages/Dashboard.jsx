import Header from "../components/layout/Header";
import PageContainer from "../components/ui/PageContainer";
import StatsGrid from "../components/ui/StatsGrid";
import Card from "../components/ui/Tarjeta";

const Dashboard = () => {
  return (
    <PageContainer>
      <Header />

      <StatsGrid>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <Card title="Ventas del Día" value="$0" subtitle="Sin datos" />
          <Card title="Inventario" value="0" subtitle="Sin datos" />
          <Card title="Proveedores" value="0" subtitle="Sin datos" />
          <Card title="Alertas" value="0" subtitle="Sin datos" />
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
        <p>Aquí se mostrarán datos desde la base de datos</p>
      </div>
    </PageContainer>
  );
}

export default Dashboard