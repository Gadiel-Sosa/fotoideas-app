import { useState } from "react";

import "../Inventario/Inventario.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import InventoryActions from "../../components/inventario/InventoryActions/InventoryActions";
import InventoryForm from "../../components/inventario/InventoryForm/InventoryForm";
import InventoryTable from "../../components/inventario/InventoryTable/InventoryTable"; // después

const Inventario = () => {

  const [tab, setTab] = useState("gestionar");

  return (
    <>
      <Header />

      <PageContainer>
        <div className="inventario-container">

          <h2>Inventario</h2>

          <div className="tabs inventario-top">

            <Button
              variant={tab === "gestionar" ? "primary" : "secondary"}
              onClick={() => setTab("gestionar")}
            >
              Gestionar Productos
            </Button>

            <Button
              variant={tab === "consultar" ? "primary" : "secondary"}
              onClick={() => setTab("consultar")}
            >
              Consultar Inventario
            </Button>

          </div>

          {tab === "gestionar" && (
            <Section className="inventario-section">

              <div className="inventory-actions-wrapper">
                <InventoryActions />
              </div>
              
              <div className="inventario-content">
                <InventoryForm />
              </div>

            </Section>
          )}

          {tab === "consultar" && (
            <Section className="inventario-section">

              <InventoryTable />

            </Section>
          )}

        </div>
      </PageContainer>
    </>
  );
};

export default Inventario
