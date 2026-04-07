const Button = ({ children, variant = "primary", ...props }) => {
  const className = `btn-${variant}`;
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;