import "./CategoryChip.css";

const CategoryChip = ({ label, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`category-chip ${active ? "active" : ""}`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
};

export default CategoryChip;