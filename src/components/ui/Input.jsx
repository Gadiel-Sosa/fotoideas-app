import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className="input"
    />
  );
});

export default Input;