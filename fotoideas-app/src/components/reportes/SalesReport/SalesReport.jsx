import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./SalesReport.css";

const SalesReport = () => {

  return (

    <ReportCard>

      {/* filtros */}

      <div className="sales-report-filters">

        <div className="sales-filter-field">

          <label>Fecha Inicial:</label>

          <input type="date" />

        </div>

        <div className="sales-filter-field">

          <label>Fecha Final:</label>

          <input type="date" />

        </div>

        <div className="sales-filter-field">

          <label>Sucursal:</label>

          <select defaultValue="">
            <option value="" disabled>
              Seleccionar...
            </option>
          </select>

        </div>

        <Button variant="primary">
          Confirmar
        </Button>

      </div>

      {/* tabla */}

      <div className="sales-report-content">

        <ReportTable
          title="Reporte:"
          placeholder="tabla_venta"
        />

      </div>

      {/* total */}

      <div className="sales-report-total">

        <label>Total:</label>

        <span>$0.00</span>

      </div>

    </ReportCard>

  );
};

export default SalesReport