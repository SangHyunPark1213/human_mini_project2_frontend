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

  const restaurants = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
      name: "천안곱창맛집",
      category: "한식",
      average_rating: 4.3,
      location: "충남 천안시 동남구",
      description:
        "천안에서 유명한 곱창 맛집입니다. 신선한 재료로 매일 준비합니다.",
      popular_menu: "곱창볶음, 막창구이, 볶음밥",
      review_count: 128,
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600",
      name: "스시오마카세",
      category: "일식",
      average_rating: 4.9,
      location: "충남 천안시 서북구",
      description:
        "셰프가 직접 엄선한 신선한 해산물로 만드는 정통 오마카세 스시.",
      popular_menu: "오마카세 코스, 연어초밥, 참치대뱃살",
      review_count: 87,
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      name: "파스타공방",
      category: "양식",
      average_rating: 4.6,
      location: "충남 천안시 동남구",
      description:
        "직접 뽑은 생면 파스타와 최고의 소스로 만드는 정통 이탈리안 요리.",
      popular_menu: "까르보나라, 봉골레, 토마토파스타",
      review_count: 54,
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      name: "파스타공방",
      category: "양식",
      average_rating: 4.3,
      location: "충남 천안시 동남구",
      description:
        "직접 뽑은 생면 파스타와 최고의 소스로 만드는 정통 이탈리안 요리.",
      popular_menu: "까르보나라, 봉골레, 토마토파스타",
      review_count: 54,
    },
    {
      id: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      name: "파스타공방",
      category: "양식",
      average_rating: 4.3,
      location: "충남 천안시 동남구",
      description:
        "직접 뽑은 생면 파스타와 최고의 소스로 만드는 정통 이탈리안 요리.",
      popular_menu: "까르보나라, 봉골레, 토마토파스타",
      review_count: 54,
    },
    {
      id: 6,
      thumbnail:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      name: "파스타공방",
      category: "양식",
      average_rating: 4.3,
      location: "충남 천안시 동남구",
      description:
        "직접 뽑은 생면 파스타와 최고의 소스로 만드는 정통 이탈리안 요리.",
      popular_menu: "까르보나라, 봉골레, 토마토파스타",
      review_count: 54,
    },
  ];

  const dongList = {
    dongnam: [
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
    seobuk: [
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

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortType === "review") return b.review_count - a.review_count;
    if (sortType === "rating") return b.average_rating - a.average_rating;
    return 0;
  });

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
                <input type="text" placeholder="음식, 메뉴, 식당 검색" />
              </div>

              <button>
                <HiMiniMagnifyingGlass />
              </button>
            </div>
          </div>
        </section>

        <div className="category-container">
          <button>
            <p>🍚</p>한식
          </button>
          <button>
            <p>🥢</p>중식
          </button>
          <button>
            <p>🍱</p>일식
          </button>
          <button>
            <p>🍝</p>양식
          </button>
          <button>
            <p>☕</p>카페
          </button>
          <button>
            <p>🍺</p>술집
          </button>
          <button>
            <p>🍰</p>디저트
          </button>
          <button>
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
