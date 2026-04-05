import "../../styles/card.css";

const Card = ({ title, value, subtitle }) => {
  return (
    <div className="card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{subtitle}</span>
    </div>
  );
}

export default Card