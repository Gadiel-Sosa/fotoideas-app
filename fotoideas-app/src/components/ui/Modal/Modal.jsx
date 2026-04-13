import Button from "../Button/Button";
import "./Modal.css"

const Modal = ({title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar"}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        <div className="modal-buttons">

          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>

          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>

        </div>
      </div>
    </div>
  )
}

export default Modal;