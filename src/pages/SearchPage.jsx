import { useSearchParams } from "react-router-dom";
import "./SearchPage.css";
import { useState } from "react";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import { FaAngleDown } from "react-icons/fa";

function SearchPage() {
  const [searchParams] = useSearchParams();

  const region = searchParams.get("region") || "";
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [sortType, setSortType] = useState("latest");

  const dongList = {
  동남구: ["다가동", "광덕면", "구성동", "구룡동", "대흥동", "동면", "목천읍", "문화동", "문성동", "병천면", "봉명동", "북면", "사직동", "삼룡동", "성남면", "성황동", "수신면", "신방동", "신부동", "신안동", "쌍용동", "안서동", "영성동", "오룡동", "용곡동", "원성1동", "원성2동", "원성동", "유량동", "일봉동", "중앙동", "청당동", "청룡동", "청수동", "풍세면"],
  서북구: ["두정동", "백석동", "부대동", "부성1동", "부성2동", "불당1동", "불당2동", "불당동", "성거읍", "성성동", "성정1동", "성정2동", "성정동", "성환읍", "신당동", "쌍용1동", "쌍용2동", "쌍용3동", "쌍용동", "업성동", "와촌동", "입장면", "직산읍", "차암동"],
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

  const toggleSituation = (situation) => {
    setSelectedSituations((prev) =>
      prev.includes(situation)
        ? prev.filter((item) => item !== situation)
        : [...prev, situation]
    );
  };

  const removeSituation = (situation) => {
    setSelectedSituations((prev) =>
      prev.filter((item) => item !== situation)
    );
  };

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
      situations: ["혼밥", "가성비"],
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
      situations: ["특별한 날", "데이트"],
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
      situations: ["야식/늦은 밤"],
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
      situations: ["가족 모임"],
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
      situations: ["특별한 날", "친구/회식"],
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
      situations: ["데이트", "뷰 맛집"],
    },
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchRegion =
      !selectedDong && !selectedGu
        ? true
        : selectedDong
        ? restaurant.location.includes(selectedDong)
        : restaurant.location.includes(selectedGu);

    const matchCategory =
      !selectedCategory || restaurant.category === selectedCategory;

    const matchKeyword =
      !keyword ||
      restaurant.name.includes(keyword) ||
      restaurant.category.includes(keyword) ||
      restaurant.popular_menu.includes(keyword);

    const matchSituation =
      selectedSituations.length === 0 ||
      selectedSituations.every((situation) =>
        restaurant.situations?.includes(situation)
      );

    return matchRegion && matchCategory && matchKeyword && matchSituation;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortType === "review") {
      return b.review_count - a.review_count;
    }

    if (sortType === "rating") {
      return b.average_rating - a.average_rating;
    }

    if (sortType === "latest") {
      return a.id - b.id;
    }

    return 0;
  });

  return (
    <main className="search-page">
      <section className="search-hero">
        <div className="search-hero-content">
          <h1>
            오늘은 어디서 먹을까?
          </h1>
          <p>실제 리뷰 기반으로 찾는 우리 동네 진짜 맛집</p>
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-group">
          <p className="filter-title">지역</p>

          <button
            className={!selectedGu ? "filter-active" : ""}
            onClick={() => {
              setSelectedGu("");
              setSelectedDong("");
            }}
          >
            천안 전체
          </button>

          <div className="select-wrap">
            <select
              className="filter-select"
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
                  <option key={dong} value={dong}>
                    {dong}
                  </option>
                ))}
            </select>
            <FaAngleDown />
          </div>
          
        </div>

        <div className="filter-group">
          <p className="filter-title">음식 카테고리</p>
          <button
            className={!selectedCategory ? "filter-active" : ""}
            onClick={() => setSelectedCategory("")}
          >
            전체
          </button>
          <button
            className={selectedCategory === "한식" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("한식")}
          >
            🍚 한식
          </button>
          <button className={selectedCategory === "중식" ? "filter-active" : ""} onClick={() => setSelectedCategory("중식")}>🥢 중식</button>
          <button className={selectedCategory === "일식" ? "filter-active" : ""} onClick={() => setSelectedCategory("일식")}>🍱 일식</button>
          <button className={selectedCategory === "양식" ? "filter-active" : ""} onClick={() => setSelectedCategory("양식")}>🍝 양식</button>
          <button className={selectedCategory === "카페" ? "filter-active" : ""} onClick={() => setSelectedCategory("카페")}>☕ 카페</button>
          <button className={selectedCategory === "술집" ? "filter-active" : ""} onClick={() => setSelectedCategory("술집")}>🍺 술집</button>
          <button className={selectedCategory === "디저트" ? "filter-active" : ""} onClick={() => setSelectedCategory("디저트")}>🍰 디저트</button>
          <button className={selectedCategory === "패스트푸드" ? "filter-active" : ""} onClick={() => setSelectedCategory("패스트푸드")}>🍔 패스트푸드</button>
        </div>

        <div className="filter-group">
          <p className="filter-title">상황 / 테마</p>
          <button
            className={selectedSituations.includes("혼밥") ? "filter-active" : ""}
            onClick={() => toggleSituation("혼밥")}
          >
            🍱 혼밥
          </button>
          <button
            className={selectedSituations.includes("데이트") ? "filter-active" : ""}
            onClick={() => toggleSituation("데이트")}
          >
            💑 데이트
          </button>
          <button className={selectedSituations.includes("가족 모임") ? "filter-active" : ""}
            onClick={() => toggleSituation("가족 모임")}>👨‍👩‍👧 가족 모임</button>
          <button className={selectedSituations.includes("친구/회식") ? "filter-active" : ""}
            onClick={() => toggleSituation("친구/회식")}>🍻 친구/회식</button>
          <button className={selectedSituations.includes("가성비") ? "filter-active" : ""}
            onClick={() => toggleSituation("가성비")}>💰 가성비</button>
          <button className={selectedSituations.includes("특별한 날") ? "filter-active" : ""}
            onClick={() => toggleSituation("특별한 날")}>🎉 특별한 날</button>
          <button className={selectedSituations.includes("야식/늦은 밤") ? "filter-active" : ""}
            onClick={() => toggleSituation("야식/늦은 밤")}>🌙 야식/늦은 밤</button>
          <button className={selectedSituations.includes("조용한 곳") ? "filter-active" : ""}
            onClick={() => toggleSituation("조용한 곳")}>🤫 조용한 곳</button>
          <button className={selectedSituations.includes("뷰 맛집") ? "filter-active" : ""}
            onClick={() => toggleSituation("뷰 맛집")}>🌅 뷰 맛집</button>
          <button className={selectedSituations.includes("단체/모임") ? "filter-active" : ""}
            onClick={() => toggleSituation("단체/모임")}>👥 단체/모임</button>
        </div>
      </section>

      <section className="result-section">
        <div className="result-header">
          <div>
            <strong>총 {filteredRestaurants.length}개의 맛집</strong>

            <div className="selected-tags">
              <span>
                {selectedDong || selectedGu || "천안 전체"}
              </span>

              {selectedCategory && <span>{selectedCategory}</span>}
              {keyword && <span>{keyword}</span>}
              {selectedSituations.map((situation) => (
                <span key={situation} className="tag-removable">
                  {situation}
                  <button
                    type="button"
                    onClick={() => removeSituation(situation)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="select-wrap">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="latest">기본 순</option>
              <option value="review">리뷰 많은 순</option>
              <option value="rating">별점 높은 순</option>
            </select>
            <FaAngleDown />
          </div>
          
        </div>
        <div className="search-result-grid">
          {sortedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => {}}
            />
          ))}
        </div>

      </section>
    </main>
  );
}

export default SearchPage;