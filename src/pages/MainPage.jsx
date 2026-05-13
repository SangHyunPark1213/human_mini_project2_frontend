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
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // DB dummy_restaurants.sql 의 id(1~6)와 일치
  const restaurants = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
      name: "천안곱창맛집",
      category: "한식",
      average_rating: 4.3,
      location: "충남 천안시 동남구 신부동",
      popular_menu: "곱창볶음, 막창구이, 볶음밥",
      review_count: 128,
      phone: "041-111-1111",
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600",
      name: "스시오마카세",
      category: "일식",
      average_rating: 4.9,
      location: "충남 천안시 서북구 불당동",
      popular_menu: "오마카세 코스, 연어초밥, 참치대뱃살",
      review_count: 87,
      phone: "041-222-2222",
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      name: "파스타공방",
      category: "양식",
      average_rating: 4.6,
      location: "충남 천안시 동남구 청당동",
      popular_menu: "까르보나라, 봉골레, 토마토파스타",
      review_count: 54,
      phone: "041-333-3333",
    },
    {
      id: 4,
      thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
      name: "명동칼국수",
      category: "한식",
      average_rating: 4.1,
      location: "충남 천안시 동남구 대흥동",
      popular_menu: "칼국수, 만두, 비빔국수",
      review_count: 210,
      phone: "041-444-4444",
    },
    {
      id: 5,
      thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
      name: "버거브로스",
      category: "패스트푸드",
      average_rating: 4.4,
      location: "충남 천안시 서북구 두정동",
      popular_menu: "수제버거, 감자튀김, 밀크쉐이크",
      review_count: 76,
      phone: "041-555-5555",
    },
    {
      id: 6,
      thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
      name: "달콤카페",
      category: "카페",
      average_rating: 4.7,
      location: "충남 천안시 서북구 성정동",
      popular_menu: "아메리카노, 크로플, 딸기라떼",
      review_count: 143,
      phone: "041-666-6666",
    },
  ];

  const dongList = {
    dongnam: [
      "다가동", "광덕면", "구성동", "구룡동", "대흥동", "동면", "목천읍",
      "문화동", "문성동", "병천면", "봉명동", "북면", "사직동", "삼룡동",
      "성남면", "성황동", "수신면", "신방동", "신부동", "신안동", "쌍용동",
      "안서동", "영성동", "오룡동", "용곡동", "원성1동", "원성2동", "원성동",
      "유량동", "일봉동", "중앙동", "청당동", "청룡동", "청수동", "풍세면",
    ],
    seobuk: [
      "두정동", "백석동", "부대동", "부성1동", "부성2동", "불당1동", "불당2동",
      "불당동", "성거읍", "성성동", "성정1동", "성정2동", "성정동", "성환읍",
      "신당동", "쌍용1동", "쌍용2동", "쌍용3동", "쌍용동", "업성동", "와촌동",
      "입장면", "직산읍", "차암동",
    ],
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortType === "review") return b.review_count - a.review_count;
    if (sortType === "rating") return b.average_rating - a.average_rating;
    return 0;
  });

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
