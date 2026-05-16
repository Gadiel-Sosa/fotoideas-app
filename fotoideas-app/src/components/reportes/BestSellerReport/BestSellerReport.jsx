import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./BestSellerReport.css";

const BestSellersReport = () => {

  return (

    <ReportCard>

      <div className="best-report-filters">

        <div className="best-filter-field">
          <label>Fecha Inicial:</label>
          <input type="date" />
        </div>

        <div className="best-filter-field">
          <label>Fecha Final:</label>
          <input type="date" />
        </div>

        <div className="best-filter-field">
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

      <div className="best-report-content">

        <ReportTable
          title="Más vendidos:"
          placeholder="tabla_mas_vendidos"
        />

      </div>

    </ReportCard>

  );
};

export default BestSellersReport