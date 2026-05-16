import "./ReportTable.css";

const ReportTable = ({ title, placeholder }) => {

  return (

    <div className="report-table-container">

      <label>{title}</label>

      <div className="report-table-box">

        <span>{placeholder}</span>

      </div>

    </div>

  );
};

export default ReportTable