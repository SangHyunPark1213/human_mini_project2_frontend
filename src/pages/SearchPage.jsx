import { useSearchParams } from "react-router-dom";
import "./SearchPage.css";
import { useState } from "react";

function SearchPage() {
  const [searchParams] = useSearchParams();

  const region = searchParams.get("region") || "";
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(category || "");

  const [selectedSituation, setSelectedSituation] = useState("");

  // const handleSituationClick = (situation) => {
  //   setSelectedSituation(situation);
  // };

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

  const getInitialGu = () => {
    if (dongList["동남구"].includes(region)) return "동남구";
    if (dongList["서북구"].includes(region)) return "서북구";
    return "";
  };

  const [selectedGu, setSelectedGu] = useState(getInitialGu);
  const [selectedDong, setSelectedDong] = useState(
    region === "천안전체" ? "" : region,
  );

  const params = new URLSearchParams();

  if (selectedCategory) params.set("category", selectedCategory);
  if (selectedDong) params.set("region", selectedDong);
  if (selectedSituation) params.set("situation", selectedSituation);
  if (keyword) params.set("keyword", keyword);

  fetch(`/api/restaurants?${params.toString()}`);

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
            onClick={() => {
              setSelectedGu("");
              setSelectedDong("");
            }}
          >
            천안 전체
          </button>

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
          <button
            className={selectedCategory === "중식" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("중식")}
          >
            🥢 중식
          </button>
          <button
            className={selectedCategory === "일식" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("일식")}
          >
            🍱 일식
          </button>
          <button
            className={selectedCategory === "양식" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("양식")}
          >
            🍝 양식
          </button>
          <button
            className={selectedCategory === "카페" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("카페")}
          >
            ☕ 카페
          </button>
          <button
            className={selectedCategory === "술집" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("술집")}
          >
            🍺 술집
          </button>
          <button
            className={selectedCategory === "디저트" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("디저트")}
          >
            🍰 디저트
          </button>
          <button
            className={selectedCategory === "패스트푸드" ? "filter-active" : ""}
            onClick={() => setSelectedCategory("패스트푸드")}
          >
            🍔 패스트푸드
          </button>
        </div>

        <div className="filter-group">
          <p className="filter-title">상황 / 테마</p>
          <button
            className={selectedSituation === "혼밥" ? "filter-active" : ""}
            onClick={() => setSelectedSituation("혼밥")}
          >
            🍱 혼밥
          </button>
          <button
            className={selectedSituation === "데이트" ? "filter-active" : ""}
            onClick={() => setSelectedSituation("데이트")}
          >
            💑 데이트
          </button>
          <button
            className={selectedSituation === "데이트" ? "filter-active" : ""}
            onClick={() => setSelectedSituation("데이트")}
          >
            👨‍👩‍👧 가족 모임
          </button>
          <button>🍻 친구/회식</button>
          <button>💰 가성비</button>
          <button>🎉 특별한 날</button>
          <button>🌙 야식/늦은 밤</button>
          <button>🤫 조용한 곳</button>
          <button>🌅 뷰 맛집</button>
          <button>👥 단체/모임</button>
        </div>
      </section>

      <section className="result-section">
        <div className="result-header">
          <div>
            <strong>총 0개의 맛집</strong>

            <div className="selected-tags">
              <span>{selectedDong || selectedGu || "천안 전체"}</span>

              {selectedCategory && <span>{selectedCategory}</span>}
              {keyword && <span>{keyword}</span>}
            </div>
          </div>

          <select>
            <option>최신 순</option>
            <option>리뷰 많은 순</option>
            <option>별점 높은 순</option>
          </select>
        </div>
      </section>
    </main>
  );
}

export default SearchPage;
