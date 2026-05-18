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
<<<<<<< HEAD
        <br />
=======
>>>>>>> a5cd69375545ee203ee97348d86e486b78ab0f17
      </div>

    </div>
  )
}

export default SaleHeader