import "./PinModal.css";

import Input from "../Input/Input";
import Button from "../Button/Button";

const PinModal = ({
  visible,
  password,
  setPassword,
  onCancel,
  onConfirm
}) => {

  if (!visible) return null;

  return (

    <div className="password-modal-overlay">

      <div className="password-modal">

        <h2>
          Ingrese la contraseña para continuar
        </h2>

        <div className="password-modal-content">

          <Input
            label="Contraseña cajero administrador"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

        </div>

        <div className="password-modal-buttons">

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

export default PinModal