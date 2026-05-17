import { useEffect, useState } from "react";

import "./ConsultarCorteCaja.css";

import EmptyState from "../../ui/EmptyState/EmptyState";
import TableContainer from "../../ui/TableContainer/TableContainer";

const ConsultarCorteCaja = () => {

  const [cortes, setCortes] = useState([]);

  useEffect(() => {

    // temporal mientras conectas backend
    setCortes([
      {
        id_corte: 1,
        fecha_corte: "2026-05-17",
        hora_corte: "18:45",
        cajero: "Admin",
        ventas_totales: 15,
        total_ventas: 4500.50,
        estado: "Cerrado"
      },
      {
        id_corte: 2,
        fecha_corte: "2026-05-18",
        hora_corte: "20:10",
        cajero: "Carlos",
        ventas_totales: 10,
        total_ventas: 2800,
        estado: "Abierto"
      }
    ]);

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
            <th>Ventas realizadas</th>
            <th>Total vendido</th>
            <th>Estado</th>

          </tr>

        </thead>

        <tbody>

          {cortes.map((corte) => (

            <tr key={corte.id_corte}>

              <td>{corte.id_corte}</td>

              <td>{corte.fecha_corte}</td>

              <td>{corte.hora_corte}</td>

              <td>{corte.cajero}</td>

              <td>{corte.ventas_totales}</td>

              <td>
                ${Number(corte.total_ventas).toFixed(2)}
              </td>

              <td>

                <span
                  className={
                    corte.estado === "Cerrado"
                      ? "estado-cerrado"
                      : "estado-abierto"
                  }
                >
                  {corte.estado}
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