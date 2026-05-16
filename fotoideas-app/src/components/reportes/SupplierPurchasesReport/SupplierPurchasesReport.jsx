import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./SupplierPurchasesReport.css";

const SupplierPurchasesReport = () => {

  return (

    <ReportCard>

      <div className="supplier-report-filters">

        <div className="supplier-filter-field">
          <label>Proveedor:</label>

          <select defaultValue="">
            <option value="" disabled>
              Seleccionar...
            </option>
          </select>
        </div>

        <div className="supplier-filter-field">
          <label>Fecha Inicial:</label>
          <input type="date" />
        </div>

        <div className="supplier-filter-field">
          <label>Fecha Final:</label>
          <input type="date" />
        </div>

        <Button variant="primary">
          Confirmar
        </Button>

      </div>

      <div className="supplier-report-content">

        <ReportTable
          title="Compras proveedor:"
          placeholder="tabla_compras"
        />

      </div>

    </ReportCard>

  );
};

export default SupplierPurchasesReport