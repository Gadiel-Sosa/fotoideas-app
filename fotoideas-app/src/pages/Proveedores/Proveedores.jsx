import { useState } from "react";

import "./Proveedores.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import ProviderActions from "../../components/proveedores/ProviderActions/ProviderActions";
import ProviderForm from "../../components/proveedores/ProviderAddForm/ProviderAddForm";
import ProviderTable from "../../components/proveedores/ProviderTable/ProviderTable";

const Proveedores = () => {

  const [tab, setTab] = useState("gestionar");

  return (
    <>
      <Header />

      <PageContainer>

        <div className="proveedores-container">

          <h2>Proveedor</h2>

          <div className="tabs proveedores-top">

            <Button
              variant={tab === "gestionar" ? "primary" : "secondary"}
              onClick={() => setTab("gestionar")}
            >
              Gestionar Proveedores
            </Button>

            <Button
              variant={tab === "consultar" ? "primary" : "secondary"}
              onClick={() => setTab("consultar")}
            >
              Consultar Proveedores
            </Button>

          </div>

          {tab === "gestionar" && (
            <Section className="proveedores-section">

              <div className="provider-actions-wrapper">
                <ProviderActions />
              </div>

            </Section>
          )}

          {tab === "consultar" && (
            <Section className="proveedores-section">
              <ProviderTable />
            </Section>
          )}

        </div>

      </PageContainer>
    </>
  );
};

export default Proveedores