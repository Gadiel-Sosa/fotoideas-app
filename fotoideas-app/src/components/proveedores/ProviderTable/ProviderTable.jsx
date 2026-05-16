import React from "react";
import "./ProviderTable.css";
import Button from "../../ui/Button/Button";

const ProviderTable = ({ proveedores, handleAccionDesdeTabla }) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Empresa</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>RFC</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov) => (
            <tr key={prov.id_proveedor}>
              <td>{prov.id_proveedor}</td>
              <td><strong>{prov.nombre_empresa}</strong></td>
              <td>{prov.nombre_proveedor}</td>
              <td>{prov.telefono_proveedor}</td>
              <td>{prov.rfc_proveedor}</td>
              <td>
                <div className="table-actions">
                  <Button variant="secondary" onClick={() => handleAccionDesdeTabla(prov, "actualizar")}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleAccionDesdeTabla(prov, "borrar")}>
                    Borrar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderTable;