import "./SaleHeader.css"

const SaleHeader = ({saleNumber, date, time, cashier}) => {
  return (

    <div className="sale-header">

      <div>
        <h2>Venta #{saleNumber}</h2>
      </div>

      <div>
        <span>Fecha: {date}</span>
        <br />
        <span>Hora: {time}</span>
        <br />
        <span style={{ fontWeight: 'bold' }}>Cajero: {cashier}</span>
      </div>

    </div>
  )
}

export default SaleHeader