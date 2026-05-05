import Button from "../../ui/Button/Button";

const actions = [
  { name: "Agregar", action: "add" },
  { name: "Actualizar", action: "update" },
  { name: "Borrar", action: "delete" }
];

const InventoryActions = ({ onAction }) => {
  return (
    <div className="inventory-actions">

      {actions.map((item) => (
        <Button
          key={item.action}
          className="inventory-btn"
          onClick={() => onAction(item.action)}
        >
          {item.name}
        </Button>
      ))}
      
    </div>
  );
};

export default InventoryActions;