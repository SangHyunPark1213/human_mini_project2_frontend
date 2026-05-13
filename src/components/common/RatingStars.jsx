import "./RatingStars.css";
import { FaStar } from "react-icons/fa";

const RatingStars = ({ rating = 0, size = "md" }) => {
  return (
    <div className={`rating-stars rating-${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? "filled" : ""}>
          <FaStar />
        </span>
      ))}
    </div>
  );
};

export default RatingStars;