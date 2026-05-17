import { useState, useEffect } from "react";

import { getStats } from "../../services/dashboardService";

import PageContainer from "../../components/ui/PageContainer/PageContainer";
import StatsGrid from "../../components/ui/StatsGrid/StatsGrid";
import Card from "../../components/ui/Card/Card";
import Header from "../../components/layout/Header/Header";
import Section from "../../components/ui/Section/Section";
import "./Dashboard.css";


const Dashboard = () => {

  const [stats, setStats] = useState({
    ventasDelDia: 0,
    inventario: 0,
    proveedores: 0,
    alertas: 0
  });

  const [search, setSearch] = useState("");

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

  }, []);


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

            <Card
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
            />

          ))}

        </StatsGrid>

        <Section title="Productos con stock bajo" />

      </PageContainer>
    </>
  )

}

export default Dashboard;