import "./CancelSaleModal.css";

import Button from "../../ui/Button/Button";

const CancelSaleModal = ({
  visible,
  productos,
  onCancel,
  onConfirm
}) => {

  if (!visible) return null;

  return (

    <div className="cancel-sale-overlay">

      <div className="cancel-sale-modal">

        <div className="cancel-sale-header">

          <div>

            <h2>
              Venta Actual
            </h2>

            <span>
              Carrito de compras
            </span>

          </div>

          <div className="cancel-sale-date">

            <span>
              {new Date().toLocaleDateString()}
            </span>

            <span>
              {new Date().toLocaleTimeString()}
            </span>

          </div>

        </div>

        <div className="cancel-sale-body">

          <h3>
            ¿Deseas cancelar esta venta?
          </h3>

          <p>
            Se vaciará el carrito con{" "}
            <strong>
              {productos.length}
            </strong>{" "}
            producto(s).
          </p>

        </div>

        <div className="cancel-sale-buttons">

          <Button
            variant="danger"
            onClick={onCancel}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
          >
            Confirmar
          </Button>

        </div>

      </div>

    </div>
  );
};

export default CancelSaleModal