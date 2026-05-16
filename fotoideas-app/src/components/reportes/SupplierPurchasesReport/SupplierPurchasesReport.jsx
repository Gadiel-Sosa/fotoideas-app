import { useState } from "react";
import Button from "../../ui/Button/Button";

import ReportCard from "../ReportCard/ReportCard";
import ReportTable from "../ReportTable/ReportTable";

import "./SupplierPurchasesReport.css";

const SupplierPurchasesReport = () => {
  const hoy = new Date().toISOString().split('T')[0];
  const [fechas, setFechas] = useState({ inicio: hoy, fin: hoy });
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/reportes/compras-proveedor?inicio=${fechas.inicio}&fin=${fechas.fin}`);
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

      <div className="supplier-report-filters">
        <div className="supplier-filter-field">
          <label>Filtro Extra:</label>
          <select defaultValue="">
            <option value="" disabled>Seleccionar...</option>
            <option value="1">Todos los Cortes</option>
          </select>
        </div>

        <div className="supplier-filter-field">
          <label>Fecha Inicial:</label>
          <input type="date" value={fechas.inicio} onChange={(e) => setFechas({ ...fechas, inicio: e.target.value })} />
        </div>

        <div className="supplier-filter-field">
          <label>Fecha Final:</label>
          <input type="date" value={fechas.fin} onChange={(e) => setFechas({ ...fechas, fin: e.target.value })} />
        </div>
        <Button variant="primary" onClick={handleFetch} disabled={loading}>
          {loading ? "Cargando..." : "Confirmar"}
        </Button>
      </div>

      <div className="supplier-report-content">
        <ReportTable title="Salidas/Pagos registrados en Corte:" placeholder="Selecciona fechas para ver pagos">
          {datos.length > 0 && (
            <table className="report-data-table">
              <thead>
                <tr>
                  <th>Folio Corte</th>
                  <th>Fecha y Hora</th>
                  <th>Cajero / Responsable</th>
                  <th>Monto Pagado ($)</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((d, i) => (
                  <tr key={i}>
                    <td>{d.id_corte_caja}</td>
                    <td>{new Date(d.fecha_corte).toLocaleDateString()} a las {d.hora_corte}</td>
                    <td className="font-medium">{d.nombre_empleado}</td>
                    <td className="text-danger">-${Number(d.pago_proveedores).toFixed(2)}</td>
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

export default SupplierPurchasesReport