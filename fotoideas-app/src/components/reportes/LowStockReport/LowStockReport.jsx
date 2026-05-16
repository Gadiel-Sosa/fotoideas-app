import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./LowStockReport.css";

const LowStockReport = () => {

  return (

    <ReportCard>

      <div className="low-stock-filters">

        <div className="low-stock-field">

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

      <div className="low-stock-content">

        <ReportTable
          title="Stock crítico:"
          placeholder="tabla_stock_bajo"
        />

      </div>

      <div className="low-stock-total">

        <label>Total:</label>

        <span>0 productos</span>

      </div>

    </ReportCard>

  );
};

export default LowStockReport