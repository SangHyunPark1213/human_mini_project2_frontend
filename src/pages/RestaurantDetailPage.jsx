import { useState, useEffect, useRef } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import {
  LuMapPin,
  LuPhone,
  LuClock,
  LuCreditCard,
  LuThumbsUp,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuX,
} from "react-icons/lu";

import "./RestaurantDetailPage.css";
import {
  getReviewsByRestaurant,
  toggleHelpful,
  updateReview,
  deleteReview,
} from "../api/reviewAPI";

const REVIEWS_PER_PAGE = 5;

/* ───────── 별점 컴포넌트 ───────── */
const StarRating = ({ rating, size = 13 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)
      stars.push(
        <FaStar key={i} className="star filled" style={{ fontSize: size }} />,
      );
    else if (rating >= i - 0.5)
      stars.push(
        <FaStarHalfAlt
          key={i}
          className="star filled"
          style={{ fontSize: size }}
        />,
      );
    else
      stars.push(
        <FaRegStar key={i} className="star" style={{ fontSize: size }} />,
      );
  }
  return <div className="star-row">{stars}</div>;
};

/* ───────── 별점 분포 바 ───────── */
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

/* ───────── 카카오 지도 ───────── */
const KakaoMap = ({ address, name, latitude, longitude }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapStatus, setMapStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const initMap = () => {
      if (cancelled || !mapRef.current) return;
      try {
        const kakao = window.kakao;
        if (!kakao || !kakao.maps) {
          setMapStatus("error");
          return;
        }

        // 이미 생성된 지도 인스턴스가 있으면 재사용
        const map = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(36.8081, 127.1475),
          level: 4,
        });
        mapInstanceRef.current = map;

        const placeMarker = (lat, lng) => {
          if (cancelled) return;
          const coords = new kakao.maps.LatLng(lat, lng);
          new kakao.maps.Marker({ map, position: coords });
          new kakao.maps.InfoWindow({
            content: `<div style="padding:6px 12px;font-size:13px;font-weight:700;white-space:nowrap;">${name}</div>`,
          }).open(map, new kakao.maps.Marker({ map, position: coords }));
          map.setCenter(coords);

          // 컨테이너 크기 변화에 대응해 타일 다시 그리기
          setTimeout(() => {
            if (!cancelled && mapInstanceRef.current) {
              mapInstanceRef.current.relayout();
            }
          }, 100);

          setMapStatus("ok");
        };

        if (latitude && longitude) {
          placeMarker(latitude, longitude);
        } else if (address) {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.addressSearch(address, (result, status) => {
            if (cancelled) return;
            if (status === kakao.maps.services.Status.OK)
              placeMarker(result[0].y, result[0].x);
            else setMapStatus("error");
          });
        } else {
          setMapStatus("error");
        }
      } catch (e) {
        console.error("카카오맵 오류:", e);
        if (!cancelled) setMapStatus("error");
      }
    };

    setMapStatus("loading");

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
    } else {
      let attempts = 0;
      const timer = setInterval(() => {
        if (++attempts > 30) {
          clearInterval(timer);
          if (!cancelled) setMapStatus("error");
          return;
        }
        if (window.kakao && window.kakao.maps) {
          clearInterval(timer);
          window.kakao.maps.load(initMap);
        }
      }, 300);
      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [address, name, latitude, longitude]);

  // 스크롤로 인한 지도 타일 깨짐 방지: ResizeObserver로 컨테이너 크기 변화 감지
  useEffect(() => {
    if (!mapRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.relayout();
    });
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  if (mapStatus === "error") {
    return (
      <div
        className="map-placeholder"
        style={{ flexDirection: "column", gap: 8 }}
      >
        <LuMapPin size={28} style={{ color: "#ff6b35" }} />
        <span style={{ textAlign: "center", padding: "0 16px" }}>
          {address || "주소 정보 없음"}
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {mapStatus === "loading" && (
        <div
          className="map-placeholder"
          style={{
            position: "absolute",
            inset: 0,
            background: "#f5f2ee",
            zIndex: 1,
          }}
        >
          <span>지도를 불러오는 중...</span>
        </div>
      )}
    </div>
  );
};

/* ───────── 리뷰 카드 (수정 인라인 포함) ───────── */
const ReviewCard = ({
  review,
  restaurantId,
  currentUserNickname,
  helpfulActive,
  onHelpful,
  onUpdated,
  onDeleted,
}) => {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [saving, setSaving] = useState(false);

  const isOwner =
    currentUserNickname && review.nickname === currentUserNickname;

  const handleSave = async () => {
    if (editContent.trim().length < 10) {
      alert("리뷰를 10자 이상 작성해주세요.");
      return;
    }
    setSaving(true);
    try {
      await updateReview(review.id, {
        restaurantId,
        rating: editRating,
        content: editContent,
        revisit: review.revisit || "N",
        receiptUrl: null,
        imageUrls: review.imageUrls || [],
        situations: review.situations || [],
      });
      onUpdated({
        ...review,
        content: editContent,
        rating: editRating,
        modified: true,
      });
      setEditing(false);
    } catch (e) {
      alert(e.message || "수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("리뷰를 삭제하시겠어요?")) return;
    try {
      await deleteReview(review.id, restaurantId);
      onDeleted(review.id);
    } catch (e) {
      alert(e.message || "삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const displayRating = hoverRating || editRating;

  return (
    <div className="review-card">
      <div className="review-top">
        <div className="review-avatar">{(review.nickname || "익")[0]}</div>
        <div className="review-user" style={{ flex: 1 }}>
          <div className="review-user-row">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="review-nickname">{review.nickname || "익명"}</div>
              {review.modified && (
                <span className="review-modified-badge">(수정됨)</span>
              )}
            </div>
            <div className="review-meta">
              {!editing && <StarRating rating={review.rating} size={18} />}
              <div className="review-date">{formatDate(review.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* 내 리뷰에만 수정/삭제 버튼 표시 */}
        {isOwner && !editing && (
          <div className="review-owner-actions">
            <button
              className="review-edit-btn"
              onClick={() => setEditing(true)}
              title="수정"
            >
              <LuPencil size={14} />
            </button>
            <button
              className="review-delete-btn"
              onClick={handleDelete}
              title="삭제"
            >
              <LuTrash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 수정 모드 */}
      {editing ? (
        <div className="review-edit-area">
          {/* 별점 수정 */}
          <div className="review-edit-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={"edit-star" + (s <= displayRating ? " active" : "")}
                onClick={() => setEditRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <FaStar />
              </span>
            ))}
          </div>
          <textarea
            className="review-edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value.slice(0, 500))}
            rows={4}
          />
          <div className="review-edit-footer">
            <span className="review-edit-count">
              {editContent.length} / 500자
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="review-edit-cancel"
                onClick={() => {
                  setEditing(false);
                  setEditContent(review.content);
                  setEditRating(review.rating);
                }}
              >
                <LuX size={13} /> 취소
              </button>
              <button
                className="review-edit-save"
                onClick={handleSave}
                disabled={saving}
              >
                <LuCheck size={13} /> {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="review-text">{review.content}</p>
      )}

      {!editing && review.imageUrls?.length > 0 && (
        <div className="review-images">
          {review.imageUrls.map((img, i) => (
            <img key={i} src={img} alt="" className="review-img" />
          ))}
        </div>
      )}

      {!editing && review.situations?.length > 0 && (
        <div className="review-tags">
          {review.situations.map((tag) => (
            <span key={tag} className="review-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 도움돼요 버튼 — 카드 내부 footer */}
      {!editing && (
        <div className="review-footer">
          <button
            className={
              "review-action-btn" + (helpfulActive ? " helpful-active" : "")
            }
            onClick={onHelpful}
          >
            <LuThumbsUp size={13} />
            도움돼요 {review.helpfulCount ?? 0}
          </button>
        </div>
      )}
    </div>
  );
};

/* ───────── 메인 상세 페이지 ───────── */
const RestaurantDetailPage = ({
  restaurant,
  onClose,
  onWriteReview,
  isAdmin = false,
  user,
  refreshKey = 0,
}) => {
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [sortType, setSortType] = useState("latest");
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [reviewPage, setReviewPage] = useState(1);

  if (!restaurant) return null;

  const fallbackImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200";
  // 더미 이미지 제거 — 실제 thumbnail만 사용
  const mainImage = restaurant.thumbnail || restaurant.image || fallbackImage;

  useEffect(() => {
    if (!restaurant.id) {
      setReviewLoading(false);
      return;
    }
    setReviewLoading(true);
    setReviewPage(1);
    getReviewsByRestaurant(restaurant.id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setReviewLoading(false));
  }, [restaurant.id, refreshKey]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortType === "helpful")
      return (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const pagedReviews = sortedReviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );

  const totalReviews = restaurant.reviewCount ?? sortedReviews.length;
  const avgRating = restaurant.averageRating ?? 0;

  const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  sortedReviews.forEach((r) => {
    const s = Math.round(r.rating);
    if (s >= 1 && s <= 5) ratingDist[s]++;
  });

  const menus = (restaurant.popularMenu || "대표메뉴")
    .split(",")
    .map((m) => m.trim());

  const handleHelpful = async (reviewId) => {
    const wasClicked = helpfulClicked[reviewId];
    setHelpfulClicked((prev) => ({ ...prev, [reviewId]: !wasClicked }));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              helpfulCount: (r.helpfulCount ?? 0) + (wasClicked ? -1 : 1),
            }
          : r,
      ),
    );
    try {
      await toggleHelpful(reviewId);
    } catch {
      /* 미인증 무시 */
    }
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? updatedReview : r)),
    );
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <div className="detail-page">
      {/* 네비 */}
      <div className="detail-nav">
        <button className="nav-back" onClick={onClose}>
          <IoArrowBack size={18} />
          <span>돌아가기</span>
        </button>
        <div className="nav-actions">
          {isAdmin && <button className="nav-cta-btn">✓ 등록하기</button>}
        </div>
      </div>

      {/* 대표 이미지 — 더미 제거, 단일 이미지 */}
      <div className="gallery-single">
        <img
          src={mainImage}
          alt={restaurant.name}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <div className="gallery-overlay">
          <div className="gallery-info">
            <h1>{restaurant.name}</h1>
            <p>{restaurant.category}</p>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {/* 정보 */}
        <section className="info-card">
          <div className="info-name-header">
            <h2 className="info-restaurant-name">{restaurant.name}</h2>
            <span className="info-restaurant-category">
              {restaurant.category}
            </span>
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
                <p className="info-item-value">
                  {restaurant.address || "정보 없음"}
                </p>
              </div>
            </div>
            <div className="info-item">
              <LuPhone className="info-icon" />
              <div>
                <p className="info-item-label">전화번호</p>
                <p className="info-item-value">
                  {restaurant.phone || "정보 없음"}
                </p>
              </div>
            </div>
            <div className="info-item">
              <LuClock className="info-icon" />
              <div>
                <p className="info-item-label">영업시간</p>
                <p className="info-item-value">
                  {restaurant.hours || "정보 없음"}
                </p>
              </div>
            </div>
            <div className="info-item">
              <LuCreditCard className="info-icon" />
              <div>
                <p className="info-item-label">가격대</p>
                <p className="info-item-value">
                  {restaurant.priceRange || "정보 없음"}
                </p>
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

        {/* 지도 */}
        <section className="map-card">
          <div className="map-header">
            <h2 className="section-title">위치</h2>
            <p className="map-address">
              {restaurant.address || "주소 정보 없음"}
            </p>
          </div>
          <div className="map-container">
            <KakaoMap
              address={restaurant.address}
              name={restaurant.name}
              latitude={restaurant.latitude}
              longitude={restaurant.longitude}
            />
          </div>
        </section>

        {/* 리뷰 분석 */}
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
                  total={sortedReviews.length}
                />
              ))}
            </div>
            <div className="analysis-col">
              <p className="analysis-label">평균 별점</p>
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{ fontSize: 48, fontWeight: 800, color: "#ff6b35" }}
                >
                  {Number(avgRating).toFixed(1)}
                </div>
                <StarRating rating={avgRating} size={20} />
                <div style={{ marginTop: 8, color: "#a0917f", fontSize: 13 }}>
                  총 {totalReviews}개 리뷰
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 리뷰 목록 */}
        <section className="reviews-section">
          <div className="reviews-header">
            <h2 className="section-title">리뷰 {totalReviews}개</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                className="review-sort-select"
                value={sortType}
                onChange={(e) => {
                  setSortType(e.target.value);
                  setReviewPage(1);
                }}
              >
                <option value="latest">최신순</option>
                <option value="helpful">도움돼요 많은 순</option>
              </select>
              <button className="write-review-btn" onClick={onWriteReview}>
                ✏ 리뷰 작성하기
              </button>
            </div>
          </div>

          {reviewLoading ? (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                color: "#b0a090",
              }}
            >
              🍽️ 리뷰를 불러오는 중...
            </div>
          ) : sortedReviews.length === 0 ? (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                color: "#b0a090",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>
                아직 리뷰가 없어요
              </p>
              <p style={{ fontSize: 13 }}>첫 번째 리뷰를 작성해보세요!</p>
            </div>
          ) : (
            <>
              <div className="reviews-list">
                {pagedReviews.map((review) => (
                  <div key={review.id}>
                    <ReviewCard
                      review={review}
                      restaurantId={restaurant.id}
                      currentUserNickname={user?.nickname}
                      onUpdated={handleReviewUpdated}
                      onDeleted={handleReviewDeleted}
                    />
                    {/* 도움돼요 버튼 — 카드 아래 */}
                    <div
                      className="review-footer"
                      style={{ padding: "0 24px 16px" }}
                    >
                      <button
                        className={
                          "review-action-btn" +
                          (helpfulClicked[review.id] ? " helpful-active" : "")
                        }
                        onClick={() => handleHelpful(review.id)}
                      >
                        <LuThumbsUp size={13} />
                        도움돼요 {review.helpfulCount ?? 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="review-pagination">
                  <button
                    className="page-btn"
                    disabled={reviewPage === 1}
                    onClick={() => setReviewPage((p) => p - 1)}
                  >
                    ‹ 이전
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={
                          "page-btn" + (page === reviewPage ? " active" : "")
                        }
                        onClick={() => setReviewPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    className="page-btn"
                    disabled={reviewPage === totalPages}
                    onClick={() => setReviewPage((p) => p + 1)}
                  >
                    다음 ›
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
