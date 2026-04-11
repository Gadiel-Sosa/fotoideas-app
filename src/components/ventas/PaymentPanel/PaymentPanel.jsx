import Input from "../../ui/Input/Input";
import "./PaymentPanel.css"

const PaymentPanel = ({ cashier, paymentMethod, setPaymentMethod }) => {

  return (

    <div className="payment-panel">

      <Input label="Cajero" value={cashier} disabled />

      <div className="payment-method">

        <label className="payment-label">
          Forma de pago:
        </label>

        <select
          className="input"
          value={paymentMethod}
          onChange={(e) =>
          setPaymentMethod(e.target.value)
          }
        >
          <option value="Efectivo">
            Efectivo
          </option>
          <option value="Tarjeta">
            Tarjeta
          </option>
        </select>
      </div>
    </div>

  )

}

export default PaymentPanel;