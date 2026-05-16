import "./ReportTable.css";

const ReportTable = ({ title, placeholder, children }) => {

  return (

    <div className="report-table-container">

      <label>{title}</label>

      <div className="report-table-box" style={{ overflowX: 'auto' }}>

        {children ? children : <span>{placeholder}</span>}

      </div>

    </div>

  );
};

export default ReportTable