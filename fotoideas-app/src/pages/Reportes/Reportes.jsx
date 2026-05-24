import { useState, useEffect } from "react";

import "./Reportes.css";

import Header from "../../components/layout/Header/Header";
import PageContainer from "../../components/ui/PageContainer/PageContainer";
import Section from "../../components/ui/Section/Section";

import ReportActions from "../../components/reportes/ReportActions/ReportActions";

import SalesReport from "../../components/reportes/SalesReport/SalesReport";
import BestSellersReport from "../../components/reportes/BestSellerReport/BestSellerReport";
import LowStockReport from "../../components/reportes/LowStockReport/LowStockReport";
import SupplierPurchasesReport from "../../components/reportes/SupplierPurchasesReport/SupplierPurchasesReport";

const Reportes = () => {

  const [tab, setTab] = useState("ventas");

  const [search, setSearch] = useState("");

  // Obtener datos del usuario logueado y verificar si es Admin
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (userLocal) {
      setUsuario(userLocal);
    }
  }, []);

  const isAdmin = usuario && (usuario.nombre_rol === "Admin" || usuario.nombre_rol === "Administrador");

  return (

    <>
      <Header
        showSearch={isAdmin}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      <PageContainer>

        {usuario && !isAdmin ? (
          <Section>
            <h2 style={{ color: "#ef4444", textAlign: "center", marginTop: "50px" }}>
              Acceso Denegado: No tienes permisos para ver el módulo de reportes.
            </h2>
          </Section>
        ) : (

        <div className="reportes-container">

          <h2>Reportes</h2>

          {/* BOTONES SUPERIORES */}

          <ReportActions
            tab={tab}
            setTab={setTab}
          />

          {/* CONTENIDO */}

          <Section className="reportes-section">

            {tab === "ventas" && (
              <SalesReport search={search} />
            )}

            {tab === "masVendidos" && (
              <BestSellersReport search={search} />
            )}

            {tab === "stockBajo" && (
              <LowStockReport search={search} />
            )}

            {tab === "comprasProveedor" && (
              <SupplierPurchasesReport search={search} />
            )}

          </Section>

        </div>

        )}

      </PageContainer>

    </>

  );
};

export default Reportes