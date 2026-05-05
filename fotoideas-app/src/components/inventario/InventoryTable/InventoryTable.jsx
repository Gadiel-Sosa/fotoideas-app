import "./InventoryTable.css"

const InventoryTable = () => {
  return (
    <div className="inventory-table">

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Producto ejemplo</td>
            <td>123456</td>
            <td>$100</td>
            <td>20</td>
            <td>
              <button>Editar</button>
              <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

export default InventoryTable;