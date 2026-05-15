import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import Button from "../components/common/Button";
import "./ReviewWritePage.css";
import PhotoUploader from "../components/restaurant/PhotoUploader";
import { createReview } from "../api/reviewAPI";

const TAGS = [
  "친절함",
  "분위기좋음",
  "주차가능",
  "데이트추천",
  "가성비",
  "재방문",
  "주차편함",
  "혼밥가능",
  "웨이팅있음",
  "재방문의사",
];

const AI_SUGGESTIONS = [
  "음식이 정말 맛있고 신선했어요! 직원분들도 매우 친절하셨고, 분위기도 아늑해서 오랜만에 기분 좋은 식사를 했습니다. 다음에도 꼭 다시 방문하고 싶어요.",
  "가성비가 훌륭한 맛집입니다. 양도 넉넉하고 맛도 뛰어나서 친구들과 함께 왔는데 모두 만족했어요. 주차도 편리해서 이용하기 좋았습니다.",
  "분위기가 너무 좋아서 데이트 장소로 완벽했어요. 음식은 정성스럽게 준비되어 있고 플레이팅도 예뻐서 사진도 많이 찍었습니다. 강력 추천합니다!",
  "혼밥하기도 부담 없는 곳이에요. 대표 메뉴를 시켜봤는데 기대 이상으로 맛있었고, 직원분들이 편안하게 대해주셔서 좋았습니다.",
  "재료가 신선하고 요리 실력이 뛰어난 것 같아요. 처음 와봤는데 이미 단골이 될 것 같은 느낌입니다. 메뉴 구성도 다양하고 가격도 합리적입니다.",
];

const ReviewWritePage = ({ restaurant, user, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState(restaurant?.name || "");
  const [imageUrls, setImageUrls] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    if (!rating) return alert("별점을 선택해주세요.");
    if (text.trim().length < 10) return alert("리뷰를 10자 이상 작성해주세요.");
    if (!restaurant?.id) return alert("식당 정보가 없습니다.");
    if (!user?.id) return alert("로그인이 필요합니다.");

    try {
      await createReview({
        restaurantId: restaurant.id,
        memberId: user.id,
        rating,
        content: text,
        revisit:
          selectedTags.includes("재방문") || selectedTags.includes("재방문의사")
            ? "Y"
            : "N",
        receiptUrl: null,
        imageUrls: [],
        situations: selectedTags,
      });
      alert("리뷰가 등록되었습니다!");
      if (onReviewSubmitted) onReviewSubmitted();
      else onClose();
    } catch (err) {
      alert(err.message || "리뷰 등록에 실패했습니다.");
    }
  };

  const displayRating = hoverRating || rating;
  const ratingLabels = [
    "",
    "별로예요",
    "그저 그래요",
    "괜찮아요",
    "좋아요",
    "최고예요!",
  ];

  return (
    <div className="review-write-page">
      <div className="rwp-nav">
        <button className="rwp-back-btn" onClick={onClose}>
          <IoArrowBack size={18} />
          돌아가기
        </button>
        <span className="rwp-nav-title">리뷰 작성</span>
        <div style={{ width: 80 }} />
      </div>

      <div className="rwp-body">
        {/* 맛집 검색 */}
        <section className="rwp-card">
          <p className="rwp-label">어떤 맛집을 방문하셨나요?</p>
          <input
            className="rwp-search-input"
            type="text"
            placeholder="맛집 이름을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>

        {/* 별점 */}
        <section className="rwp-card rwp-star-card">
          <p className="rwp-label">별점을 남겨주세요</p>
          <div className="rwp-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  "rwp-star" + (star <= displayRating ? " active" : "")
                }
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <FaStar />
              </span>
            ))}
          </div>
          {displayRating > 0 && (
            <p className="rwp-rating-label">{ratingLabels[displayRating]}</p>
          )}
        </section>

        {/* 사진 업로드 */}
        <section className="rwp-card">
          <p className="rwp-label">사진을 올려주세요</p>
          <PhotoUploader
            maxCount={3}
            onUploadComplete={(urls) => {
              setImageUrls((prev) => [...prev, ...urls]);
            }}
          />
        </section>

        {/* 리뷰 텍스트 */}
        <section className="rwp-card">
          <p className="rwp-label">리뷰를 작성해주세요</p>
          <div className="rwp-textarea-wrap">
            <textarea
              className="rwp-textarea"
              placeholder="이 맛집에 대한 솔직한 후기를 남겨주세요."
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              rows={5}
            />
            <div className="rwp-textarea-footer">
              <span className="rwp-char-count">{text.length} / 500자</span>
              <button
                className="rwp-ai-btn"
                onClick={() => setShowAiSuggestions((prev) => !prev)}
              >
                <LuSparkles size={13} /> AI 추천문구 보기
              </button>
            </div>
          </div>

          {/* AI 추천문구 패널 */}
          {showAiSuggestions && (
            <div className="rwp-ai-panel">
              <p className="rwp-ai-panel-title">
                ✨ AI 추천 문구 — 클릭하면 입력돼요
              </p>
              <div className="rwp-ai-list">
                {AI_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="rwp-ai-item"
                    onClick={() => {
                      setText(s.slice(0, 500));
                      setShowAiSuggestions(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 태그 */}
        <section className="rwp-card">
          <p className="rwp-label">분위기 태그를 선택해주세요</p>
          <p className="rwp-sublabel">
            이 장소의 특징 중 맞는 것을 나타내는 태그를 선택하세요
          </p>
          <div className="rwp-tags">
            {TAGS.map((tag) => (
              <button
                key={tag}
                className={
                  "rwp-tag" + (selectedTags.includes(tag) ? " selected" : "")
                }
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* 미리보기 */}
        <section className="rwp-card rwp-preview-card">
          <p className="rwp-preview-title">👀 미리보기</p>
          <div className="rwp-preview">
            <div className="rwp-preview-avatar">
              {user?.nickname?.[0] || "나"}
            </div>
            <div className="rwp-preview-content">
              <p className="rwp-preview-name">
                {user?.nickname || "나의 리뷰"}
              </p>
              <div className="rwp-preview-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar
                    key={s}
                    style={{
                      color: s <= rating ? "#ffb830" : "#ddd",
                      fontSize: 14,
                    }}
                  />
                ))}
              </div>
              {text && <p className="rwp-preview-text">{text}</p>}
              {selectedTags.length > 0 && (
                <div className="rwp-preview-tags">
                  {selectedTags.map((t) => (
                    <span key={t} className="rwp-preview-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 제출 버튼 */}
        <Button variant="primary" size="lg" onClick={handleSubmit}>
          리뷰 등록하기
        </Button>
      </div>
    </div>
  );
};

export default ReviewWritePage;
