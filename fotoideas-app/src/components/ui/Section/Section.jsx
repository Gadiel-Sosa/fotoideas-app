import "./Section.css"

const Section = ({ title, children }) => {

  return (
    <section className="section">

      {title && <h2>{title}</h2>}

      {children}

    </section>
  )
}

export default Section