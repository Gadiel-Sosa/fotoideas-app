import { useEffect, useState } from "react";
import { getAuthHeaders } from "../../../services/authService";

import "./ConsultarCorteCaja.css";

import EmptyState from "../../ui/EmptyState/EmptyState";
import TableContainer from "../../ui/TableContainer/TableContainer";

const ConsultarCorteCaja = () => {

  const [cortes, setCortes] = useState([]);

  useEffect(() => {

    const fetchCortes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cortes", {
          headers: getAuthHeaders()
        });
        const data = await response.json();
        if (data.success) {
          setCortes(data.cortes);
        }
      } catch (error) {
        console.error("Error al obtener los cortes de caja:", error);
      }
    };

    fetchCortes();

  }, []);

  if (cortes.length === 0) {
    return <EmptyState message="No hay cortes de caja registrados" />
  }

  return (

    <TableContainer>

      <table className="cash-table">

        <thead>

          <tr>

            <th>ID Corte</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cajero</th>
            <th>Monto inicial</th>
            <th>Efectivo real</th>
            <th>Diferencia</th>

          </tr>

        </thead>

        <tbody>

          {cortes.map((corte) => (

            <tr key={corte.id_corte_caja}>

              <td>{corte.id_corte_caja}</td>

              <td>{new Date(corte.fecha_corte).toLocaleDateString()}</td>

              <td>{corte.hora_corte ? corte.hora_corte.substring(0, 5) : "--:--"}</td>

              <td>{corte.cajero}</td>

              <td>
                ${Number(corte.monto_inicial).toFixed(2)}
              </td>

              <td>
                ${Number(corte.efectivo_real).toFixed(2)}
              </td>

              <td>
                <span style={{ color: Number(corte.diferencia_caja) < 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                  ${Number(corte.diferencia_caja).toFixed(2)}
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </TableContainer>

  );

};

export default ConsultarCorteCaja;