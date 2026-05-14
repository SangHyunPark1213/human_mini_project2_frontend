import { useState, useEffect, useRef } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

import {
  LuMapPin,
  LuPhone,
  LuClock,
  LuCreditCard,
  LuThumbsUp,
} from "react-icons/lu";

import "./RestaurantDetailPage.css";
import { getReviewsByRestaurant, toggleHelpful } from "../../api/reviewAPI";

const StarRating = ({ rating, size = 13 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="star filled" style={{ fontSize: size }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="star filled" style={{ fontSize: size }} />);
    } else {
      stars.push(<FaRegStar key={i} className="star" style={{ fontSize: size }} />);
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

const KakaoMap = ({ address, name, latitude, longitude }) => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      try {
        const kakao = window.kakao;
        if (!kakao || !kakao.maps) { setMapError(true); return; }

        const placeMap = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(36.8081, 127.1475),
          level: 3,
        });

        const displayMarker = (lat, lng) => {
          const coords = new kakao.maps.LatLng(lat, lng);
          const marker = new kakao.maps.Marker({ map: placeMap, position: coords });
          const infowindow = new kakao.maps.InfoWindow({
            content: '<div style="padding:5px 10px;font-size:13px;font-weight:700;">' + name + '</div>',
          });
          infowindow.open(placeMap, marker);
          placeMap.setCenter(coords);
        };

        if (latitude && longitude) {
          displayMarker(latitude, longitude);
          return;
        }

        if (address) {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              displayMarker(result[0].y, result[0].x);
            } else {
              setMapError(true);
            }
          });
        }
      } catch (e) {
        console.error("카카오맵 오류:", e);
        setMapError(true);
      }
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
    } else {
      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval);
          window.kakao.maps.load(initMap);
        }
      }, 300);
      return () => clearInterval(checkInterval);
    }
  }, [address, name, latitude, longitude]);

  if (mapError) {
    return (
      <div className="map-placeholder" style={{ flexDirection: "column", gap: 8 }}>
        <LuMapPin size={28} style={{ color: "#ff6b35" }} />
        <span>{address || "주소 정보 없음"}</span>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

const RestaurantDetailPage = ({ restaurant, onClose, onWriteReview, isAdmin = false }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [sortType, setSortType] = useState("latest");
  const [helpfulClicked, setHelpfulClicked] = useState({});

  if (!restaurant) return null;

  const fallbackImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200";

  const images = [
    restaurant.thumbnail || restaurant.image || fallbackImage,
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
  ];

  useEffect(() => {
    if (!restaurant.id) { setReviewLoading(false); return; }
    setReviewLoading(true);
    getReviewsByRestaurant(restaurant.id, sortType)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setReviewLoading(false));
  }, [restaurant.id, sortType]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortType === "helpful") {
      return (b.helpfulCount ?? b.helpful_count ?? 0) - (a.helpfulCount ?? a.helpful_count ?? 0);
    }
    return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
  });

  const totalReviews = restaurant.reviewCount ?? restaurant.review_count ?? sortedReviews.length;
  const avgRating = restaurant.averageRating ?? restaurant.average_rating ?? 0;

  const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  sortedReviews.forEach((r) => {
    const star = Math.round(r.rating);
    if (star >= 1 && star <= 5) ratingDist[star]++;
  });

  const menus = (restaurant.popularMenu || restaurant.popular_menu || "대표메뉴")
    .split(",").map((m) => m.trim());

  const handleHelpful = async (reviewId) => {
    const wasClicked = helpfulClicked[reviewId];
    setHelpfulClicked((prev) => ({ ...prev, [reviewId]: !wasClicked }));
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const base = r.helpfulCount ?? r.helpful_count ?? 0;
          return { ...r, helpfulCount: base + (wasClicked ? -1 : 1) };
        }
        return r;
      })
    );
    try { await toggleHelpful(reviewId); } catch (e) { /* 로그인 미인증 시 무시 */ }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="detail-page">
      <div className="detail-nav">
        <button className="nav-back" onClick={onClose}>
          <IoArrowBack size={18} /><span>돌아가기</span>
        </button>
        <div className="nav-actions">
          {isAdmin && <button className="nav-cta-btn">✓ 등록하기</button>}
        </div>
      </div>

      <div className="gallery">
        <div className="gallery-main">
          <img src={images[activeImg]} alt="대표 이미지"
            onError={(e) => { e.currentTarget.src = fallbackImage; }} />
          <div className="gallery-overlay">
            <div className="gallery-info">
              <h1>{restaurant.name}</h1>
              <p>{restaurant.category}</p>
            </div>
          </div>
        </div>
        <div className="gallery-side">
          {images.slice(1, 3).map((img, i) => (
            <div key={i} className={"gallery-thumb" + (activeImg === i + 1 ? " active" : "")}
              onClick={() => setActiveImg(i + 1)}>
              <img src={img} alt="" />
            </div>
          ))}
          <div className="gallery-thumb gallery-more" onClick={() => setActiveImg(3)}>
            <img src={images[3]} alt="" />
            <div className="gallery-more-overlay">+{images.length - 3}</div>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <section className="info-card">
          <div className="info-name-header">
            <h2 className="info-restaurant-name">{restaurant.name}</h2>
            <span className="info-restaurant-category">{restaurant.category}</span>
          </div>

          <div className="info-rating-row">
            <StarRating rating={avgRating} size={15} />
            <span className="info-score">{Number(avgRating).toFixed(1)}</span>
            <span className="info-review-count">({totalReviews}개 리뷰)</span>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <LuMapPin className="info-icon" />
              <div>
                <p className="info-item-label">주소</p>
                <p className="info-item-value">{restaurant.address || restaurant.location || "정보 없음"}</p>
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
                <p className="info-item-value">{restaurant.price_range || restaurant.priceRange || "정보 없음"}</p>
              </div>
            </div>
          </div>

          {restaurant.description && (
            <div className="description-section">
              <p className="menu-section-label">가게 소개</p>
              <p className="description-text">{restaurant.description}</p>
            </div>
          )}

          <div className="menu-section">
            <p className="menu-section-label">대표 메뉴</p>
            <div className="menu-list">
              {menus.map((menu, i) => (
                <div key={i} className="menu-item">
                  <span className="menu-name">{menu}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="map-card">
          <div className="map-header">
            <h2 className="section-title">위치</h2>
            <p className="map-address">{restaurant.address || restaurant.location || "주소 정보 없음"}</p>
          </div>
          <div className="map-container">
            <KakaoMap
              address={restaurant.address || restaurant.location}
              name={restaurant.name}
              latitude={restaurant.latitude}
              longitude={restaurant.longitude}
            />
          </div>
        </section>

        <section className="analysis-card">
          <h2 className="section-title">리뷰 분석</h2>
          <div className="analysis-grid">
            <div className="analysis-col">
              <p className="analysis-label">별점 분포</p>
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar key={star} star={star} count={ratingDist[star]} total={sortedReviews.length} />
              ))}
            </div>
            <div className="analysis-col">
              <p className="analysis-label">평균 별점</p>
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: "#ff6b35" }}>
                  {Number(avgRating).toFixed(1)}
                </div>
                <StarRating rating={avgRating} size={20} />
                <div style={{ marginTop: 8, color: "#a0917f", fontSize: 13 }}>총 {totalReviews}개 리뷰</div>
              </div>
            </div>
          </div>
        </section>

        <section className="reviews-section">
          <div className="reviews-header">
            <h2 className="section-title">리뷰 {totalReviews}개</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                className="review-sort-select"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="latest">최신순</option>
                <option value="helpful">도움돼요 많은 순</option>
              </select>
              <button className="write-review-btn" onClick={onWriteReview}>✏ 리뷰 작성하기</button>
            </div>
          </div>

          {reviewLoading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#b0a090" }}>
              🍽️ 리뷰를 불러오는 중...
            </div>
          ) : sortedReviews.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#b0a090" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>아직 리뷰가 없어요</p>
              <p style={{ fontSize: 13 }}>첫 번째 리뷰를 작성해보세요!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {sortedReviews.map((review) => {
                const helpfulCount = review.helpfulCount ?? review.helpful_count ?? 0;
                const isActive = helpfulClicked[review.id];
                const nickname = review.nickname || review.memberNickname || "익명";
                const tags = review.situations || review.tags || [];
                const reviewImages = review.imageUrls || review.images || [];

                return (
                  <div key={review.id} className="review-card">
                    <div className="review-top">
                      <div className="review-avatar">{nickname[0]}</div>
                      <div className="review-user">
                        <div className="review-user-row">
                          <div className="review-nickname">{nickname}</div>
                          <div className="review-meta">
                            <StarRating rating={review.rating} size={18} />
                            <div className="review-date">{formatDate(review.createdAt || review.created_at)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="review-text">{review.content}</p>

                    {reviewImages.length > 0 && (
                      <div className="review-images">
                        {reviewImages.map((img, i) => (
                          <img key={i} src={img} alt="" className="review-img" />
                        ))}
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="review-tags">
                        {tags.map((tag) => (
                          <span key={tag} className="review-tag">#{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="review-footer">
                      <button
                        className={"review-action-btn" + (isActive ? " helpful-active" : "")}
                        onClick={() => handleHelpful(review.id)}
                      >
                        <LuThumbsUp size={13} />
                        도움돼요 {helpfulCount}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
