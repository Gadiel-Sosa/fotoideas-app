export default function PaymentPanel() {
  return (
    <div className="payment-panel">
      <div>
        <label>Cajero:</label>
        <input type="text" value="Admin" disabled />
      </div>

      <div>
        <label>Forma de pago:</label>
        <select>
          <option>Efectivo</option>
          <option>Tarjeta</option>
        </select>
      </div>
    </div>
  );
}