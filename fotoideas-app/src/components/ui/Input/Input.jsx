import { forwardRef } from "react";
import "./Input.css"

const Input = forwardRef(({ label, id, className = "", ...props }, ref) => {
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={`input ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;