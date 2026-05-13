import "./Button.css";

const Button = ({ children, variant = "primary", size = "md", onClick, type = "button" }) => {
  return (
    <button type={type} onClick={onClick} className={`btn btn-${variant} btn-${size}`}>
      {children}
    </button>
  );
};

export default Button;