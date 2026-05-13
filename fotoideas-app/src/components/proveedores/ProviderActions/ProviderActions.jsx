import Button from "../../ui/Button/Button";
import "../../inventario/InventoryForm/InventoryForm.css"; // Reutilizamos la clase inventario-actions

const ProviderActions = ({ accion, setAccion }) => {
  return (
    <div className="inventario-actions">
      <Button variant={accion === "agregar" ? "primary" : "secondary"} onClick={() => setAccion("agregar")}>Agregar</Button>
      <Button variant={accion === "actualizar" ? "primary" : "secondary"} onClick={() => setAccion("actualizar")}>Actualizar</Button>
      <Button variant={accion === "borrar" ? "primary" : "secondary"} onClick={() => setAccion("borrar")}>Borrar</Button>
    </div>
  );
};

export default ProviderActions;