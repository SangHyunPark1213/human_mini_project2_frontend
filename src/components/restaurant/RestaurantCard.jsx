import "./RestaurantCard.css";
import { FaStar } from "react-icons/fa";

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <button className="restaurant-card" onClick={() => onClick && onClick(restaurant)}>
      <div className="restaurant-img-wrap">
        <p className="average_rating">
          <FaStar /> {restaurant.average_rating || restaurant.rating}
        </p>
        <img src={restaurant.thumbnail || restaurant.image} alt={restaurant.name} />
      </div>

      <div className="restaurant-content">
        <h3>{restaurant.name}</h3>

        <p className="location">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {restaurant.location}
        </p>

        <span className="category-tag">#{restaurant.category}</span>
        <p className="popular_menu"><b>인기메뉴:</b> {restaurant.popular_menu}</p>
        <p className="review_count">리뷰 {restaurant.review_count}개</p>
      </div>
    </button>
  );
};

export default RestaurantCard;
