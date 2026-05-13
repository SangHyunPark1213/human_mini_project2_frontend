import "./RankingCard.css";
import { FaStar } from "react-icons/fa";

const RankingCard = ({ rank, restaurant }) => {
  return (
    <button className="restaurant-card">
      <div className="restaurant-img-wrap">
        <p className="average_rating"><FaStar /> {restaurant.average_rating}</p>
        <div className="rank-badge">#{rank}</div>
        <img src={restaurant.thumbnail} alt={restaurant.name} />
      </div>

      <div className="restaurant-content">
        
        <h3>{restaurant.name}</h3>

        <p className="location"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin w-4 h-4" data-fg-crgp73="2.36:2.13905:/src/app/components/HomePage.tsx:237:19:9443:30:e:MapPin::::::BveZ" data-fgid-crgp73=":r30:"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
           {restaurant.location}</p>
        <span className="category-tag">#{restaurant.category}</span>
        <p className="popular_menu"><b>인기메뉴:</b> {restaurant.popular_menu}</p>
        <p className="review_count">리뷰 {restaurant.review_count}개</p>

      </div>
    </button>
  );
};

export default RankingCard;