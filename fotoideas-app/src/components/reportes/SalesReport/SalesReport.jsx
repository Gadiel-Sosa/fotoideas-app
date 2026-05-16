import { useState } from "react";
import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./SalesReport.css";

const SalesReport = () => {
  const hoy = new Date().toISOString().split('T')[0];
  const [fechas, setFechas] = useState({ inicio: hoy, fin: hoy });
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/reportes/ventas?inicio=${fechas.inicio}&fin=${fechas.fin}`);
      const result = await res.json();
      if (result.success) setDatos(result.datos);
    } catch (error) {
      console.error("Error al obtener reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = datos.reduce((sum, item) => sum + Number(item.total_venta), 0);

  return (

    <ReportCard>

      {/* filtros */}

      <div className="sales-report-filters">

        <div className="sales-filter-field">

          <label>Fecha Inicial:</label>

          <input type="date" value={fechas.inicio} onChange={(e) => setFechas({ ...fechas, inicio: e.target.value })} />

        </div>

        <div className="sales-filter-field">

          <label>Fecha Final:</label>

          <input type="date" value={fechas.fin} onChange={(e) => setFechas({ ...fechas, fin: e.target.value })} />

        </div>

        <div className="sales-filter-field">

          <label>Sucursal:</label>

          <select defaultValue="">
            <option value="" disabled>
              Seleccionar...
            </option>
            <option value="1">Sucursal Principal</option>
          </select>

        </div>

        <Button variant="primary" onClick={handleFetch} disabled={loading}>
          {loading ? "Cargando..." : "Confirmar"}
        </Button>

      </div>

      {/* tabla */}

      <div className="sales-report-content">

        <ReportTable title="Reporte detallado:" placeholder="Selecciona un rango de fechas y presiona Confirmar">
          {datos.length > 0 && (
            <table className="report-data-table">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cajero</th>
                  <th>Pago</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((d) => (
                  <tr key={d.id_venta}>
                    <td>{d.id_venta}</td>
                    <td>{new Date(d.fecha_venta).toLocaleDateString()}</td>
                    <td>{d.hora_venta}</td>
                    <td>{d.nombre_empleado}</td>
                    <td>{d.forma_pago}</td>
                    <td className="font-bold">${Number(d.total_venta).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ReportTable>

      </div>

      {/* total */}

      <div className="sales-report-total">

        <label>Total:</label>

        <span>${total.toFixed(2)}</span>

      </div>

    </ReportCard>

  );
};

export default SalesReport