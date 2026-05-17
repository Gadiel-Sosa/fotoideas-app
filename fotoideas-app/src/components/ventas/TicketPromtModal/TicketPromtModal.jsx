import "./TicketPromtModal.css";

const TicketPromptModal = ({
  visible,
  onClose,
  onGenerate
}) => {

  if (!visible) return null;

  return (

    <div className="ticket-prompt-overlay">

      <div className="ticket-prompt-modal">

        <h3>
          ¡Venta Exitosa!
        </h3>

        <p>
          La venta se ha registrado correctamente en el sistema.
        </p>

        <p className="ticket-prompt-question">
          ¿Deseas generar e imprimir el ticket?
        </p>

        <div className="ticket-prompt-buttons">

          <button
            onClick={onClose}
            className="ticket-prompt-cancel"
          >
            No, continuar
          </button>

          <button
            onClick={onGenerate}
            className="ticket-prompt-confirm"
          >
            Sí, generar ticket
          </button>

        </div>

      </div>

    </div>
  );
};

export default TicketPromptModal


