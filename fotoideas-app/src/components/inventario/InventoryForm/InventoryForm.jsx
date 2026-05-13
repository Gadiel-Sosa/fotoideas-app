import "../InventoryForm/InventoryForm.css"

const InventoryForm = () => {
  return (
    <div className="inventory-form">

      <div className="row">
        <label>ID:</label>
        <input />

        <div className="form-group">
          <label>Código de barras</label>
          <input />
        </div>

        <button>Vista previa</button>
      </div>

      <div className="row">
        <label>Nombre:</label>
        <input />

        <label>Categoría:</label>
        <select />
      </div>

      <div className="row">
        <label>Descripción:</label>
        <textarea />
      </div>

      <div className="row">
        <label>Costo:</label>
        <input />

        <label>Precio:</label>
        <input />

        <label>Estado:</label>
        <input />
      </div>

      <div className="row">
        <label>Stock:</label>
        <input />

        <label>Proveedor:</label>
        <input />
      </div>

      <div className="form-buttons">
        <button>Cancelar</button>
        <button>Confirmar</button>
      </div>

    </div>
  );
};

export default InventoryForm