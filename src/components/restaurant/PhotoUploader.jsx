import { useState } from "react";
import { LuUpload, LuX } from "react-icons/lu";

const PhotoUploader = ({ onFilesChange, maxCount = 3 }) => {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + previews.length > maxCount) {
      setError(`사진은 최대 ${maxCount}장까지 업로드 가능합니다.`);
      return;
    }

    setError("");

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    const updated = [...previews, ...newPreviews];
    setPreviews(updated);

    // 파일 객체를 부모에게 전달
    if (onFilesChange) {
      onFilesChange(updated.map((p) => p.file));
    }
  };

  const handleRemove = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);

    if (onFilesChange) {
      onFilesChange(updated.map((p) => p.file));
    }
  };

  return (
    <div className="photo-uploader">
      {previews.length < maxCount && (
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "#ff6b35",
            color: "#fff",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <LuUpload size={14} />
          {`사진 추가 (${previews.length}/${maxCount})`}
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && (
        <p style={{ color: "red", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}

      {previews.length > 0 && (
        <div
          style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}
        >
          {previews.map((item, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={item.url}
                alt={`미리보기${index + 1}`}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #eee",
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  background: "#ff4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LuX size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
