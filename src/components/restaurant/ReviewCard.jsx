import RatingStars from "../common/RatingStars";
import "./ReviewCard.css";
import { FiThumbsUp } from "react-icons/fi";

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <div>
          <p className="nickname">{review.nickname}</p>
          <div className="rating">
            <RatingStars rating={review.rating} />
            <p>{review.date}</p>
          </div>
        </div>
      </div>

      <p className="review-text">{review.content}</p>

      {review.image_url?.length > 0 && (
        <div className="review-photos">
          {review.image_url.map((photo, index) => (
            <img key={index} src={photo} alt={`리뷰사진${index + 1}`} />
          ))}
        </div>
      )}

      <div className="review-actions">
        <button><FiThumbsUp /> 도움돼요</button>
      </div>
    </div>
  );
};

export default ReviewCard;