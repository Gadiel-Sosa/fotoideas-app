import "./Button.css"

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  return (
    <button className={`btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;