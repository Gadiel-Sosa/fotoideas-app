export default function SaleHeader() {
  return (
    <div className="sale-header">
      <div>
        <h2>Venta #001</h2>
      </div>

      <div>
        <span>Fecha: {new Date().toLocaleDateString()}</span>
        <br />
        <span>Hora: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}