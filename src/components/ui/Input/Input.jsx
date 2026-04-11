import { forwardRef } from "react";
import "./Input.css"

const Input = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`input ${props.className || ""}`}
    />
  );
});

export default Input;