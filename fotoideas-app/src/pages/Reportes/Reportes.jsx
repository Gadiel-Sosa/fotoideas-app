import { useState } from "react";

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

  return (

    <>
      <Header
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      <PageContainer>

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
              <SalesReport />
            )}

            {tab === "masVendidos" && (
              <BestSellersReport />
            )}

            {tab === "stockBajo" && (
              <LowStockReport />
            )}

            {tab === "comprasProveedor" && (
              <SupplierPurchasesReport />
            )}

          </Section>

        </div>

      </PageContainer>

    </>

  );
};

export default Reportes