import { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import "./RestaurantDetailModal.css";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="star filled" />);
    else if (rating >= i - 0.5)
      stars.push(<FaStarHalfAlt key={i} className="star filled" />);
    else stars.push(<FaRegStar key={i} className="star" />);
  }
  return <div className="star-row">{stars}</div>;
};

const RestaurantDetailModal = ({ restaurant, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!restaurant) return null;

  const mockReviews = [
    {
      id: 1,
      nickname: "맛집탐험가",
      date: "2026.05.08",
      rating: 5,
      content:
        "정말 맛있어요! 분위기도 좋고 직원분들도 친절하셨습니다. 강력 추천합니다!",
      avatar: "맛",
    },
    {
      id: 2,
      nickname: "천안미식가",
      date: "2026.05.03",
      rating: 4,
      content:
        "음식이 신선하고 맛있었어요. 웨이팅이 조금 있었지만 기다릴 만한 가치가 있었습니다.",
      avatar: "천",
    },
    {
      id: 3,
      nickname: "푸드러버",
      date: "2026.04.28",
      rating: 4,
      content: "가격 대비 양도 많고 맛도 좋아요. 다음에 또 오고 싶은 곳이에요.",
      avatar: "푸",
    },
  ];

  const hours = [
    { day: "월–금", time: "11:00 – 22:00" },
    { day: "토요일", time: "11:00 – 23:00" },
    { day: "일요일", time: "12:00 – 21:00" },
  ];

  return (
    <div
      className="detail-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="detail-modal">
        <button className="detail-close" onClick={onClose}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 썸네일 */}
        <div className="detail-hero">
          <img
            src={restaurant.thumbnail || restaurant.image}
            alt={restaurant.name}
          />
          <div className="detail-hero-overlay">
            <span className="detail-category-badge">
              #{restaurant.category}
            </span>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="detail-header">
          <div className="detail-title-row">
            <h2 className="detail-name">{restaurant.name}</h2>
            <div className="detail-rating-badge">
              <FaStar style={{ color: "#FFC857" }} />
              <span>
                {restaurant.average_rating || restaurant.rating || "4.5"}
              </span>
            </div>
          </div>

          <div className="detail-meta">
            <span className="detail-meta-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {restaurant.location || "충남 천안시"}
            </span>
            <span className="detail-dot">·</span>
            <span className="detail-meta-item">
              리뷰 {restaurant.review_count || mockReviews.length}개
            </span>
          </div>
        </div>

        {/* 탭 */}
        <div className="detail-tabs">
          <button
            className={`detail-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            정보
          </button>
          <button
            className={`detail-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            리뷰 ({mockReviews.length})
          </button>
          <button
            className={`detail-tab ${activeTab === "hours" ? "active" : ""}`}
            onClick={() => setActiveTab("hours")}
          >
            영업시간
          </button>
        </div>

        <div className="detail-body">
          {activeTab === "info" && (
            <div className="detail-info">
              {restaurant.description && (
                <p className="detail-desc">{restaurant.description}</p>
              )}

              <div className="detail-section">
                <h3 className="detail-section-title">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff6b35"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                  인기 메뉴
                </h3>
                <div className="menu-chips">
                  {(restaurant.popular_menu || "대표메뉴")
                    .split(",")
                    .map((menu, i) => (
                      <span key={i} className="menu-chip">
                        {menu.trim()}
                      </span>
                    ))}
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff6b35"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  위치
                </h3>
                <p className="detail-location-text">
                  {restaurant.location || "충남 천안시"}
                </p>
                <div className="detail-map-placeholder">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ccc"
                    strokeWidth="1.5"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>지도 보기</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="detail-reviews">
              {mockReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-top">
                    <div className="review-avatar">{review.avatar}</div>
                    <div className="review-user-info">
                      <span className="review-nickname">{review.nickname}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
              <button className="write-review-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                리뷰 작성하기
              </button>
            </div>
          )}

          {activeTab === "hours" && (
            <div className="detail-hours">
              <div className="hours-status open">
                <span className="status-dot"></span>
                영업 중
              </div>
              {hours.map((h, i) => (
                <div key={i} className="hours-row">
                  <span className="hours-day">{h.day}</span>
                  <span className="hours-time">{h.time}</span>
                </div>
              ))}
              <div className="hours-note">* 영업시간은 변경될 수 있습니다</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailModal;
