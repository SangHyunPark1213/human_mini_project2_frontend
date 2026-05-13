import { useState, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { LuUpload, LuX, LuSparkles } from "react-icons/lu";
import Button from "../components/common/Button";
import "./ReviewWritePage.css";

const TAGS = [
  "친절함", "분위기좋음", "주차가능", "데이트추천", "가성비", "재방문", "주차편함", "혼밥가능", "웨이팅있음", "재방문의사",
];

const ReviewWritePage = ({ restaurant, user, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState(restaurant?.name || "");
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...previews].slice(0, 10));
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!rating) return alert("별점을 선택해주세요.");
    if (text.trim().length < 10) return alert("리뷰를 10자 이상 작성해주세요.");
    alert("리뷰가 등록되었습니다!");
    onClose();
  };

  const displayRating = hoverRating || rating;

  const ratingLabels = ["", "별로예요", "그저 그래요", "괜찮아요", "좋아요", "최고예요!"];

  return (
    <div className="review-write-page">
      {/* 상단 네비 */}
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
                className={"rwp-star" + (star <= displayRating ? " active" : "")}
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
          <div
            className="rwp-upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            {images.length === 0 ? (
              <>
                <LuUpload size={32} className="rwp-upload-icon" />
                <p className="rwp-upload-text">클릭하거나 드래그하여 이미지 업로드</p>
                <p className="rwp-upload-hint">PNG, JPG 파일 (최대 10장)</p>
              </>
            ) : (
              <div className="rwp-image-grid">
                {images.map((img, i) => (
                  <div key={i} className="rwp-image-item">
                    <img src={img.url} alt={img.name} />
                    <button
                      className="rwp-image-remove"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    >
                      <LuX size={12} />
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <div className="rwp-image-add">
                    <LuUpload size={20} />
                    <span>추가</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </section>

        {/* 리뷰 텍스트 */}
        <section className="rwp-card">
          <p className="rwp-label">리뷰를 작성해주세요</p>
          <div className="rwp-textarea-wrap">
            <textarea
              className="rwp-textarea"
              placeholder="이 맛집에 대한 솔직한 후기를 남겨주세요. 음식의 맛, 서비스, 분위기 등을 자세하게 작성해주세요."
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              rows={5}
            />
            <div className="rwp-textarea-footer">
              <span className="rwp-char-count">{text.length} / 500자</span>
              <button className="rwp-ai-btn">
                <LuSparkles size={13} /> AI 추천문구 보기
              </button>
            </div>
          </div>
        </section>

        {/* 태그 */}
        <section className="rwp-card">
          <p className="rwp-label">분위기 태그를 선택해주세요</p>
          <p className="rwp-sublabel">이 장소의 특징 중 맞는 것을 나타내는 태그를 선택하세요</p>
          <div className="rwp-tags">
            {TAGS.map((tag) => (
              <button
                key={tag}
                className={"rwp-tag" + (selectedTags.includes(tag) ? " selected" : "")}
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
              <p className="rwp-preview-name">{user?.nickname || "나의 리뷰"}</p>
              <div className="rwp-preview-stars">
                {[1,2,3,4,5].map((s) => (
                  <FaStar key={s} style={{ color: s <= rating ? "#ffb830" : "#ddd", fontSize: 14 }} />
                ))}
              </div>
              {text && <p className="rwp-preview-text">{text}</p>}
              {selectedTags.length > 0 && (
                <div className="rwp-preview-tags">
                  {selectedTags.map((t) => (
                    <span key={t} className="rwp-preview-tag">#{t}</span>
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
