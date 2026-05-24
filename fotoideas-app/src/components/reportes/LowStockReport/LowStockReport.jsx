import { useState, useEffect } from "react";
import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./LowStockReport.css";

const LowStockReport = ({ search }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/reportes/stock-bajo`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const result = await res.json();
      if (result.success) setDatos(result.datos);
    } catch (error) {
      console.error("Error al obtener reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const datosFiltrados = search
    ? datos.filter(d =>
        d.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        d.codigo?.toLowerCase().includes(search.toLowerCase())
      )
    : datos;

  return (

    <ReportCard>

      <div className="low-stock-filters">

        <div className="low-stock-field">

          <label>Sucursal:</label>

          <select defaultValue="">
            <option value="" disabled>
              Seleccionar...
            </option>
            <option value="1">Sucursal Principal</option>
          </select>

        </div>

        <Button variant="primary" onClick={handleFetch} disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>

      </div>

      <div className="low-stock-content">

        <ReportTable title="Stock crítico (10 o menos unidades):" placeholder="Cargando stock...">
          {datos.length > 0 && (
            <table className="report-data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.map((d, i) => (
                  <tr key={i}>
                    <td>{d.codigo || "N/A"}</td>
                    <td className="font-medium">{d.nombre}</td>
                    <td className="text-danger">{d.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ReportTable>

      </div>

      <div className="low-stock-total">

        <label>Total:</label>

        <span>{datosFiltrados.length} productos en riesgo</span>

      </div>

    </ReportCard>

  );
};

export default LowStockReport