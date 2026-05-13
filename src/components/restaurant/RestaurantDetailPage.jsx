import { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

import {
  LuMapPin,
  LuPhone,
  LuClock,
  LuCreditCard,
  LuThumbsUp,
  LuMessageCircle,
} from "react-icons/lu";

import "./RestaurantDetailPage.css";

const StarRating = ({ rating, size = 13 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <FaStar key={i} className="star filled" style={{ fontSize: size }} />,
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FaStarHalfAlt
          key={i}
          className="star filled"
          style={{ fontSize: size }}
        />,
      );
    } else {
      stars.push(
        <FaRegStar key={i} className="star" style={{ fontSize: size }} />,
      );
    }
  }

  return <div className="star-row">{stars}</div>;
};

const RatingBar = ({ count, total, star }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="rating-bar-row">
      <span className="rating-bar-label">{star}★</span>

      <div className="rating-bar-track">
        <div className="rating-bar-fill" style={{ width: pct + "%" }} />
      </div>

      <span className="rating-bar-count">{count}</span>
    </div>
  );
};

const RestaurantDetailPage = ({ restaurant, onClose, isAdmin = false }) => {
  const [activeImg, setActiveImg] = useState(0);

  if (!restaurant) return null;

  const fallbackImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200";

  const images = [
    restaurant.thumbnail ||
      restaurant.image ||
      fallbackImage,

    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",

    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",

    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
  ];

  const mockReviews = [
    {
      id: 1,
      nickname: "달빛미식",
      date: "2026.05.08",
      rating: 5,
      content:
        "정말 맛있어요! 분위기도 좋고 직원분들도 정말 친절했어요. 대표메뉴도 기대 이상이라 재방문 의사 있습니다.",
      images: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200",
      ],
      likes: 14,
      comments: 2,
      tags: ["분위기좋아요", "친절해요"],
    },
    {
      id: 2,
      nickname: "푸드아빠",
      date: "2026.05.03",
      rating: 4,
      content:
        "천안 오면 항상 들르는 곳이에요. 메뉴가 다양하고 맛도 꾸준해서 믿고 먹을 수 있습니다.",
      images: [
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200",
      ],
      likes: 9,
      comments: 1,
      tags: ["맛있어요", "재방문의사있어요"],
    },
    {
      id: 3,
      nickname: "서울냠냠",
      date: "2026.04.28",
      rating: 4,
      content: "가격 대비 양도 많고 맛도 좋아요. 다음에 또 방문하고 싶습니다.",
      images: [],
      likes: 7,
      comments: 0,
      tags: ["양많아요", "가성비좋아요"],
    },
  ];

  const ratingDist = {
    5: 204,
    4: 83,
    3: 24,
    2: 11,
    1: 2,
  };

  const totalReviews = Object.values(ratingDist).reduce((a, b) => a + b, 0);

  const goodTags = [
    "맛있어요",
    "친절해요",
    "분위기좋아요",
    "재방문의사있어요",
    "가성비좋아요",
  ];

  const visitTypes = ["혼밥", "커플", "가족모임", "단체회식", "친구"];

  const keywords = [
    "직원친절",
    "재방문",
    "웨이팅",
    "신선해요",
    "빠른서빙",
    "기타",
  ];

  const menus = (restaurant.popular_menu || "대표메뉴")
    .split(",")
    .map((m) => m.trim());

  const menuPrices = ["12,000원", "21,000원", "35,000원"];

  return (
    <div className="detail-page">
      {/* NAV */}
      <div className="detail-nav">
        <button className="nav-back" onClick={onClose}>
          <IoArrowBack size={18} />
          <span>돌아가기</span>
        </button>

        <div className="nav-actions">
          {isAdmin && <button className="nav-cta-btn">✓ 등록하기</button>}
        </div>
      </div>

      {/* GALLERY */}
      <div className="gallery">
        <div className="gallery-main">
          <img
            src={images[activeImg]}
            alt="대표 이미지"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200";
            }}
          />

          <div className="gallery-overlay">
            <div className="gallery-info">
              <h1>{restaurant.name}</h1>

              <p>{restaurant.category}</p>
            </div>
          </div>
        </div>

        <div className="gallery-side">
          {images.slice(1, 3).map((img, i) => (
            <div
              key={i}
              className={
                "gallery-thumb" + (activeImg === i + 1 ? " active" : "")
              }
              onClick={() => setActiveImg(i + 1)}
            >
              <img src={img} alt="" />
            </div>
          ))}

          <div
            className="gallery-thumb gallery-more"
            onClick={() => setActiveImg(3)}
          >
            <img src={images[3]} alt="" />

            <div className="gallery-more-overlay">+{images.length - 3}</div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="detail-content">
        {/* INFO */}
        <section className="info-card">
          <div className="info-name-header">
            <h2 className="info-restaurant-name">{restaurant.name}</h2>
            <span className="info-restaurant-category">{restaurant.category}</span>
          </div>

          <div className="info-rating-row">
            <StarRating rating={restaurant.average_rating || 4.5} size={15} />

            <span className="info-score">
              {restaurant.average_rating || 4.5}
            </span>

            <span className="info-review-count">
              ({totalReviews.toLocaleString()}개 리뷰)
            </span>
          </div>

          <div className="info-tags">
            {goodTags.slice(0, 4).map((tag) => (
              <span key={tag} className="info-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="info-grid">
            <div className="info-item">
              <LuMapPin className="info-icon" />

              <div>
                <p className="info-item-label">주소</p>

                <p className="info-item-value">
                  {restaurant.location || "충남 천안시 동남구"}
                </p>
              </div>
            </div>

            <div className="info-item">
              <LuPhone className="info-icon" />

              <div>
                <p className="info-item-label">전화번호</p>

                <p className="info-item-value">{restaurant.phone || "정보 없음"}</p>
              </div>
            </div>

            <div className="info-item">
              <LuClock className="info-icon" />

              <div>
                <p className="info-item-label">영업시간</p>

                <p className="info-item-value">{restaurant.hours || "정보 없음"}</p>
              </div>
            </div>

            <div className="info-item">
              <LuCreditCard className="info-icon" />

              <div>
                <p className="info-item-label">가격대</p>

                <p className="info-item-value">{restaurant.price_range || "정보 없음"}</p>
              </div>
            </div>
          </div>

          {/* 가게 소개 */}
          {restaurant.description && (
            <div className="description-section">
              <p className="menu-section-label">가게 소개</p>
              <p className="description-text">{restaurant.description}</p>
            </div>
          )}

          {/* 메뉴 */}
          <div className="menu-section">
            <p className="menu-section-label">대표 메뉴</p>

            <div className="menu-list">
              {menus.map((menu, i) => (
                <div key={i} className="menu-item">
                  <span className="menu-name">{menu}</span>

                  <span className="menu-price">{menuPrices[i] || ""}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MAP */}
        <section className="map-card">
          <div className="map-header">
            <h2 className="section-title">위치</h2>

            <p className="map-address">{restaurant.location}</p>
          </div>

          <div className="map-container">
            <div className="map-placeholder">지도 API 영역</div>
          </div>
        </section>

        {/* ANALYSIS */}
        <section className="analysis-card">
          <h2 className="section-title">리뷰 분석</h2>

          <div className="analysis-grid">
            <div className="analysis-col">
              <p className="analysis-label">별점 분포</p>

              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar
                  key={star}
                  star={star}
                  count={ratingDist[star]}
                  total={totalReviews}
                />
              ))}
            </div>

            <div className="analysis-col">
              <p className="analysis-label">붙박이 태그</p>

              <div className="tag-cloud">
                {goodTags.map((tag) => (
                  <span key={tag} className="a-tag orange">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="analysis-label" style={{ marginTop: 16 }}>
                자주 언급된 키워드
              </p>

              <div className="tag-cloud">
                {keywords.map((kw) => (
                  <span key={kw} className="a-tag gray">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <p className="analysis-label">방문 유형</p>

            <div className="tag-cloud">
              {visitTypes.map((v) => (
                <span key={v} className="a-tag outline">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="reviews-section">
          <div className="reviews-header">
            <h2 className="section-title">
              리뷰 {totalReviews.toLocaleString()}개
            </h2>

            <button className="write-review-btn">✏ 리뷰 작성하기</button>
          </div>

          <div className="reviews-list">
            {mockReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-top">
                  <div className="review-avatar">
                    {review.nickname[0]}
                  </div>
                  <div className="review-user">
                    <div className="review-user-row">
                      <div className="review-nickname">
                        {review.nickname}
                      </div>
                      <div className="review-meta">
                        <StarRating
                          rating={review.rating}
                          size={18}
                        />
                        <div className="review-date">
                          {review.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="review-text">{review.content}</p>

                {review.images.length > 0 && (
                  <div className="review-images">
                    {review.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="review-img" />
                    ))}
                  </div>
                )}

                <div className="review-tags">
                  {review.tags.map((tag) => (
                    <span key={tag} className="review-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="review-footer">
                  <button className="review-action-btn">
                    <LuThumbsUp size={13} />
                    도움돼요 {review.likes}
                  </button>

                  <button className="review-action-btn">
                    <LuMessageCircle size={13} />
                    댓글 {review.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
