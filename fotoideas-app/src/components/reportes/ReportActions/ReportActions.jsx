import Button from "../../ui/Button/Button";

import "./ReportActions.css";

const ReportActions = ({ tab, setTab }) => {

  const actions = [
    {
      id: "ventas",
      label: "Ventas por periodo"
    },
    {
      id: "masVendidos",
      label: "Prod. más vendidos"
    },
    {
      id: "stockBajo",
      label: "Stock bajo"
    },
    {
      id: "comprasProveedor",
      label: "Compras proveedor"
    }
  ];

  return (

    <div className="report-actions">

      {actions.map((action) => (

        <Button
          key={action.id}
          variant={tab === action.id ? "primary" : "secondary"}
          onClick={() => setTab(action.id)}
          className="report-action-btn"
        >
          {action.label}
        </Button>

      ))}

    </div>

  );
};

export default ReportActions