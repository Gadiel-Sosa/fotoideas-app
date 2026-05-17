import "./TicketModal.css";

const TicketModal = ({
  visible,
  ticketData,
  onClose
}) => {

  if (!visible || !ticketData) return null;

  const handlePrint = () => {

    const printContent =
      document.getElementById(
        "ticket-content"
      ).innerHTML;

    const printWindow = window.open(
      "",
      "",
      "width=400,height=600"
    );

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket de Venta</title>

          <style>
            body {
              font-family: monospace;
              padding: 20px;
              color: black;
            }
          </style>

        </head>

        <body>
          ${printContent}
        </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();
  };

  return (

    <div className="ticket-modal-overlay">

      <div className="ticket-modal">

        <div
          id="ticket-content"
          className="ticket-content"
        >

          <div className="ticket-header">

            <h2>FOTO IDEAS</h2>

            <p>Ticket de Venta</p>

            <p>
              {ticketData.fecha}
              {" - "}
              {ticketData.hora}
            </p>

          </div>

          <div className="ticket-products">

            {ticketData.productosGuardados.map(
              (p, i) => (

                <div
                  key={i}
                  className="ticket-product-row"
                >

                  <span>
                    {p.cantidad}x {p.nombre}
                  </span>

                  <span>
                    $
                    {(p.precio * p.cantidad)
                      .toFixed(2)}
                  </span>

                </div>
              )
            )}

          </div>

          <div className="ticket-summary">

            <div className="ticket-summary-row">
              <span>Subtotal:</span>

              <span>
                $
                {ticketData.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="ticket-summary-row">
              <span>IVA (16%):</span>

              <span>
                $
                {ticketData.iva.toFixed(2)}
              </span>
            </div>

            <div className="ticket-summary-row ticket-total">
              <span>TOTAL:</span>

              <span>
                $
                {ticketData.total.toFixed(2)}
              </span>
            </div>

            <div className="ticket-summary-row">
              <span>Efectivo:</span>

              <span>
                $
                {ticketData.recibido.toFixed(2)}
              </span>
            </div>

            <div className="ticket-summary-row">
              <span>Cambio:</span>

              <span>
                $
                {ticketData.cambio.toFixed(2)}
              </span>
            </div>

          </div>

          <div className="ticket-footer">

            <p>
              ¡Gracias por su compra!
            </p>

          </div>

        </div>

        <div className="ticket-buttons">

          <button
            onClick={onClose}
            className="ticket-close-btn"
          >
            Cerrar
          </button>

          <button
            onClick={handlePrint}
            className="ticket-print-btn"
          >
            Imprimir
          </button>

        </div>

      </div>

    </div>
  );
};

export default TicketModal




