import { useState } from "react";
import { uploadImages } from "../../firebase/uploadImage";
import { LuUpload, LuX } from "react-icons/lu";

const PhotoUploader = ({ onUploadComplete, maxCount = 3 }) => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length + previews.length > maxCount) {
      setError(`사진은 최대 ${maxCount}장까지 업로드 가능합니다.`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const previewUrls = files.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setPreviews((prev) => [...prev, ...previewUrls]);

      const uploadedUrls = await uploadImages(files, "reviews");

      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }
    } catch (err) {
      console.error("업로드 실패:", err);
      setError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
            background: uploading ? "#9ca3af" : "#ff6b35",
            color: "#fff",
            borderRadius: 8,
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <LuUpload size={14} />
          {uploading
            ? "업로드 중..."
            : `사진 추가 (${previews.length}/${maxCount})`}
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={uploading}
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
