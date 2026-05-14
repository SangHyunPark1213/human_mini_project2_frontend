import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchPage.css";
import { useState, useEffect } from "react";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import { FaAngleDown } from "react-icons/fa";
import { getRestaurants } from "../api/restaurantAPI";

// 리뷰 작성 분위기 태그와 동일하게 맞춘 상황/테마 목록
const SITUATION_TAGS = [
  { label: "🍱 혼밥", value: "혼밥가능" },
  { label: "💑 데이트", value: "데이트추천" },
  { label: "👨‍👩‍👧 가족 모임", value: "가족 모임" },
  { label: "🍻 친구/회식", value: "친구/회식" },
  { label: "💰 가성비", value: "가성비" },
  { label: "🎉 특별한 날", value: "특별한 날" },
  { label: "🌙 야식/늦은 밤", value: "야식/늦은 밤" },
  { label: "🤫 조용한 곳", value: "조용한 곳" },
  { label: "🌅 뷰 맛집", value: "뷰 맛집" },
  { label: "👥 단체/모임", value: "단체/모임" },
  { label: "✨ 분위기 좋음", value: "분위기좋음" },
  { label: "🔄 재방문 의사", value: "재방문의사" },
];

function SearchPage({ onRestaurantClick }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const region = searchParams.get("region") || "";
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [sortType, setSortType] = useState("latest");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dongList = {
    동남구: [
      "다가동","광덕면","구성동","구룡동","대흥동","동면","목천읍",
      "문화동","문성동","병천면","봉명동","북면","사직동","삼룡동",
      "성남면","성황동","수신면","신방동","신부동","신안동","쌍용동",
      "안서동","영성동","오룡동","용곡동","원성1동","원성2동","원성동",
      "유량동","일봉동","중앙동","청당동","청룡동","청수동","풍세면",
    ],
    서북구: [
      "두정동","백석동","부대동","부성1동","부성2동","불당1동","불당2동",
      "불당동","성거읍","성성동","성정1동","성정2동","성정동","성환읍",
      "신당동","쌍용1동","쌍용2동","쌍용3동","쌍용동","업성동","와촌동",
      "입장면","직산읍","차암동",
    ],
  };

  const getInitialGu = () => {
    if (dongList["동남구"].includes(region)) return "동남구";
    if (dongList["서북구"].includes(region)) return "서북구";
    return "";
  };

  const [selectedGu, setSelectedGu] = useState(getInitialGu);
  const [selectedDong, setSelectedDong] = useState(
    region === "천안전체" ? "" : region
  );

  // 백엔드에서 식당 목록 가져오기 (카테고리 변경 시 재조회)
  useEffect(() => {
    setLoading(true);
    setError(null);
    getRestaurants(selectedCategory || undefined)
      .then((data) => {
        setRestaurants(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("식당 목록 조회 실패:", err);
        setError("식당 목록을 불러오는데 실패했습니다.");
        setRestaurants([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const toggleSituation = (situation) => {
    setSelectedSituations((prev) =>
      prev.includes(situation)
        ? prev.filter((item) => item !== situation)
        : [...prev, situation]
    );
  };

  const removeSituation = (situation) => {
    setSelectedSituations((prev) => prev.filter((item) => item !== situation));
  };

  // 필터링 (지역, 키워드, 상황 - 프론트에서 처리)
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const addr = restaurant.address || restaurant.location || "";
    const matchRegion =
      !selectedDong && !selectedGu
        ? true
        : selectedDong
          ? addr.includes(selectedDong)
          : addr.includes(selectedGu);

    const matchCategory =
      !selectedCategory || restaurant.category === selectedCategory;

    const restaurantName = restaurant.name || "";
    const restaurantCategory = restaurant.category || "";
    const restaurantMenu = restaurant.popularMenu || restaurant.popular_menu || "";
    const matchKeyword =
      !keyword ||
      restaurantName.includes(keyword) ||
      restaurantCategory.includes(keyword) ||
      restaurantMenu.includes(keyword);

    // situations 필터: 식당에 situations 정보가 있으면 필터, 없으면 전체 노출
    const restaurantSituations = restaurant.situations || [];
    const matchSituation =
      selectedSituations.length === 0 ||
      restaurantSituations.length === 0 ||
      selectedSituations.some((s) => restaurantSituations.includes(s));

    return matchRegion && matchCategory && matchKeyword && matchSituation;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortType === "review") {
      return (b.reviewCount ?? b.review_count ?? 0) - (a.reviewCount ?? a.review_count ?? 0);
    }
    if (sortType === "rating") {
      return (b.averageRating ?? b.average_rating ?? 0) - (a.averageRating ?? a.average_rating ?? 0);
    }
    return (b.id ?? 0) - (a.id ?? 0);
  });

  const normalizeRestaurant = (r) => ({
    ...r,
    thumbnail: r.thumbnail || r.image,
    location: r.address || r.location,
    average_rating: r.averageRating ?? r.average_rating,
    review_count: r.reviewCount ?? r.review_count,
    popular_menu: r.popularMenu ?? r.popular_menu,
  });

  return (
    <main className="search-page">
      <section className="search-hero">
        <div className="search-hero-content">
          <h1>오늘은 어디서 먹을까?</h1>
          <p>실제 리뷰 기반으로 찾는 우리 동네 진짜 맛집</p>
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-group">
          <p className="filter-title">지역</p>
          <button
            className={!selectedGu ? "filter-active" : ""}
            onClick={() => { setSelectedGu(""); setSelectedDong(""); }}
          >
            천안 전체
          </button>
          <div className="select-wrap">
            <select
              className="filter-select"
              value={selectedGu}
              onChange={(e) => { setSelectedGu(e.target.value); setSelectedDong(""); }}
            >
              <option value="">구 선택</option>
              <option value="동남구">동남구</option>
              <option value="서북구">서북구</option>
            </select>
            <FaAngleDown />
          </div>
          <div className="select-wrap">
            <select
              className="filter-select"
              value={selectedDong}
              onChange={(e) => setSelectedDong(e.target.value)}
              disabled={!selectedGu}
            >
              <option value="">동네 선택</option>
              {selectedGu &&
                dongList[selectedGu].map((dong) => (
                  <option key={dong} value={dong}>{dong}</option>
                ))}
            </select>
            <FaAngleDown />
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-title">음식 카테고리</p>
          {[
            { label: "전체", value: "" },
            { label: "🍚 한식", value: "한식" },
            { label: "🥢 중식", value: "중식" },
            { label: "🍱 일식", value: "일식" },
            { label: "🍝 양식", value: "양식" },
            { label: "☕ 카페", value: "카페" },
            { label: "🍺 술집", value: "술집" },
            { label: "🍰 디저트", value: "디저트" },
            { label: "🍔 패스트푸드", value: "패스트푸드" },
          ].map(({ label, value }) => (
            <button
              key={value}
              className={selectedCategory === value ? "filter-active" : ""}
              onClick={() => setSelectedCategory(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <p className="filter-title">상황 / 테마</p>
          {SITUATION_TAGS.map(({ label, value }) => (
            <button
              key={value}
              className={selectedSituations.includes(value) ? "filter-active" : ""}
              onClick={() => toggleSituation(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="result-section">
        <div className="result-header">
          <div>
            <strong>
              {loading ? "검색 중..." : `총 ${sortedRestaurants.length}개의 맛집`}
            </strong>
            <div className="selected-tags">
              <span>{selectedDong || selectedGu || "천안 전체"}</span>
              {selectedCategory && <span>{selectedCategory}</span>}
              {keyword && <span>{keyword}</span>}
              {selectedSituations.map((situation) => {
                const tag = SITUATION_TAGS.find((t) => t.value === situation);
                return (
                  <span key={situation} className="tag-removable">
                    {tag ? tag.label : situation}
                    <button type="button" onClick={() => removeSituation(situation)}>×</button>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="select-wrap">
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="latest">최신 등록 순</option>
              <option value="review">리뷰 많은 순</option>
              <option value="rating">별점 높은 순</option>
            </select>
            <FaAngleDown />
          </div>
        </div>

        {loading && (
          <div className="search-loading">
            <div className="loading-spinner" />
            <p>맛집 정보를 불러오는 중...</p>
          </div>
        )}

        {error && !loading && (
          <div className="search-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        )}

        {!loading && !error && sortedRestaurants.length === 0 && (
          <div className="search-empty">
            <p>🍽️ 조건에 맞는 맛집이 없습니다.</p>
            <p>필터를 바꿔서 다시 검색해보세요!</p>
          </div>
        )}

        {!loading && !error && (
          <div className="search-result-grid">
            {sortedRestaurants.map((restaurant) => {
              const normalized = normalizeRestaurant(restaurant);
              return (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={normalized}
                  onClick={onRestaurantClick || (() => {})}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchPage;
