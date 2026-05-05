import Section from "../Section/Section";
import "./Card.css";

const Card = ({ title, value, subtitle }) => {
  return (
    <Section title={title}>
      <article className="card">
        <h2>{value}</h2>
        <span>{subtitle}</span>
      </article>
    </Section>
  );
};

export default Card