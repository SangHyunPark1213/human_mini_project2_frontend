import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./MainPage.css";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FiMapPin } from "react-icons/fi";
import { LuTrendingUp, LuClock } from "react-icons/lu";

import RestaurantCard from "../components/restaurant/RestaurantCard";
import { getRestaurants } from "../api/restaurantAPI";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600";

const RecentSlider = ({ restaurants, loading, error, onRestaurantClick, normalizeRestaurant }) => {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const CARD_W = 220; // 카드 너비 + gap
  const SCROLL_AMOUNT = CARD_W * 3;

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: "smooth" });
    setTimeout(updateButtons, 350);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    updateButtons();
    return () => el.removeEventListener("scroll", updateButtons);
  }, [restaurants]);

  return (
    <div className="recent-slider-section">
      <div className="popular_menu_list_title" style={{ padding: "0 45px", marginBottom: 24 }}>
        <p><LuClock /> 최근 등록된 맛집</p>
      </div>

      {loading ? (
        <div className="loading-state">🍽️ 맛집 정보를 불러오는 중...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">등록된 맛집이 없습니다.</div>
      ) : (
        <div className="recent-slider-wrap">
          <button
            className={"slider-arrow slider-arrow-left" + (!canPrev ? " hidden" : "")}
            onClick={() => scroll(-1)}
            aria-label="이전"
          >‹</button>

          <div className="recent-slider-track" ref={trackRef}>
            {restaurants.map((r) => {
              const nr = normalizeRestaurant(r);
              return (
                <button
                  key={r.id}
                  className="recent-slide-card"
                  onClick={() => onRestaurantClick(r)}
                >
                  <div className="recent-slide-img">
                    <img
                      src={nr.thumbnail || nr.image || FALLBACK_IMG}
                      alt={nr.name}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    />
                    {nr.average_rating > 0 && (
                      <span className="recent-slide-score">
                        ★ {Number(nr.average_rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="recent-slide-info">
                    <p className="recent-slide-name">{nr.name}</p>
                    <p className="recent-slide-category">{nr.category}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            className={"slider-arrow slider-arrow-right" + (!canNext ? " hidden" : "")}
            onClick={() => scroll(1)}
            aria-label="다음"
          >›</button>
        </div>
      )}
    </div>
  );
};

function MainPages({ onRestaurantClick }) {
  const [sortType, setSortType] = useState("review");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [keyword, setKeyword] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getRestaurants()
      .then((data) => {
        setRestaurants(data);
        setError(null);
      })
      .catch((err) => {
        console.error("식당 목록 불러오기 실패:", err);
        setError("식당 데이터를 불러오는 데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  const dongList = {
    동남구: [
      "다가동",
      "광덕면",
      "구성동",
      "구룡동",
      "대흥동",
      "동면",
      "목천읍",
      "문화동",
      "문성동",
      "병천면",
      "봉명동",
      "북면",
      "사직동",
      "삼룡동",
      "성남면",
      "성황동",
      "수신면",
      "신방동",
      "신부동",
      "신안동",
      "쌍용동",
      "안서동",
      "영성동",
      "오룡동",
      "용곡동",
      "원성1동",
      "원성2동",
      "원성동",
      "유량동",
      "일봉동",
      "중앙동",
      "청당동",
      "청룡동",
      "청수동",
      "풍세면",
    ],
    서북구: [
      "두정동",
      "백석동",
      "부대동",
      "부성1동",
      "부성2동",
      "불당1동",
      "불당2동",
      "불당동",
      "성거읍",
      "성성동",
      "성정1동",
      "성정2동",
      "성정동",
      "성환읍",
      "신당동",
      "쌍용1동",
      "쌍용2동",
      "쌍용3동",
      "쌍용동",
      "업성동",
      "와촌동",
      "입장면",
      "직산읍",
      "차암동",
    ],
  };

  const normalizeRestaurant = (r) => ({
    ...r,
    average_rating: r.averageRating ?? r.average_rating ?? 0,
    review_count: r.reviewCount ?? r.review_count ?? 0,
    location: r.address ?? r.location ?? "",
    popular_menu: r.popularMenu ?? r.popular_menu ?? "",
  });

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortType === "review")
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    if (sortType === "rating")
      return (b.averageRating ?? 0) - (a.averageRating ?? 0);
    return 0;
  });

  const recentRestaurants = [...restaurants].sort((a, b) => b.id - a.id);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("region", selectedDong || selectedGu || "천안전체");
    if (keyword.trim()) params.set("keyword", keyword.trim());
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams();
    params.set("region", "천안전체");
    params.set("category", category);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <main className="main-page">
      <div className="main-container">
        <section className="hero">
          <div className="hero-overlay">
            <h1>오늘은 어디서 먹을까?</h1>
            <p>실제 리뷰 기반으로 찾는 우리 동네 진짜 맛집</p>
            <div className="hero-search">
              <div className="region-select-wrap">
                <FiMapPin />
                <select
                  className="region-select"
                  value={selectedGu}
                  onChange={(e) => {
                    setSelectedGu(e.target.value);
                    setSelectedDong("");
                  }}
                >
                  <option value="">구 선택</option>
                  <option value="동남구">동남구</option>
                  <option value="서북구">서북구</option>
                </select>
                <select
                  className="dong-select"
                  value={selectedDong}
                  onChange={(e) => setSelectedDong(e.target.value)}
                  disabled={!selectedGu}
                >
                  <option value="">동네 선택</option>
                  {selectedGu &&
                    dongList[selectedGu].map((dong) => (
                      <option key={dong} value={dong}>
                        {dong}
                      </option>
                    ))}
                </select>
              </div>
              <div className="keyword-search-box">
                <HiMiniMagnifyingGlass />
                <input
                  type="text"
                  placeholder="음식, 메뉴, 식당 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <button onClick={handleSearch}>
                <HiMiniMagnifyingGlass />
              </button>
            </div>
          </div>
        </section>

        <div className="category-container">
          <button onClick={() => handleCategoryClick("한식")}>
            <p>🍚</p>한식
          </button>
          <button onClick={() => handleCategoryClick("중식")}>
            <p>🥢</p>중식
          </button>
          <button onClick={() => handleCategoryClick("일식")}>
            <p>🍱</p>일식
          </button>
          <button onClick={() => handleCategoryClick("양식")}>
            <p>🍝</p>양식
          </button>
          <button onClick={() => handleCategoryClick("카페")}>
            <p>☕</p>카페
          </button>
          <button onClick={() => handleCategoryClick("술집")}>
            <p>🍺</p>술집
          </button>
          <button onClick={() => handleCategoryClick("디저트")}>
            <p>🍰</p>디저트
          </button>
          <button onClick={() => handleCategoryClick("패스트푸드")}>
            <p>🍔</p>패스트푸드
          </button>
        </div>

        {/* ── 인기 맛집 섹션 ── */}
        <div className="popular_menu_list">
          <div className="popular_menu_list_title">
            <p>
              <LuTrendingUp /> 지금 가장 인기있는 맛집
            </p>
            <select
              className="popular_menu_select"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="review">리뷰 많은 순</option>
              <option value="rating">별점 높은 순</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-state">🍽️ 맛집 정보를 불러오는 중...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : sortedRestaurants.length === 0 ? (
            <div className="empty-state">등록된 맛집이 없습니다.</div>
          ) : (
            <div className="restaurant-grid">
              {sortedRestaurants.slice(0, 6).map((restaurant, index) => (
                <div className="rank-card-wrap" key={restaurant.id}>
                  <div className="rank-badge">#{index + 1}</div>
                  <RestaurantCard
                    restaurant={normalizeRestaurant(restaurant)}
                    onClick={() => onRestaurantClick(restaurant)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 최근 등록된 맛집 슬라이더 ── */}
        <RecentSlider
          restaurants={recentRestaurants}
          loading={loading}
          error={error}
          onRestaurantClick={onRestaurantClick}
          normalizeRestaurant={normalizeRestaurant}
        />
      </div>
    </main>
  );
}

export default MainPages;
