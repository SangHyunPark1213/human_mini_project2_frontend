import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./MainPage.css";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FiMapPin } from "react-icons/fi";
import { LuTrendingUp } from "react-icons/lu";

import RestaurantCard from "../components/restaurant/RestaurantCard";

function MainPages({ onRestaurantClick }) {
  const [sortType, setSortType] = useState("review");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [keyword, setKeyword] = useState(""); // ✅ 검색 브랜치꺼 추가
  const navigate = useNavigate(); // ✅ 검색 브랜치꺼 추가

  const restaurants = [
    /* 기존과 동일 */
  ];

  const dongList = {
    // ✅ 위쪽에만 한 번 선언 (중복 제거)
    dongnam: ["다가동", "광덕면" /* ... */],
    seobuk: ["두정동", "백석동" /* ... */],
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortType === "review") return b.review_count - a.review_count;
    if (sortType === "rating") return b.average_rating - a.average_rating;
    return 0;
  });

  // ✅ 검색 브랜치꺼 추가
  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("region", selectedDong || selectedGu || "천안전체");
    if (keyword.trim()) params.set("keyword", keyword.trim());
    navigate(`/search?${params.toString()}`);
  };

  // ✅ 검색 브랜치꺼 추가
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
                  <option value="dongnam">동남구</option>
                  <option value="seobuk">서북구</option>
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
                {/* ✅ 검색 브랜치: value/onChange/onKeyDown 추가 */}
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

              {/* ✅ 검색 브랜치: onClick 연결 */}
              <button onClick={handleSearch}>
                <HiMiniMagnifyingGlass />
              </button>
            </div>
          </div>
        </section>

        {/* ✅ 검색 브랜치: handleCategoryClick 연결 */}
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

        <div className="popular_menu_list">
          <div className="popular_menu_list_title">
            <p>
              <LuTrendingUp /> 지금 가장 인기있는 맛집 🔥
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

          <div className="restaurant-grid">
            {sortedRestaurants.slice(0, 6).map((restaurant, index) => (
              <div className="rank-card-wrap" key={restaurant.id}>
                <div className="rank-badge">#{index + 1}</div>
                <RestaurantCard
                  restaurant={restaurant}
                  onClick={onRestaurantClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPages;
