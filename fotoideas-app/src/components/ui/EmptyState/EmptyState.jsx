import "./EmptyState.css"

const EmptyState = ({ message }) => {

  return (

    <div className="empty-state">

      <p>{message}</p>

    </div>

  )

}

export default EmptyState