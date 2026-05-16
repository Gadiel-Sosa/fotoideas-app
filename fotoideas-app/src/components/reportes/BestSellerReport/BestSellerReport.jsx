import { useState } from "react";
import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./BestSellerReport.css";

const BestSellersReport = () => {
  const hoy = new Date().toISOString().split('T')[0];
  const [fechas, setFechas] = useState({ inicio: hoy, fin: hoy });
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/reportes/mas-vendidos?inicio=${fechas.inicio}&fin=${fechas.fin}`);
      const result = await res.json();
      if (result.success) setDatos(result.datos);
    } catch (error) {
      console.error("Error al obtener reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <ReportCard>

      <div className="best-report-filters">
        <div className="best-filter-field">
          <label>Fecha Inicial:</label>
          <input type="date" value={fechas.inicio} onChange={(e) => setFechas({ ...fechas, inicio: e.target.value })} />
        </div>

        <div className="best-filter-field">
          <label>Fecha Final:</label>
          <input type="date" value={fechas.fin} onChange={(e) => setFechas({ ...fechas, fin: e.target.value })} />
        </div>

        <div className="best-filter-field">
          <label>Sucursal:</label>
          <select defaultValue="">
            <option value="" disabled>Seleccionar...</option>
            <option value="1">Sucursal Principal</option>
          </select>
        </div>
        <Button variant="primary" onClick={handleFetch} disabled={loading}>
          {loading ? "Cargando..." : "Confirmar"}
        </Button>
      </div>

      <div className="best-report-content">
        <ReportTable title="Top 15 Productos Más Vendidos:" placeholder="Selecciona fechas para ver el top">
          {datos.length > 0 && (
            <table className="report-data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cant. Vendida</th>
                  <th>Generado ($)</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((d, i) => (
                  <tr key={i}>
                    <td>{d.codigo || "N/A"}</td>
                    <td className="font-medium">{d.nombre}</td>
                    <td className="text-success">{d.total_vendido} pz</td>
                    <td>${Number(d.ingresos).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ReportTable>
      </div>

    </ReportCard>

  );
};

export default BestSellersReport