import { useState } from "react";

import "./Usuarios.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";
import Button from "../../components/ui/Button/Button";

import UserActions from "../../components/usuarios/UserActions/UserActions";
import UserTable from "../../components/usuarios/UserTable/UserTable";

const Usuarios = () => {

  const [tab, setTab] = useState("gestionar");

  return (
    <>
      <Header />

      <PageContainer>

        <div className="usuarios-container">

          <h2>Usuarios</h2>

          <div className="tabs usuarios-top">

            <Button
              variant={tab === "gestionar" ? "primary" : "secondary"}
              onClick={() => setTab("gestionar")}
            >
              Gestionar Usuarios
            </Button>

            <Button
              variant={tab === "consultar" ? "primary" : "secondary"}
              onClick={() => setTab("consultar")}
            >
              Consultar Usuarios
            </Button>

          </div>

          {tab === "gestionar" && (
            <Section className="usuarios-section">

              <div className="user-actions-wrapper">
                <UserActions />
              </div>

            </Section>
          )}

          {tab === "consultar" && (
            <Section className="usuarios-section">

              <UserTable />

            </Section>
          )}

        </div>

      </PageContainer>
    </>
  );
};

export default Usuarios