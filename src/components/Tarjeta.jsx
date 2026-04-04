import "../styles/card.css";

export default function Card({ title, value, subtitle }) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{subtitle}</span>
    </div>
  );
}