import "./SaleHeader.css"

const SaleHeader = ({saleNumber, date, time}) => {
  return (

    <div className="sale-header">

      <div>
        <h2>Venta #{saleNumber}</h2>
      </div>

      <div>
        <span>Fecha: {date}</span>
        <br />
        <span>Hora: {time}</span>
      </div>

    </div>
  )
}

export default SaleHeader