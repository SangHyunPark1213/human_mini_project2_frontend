import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import AuthModal from "./components/common/AuthModal";
import MainPage from "./pages/MainPage";
import RestaurantDetailPage from "./components/restaurant/RestaurantDetailPage";
import ReviewWritePage from "./pages/ReviewWritePage";
import SearchPage from "./pages/SearchPage"; // ✅ 검색 브랜치꺼 추가

function App() {
  const [modal, setModal] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // ✅ HEAD꺼 유지
  const [writingReview, setWritingReview] = useState(false); // ✅ HEAD꺼 유지
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("loginUser");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("loginUser", JSON.stringify(userData));
    setModal(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loginUser");
    setModal(null);
  };

  // 리뷰 작성 페이지 (조건부 렌더링 유지)
  if (writingReview) {
    window.scrollTo(0, 0);
    return (
      <ReviewWritePage
        restaurant={selectedRestaurant}
        user={user}
        onClose={() => setWritingReview(false)}
      />
    );
  }

  // 식당 상세 페이지 (조건부 렌더링 유지)
  if (selectedRestaurant) {
    window.scrollTo(0, 0);
    return (
      <>
        <RestaurantDetailPage
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onWriteReview={() => {
            if (!user) {
              setModal("login");
            } else {
              setWritingReview(true);
            }
          }}
        />
        {modal && (
          <AuthModal
            mode={modal}
            onClose={() => setModal(null)}
            onLoginSuccess={(userData) => {
              handleLoginSuccess(userData);
              setWritingReview(true);
            }}
            onSwitchMode={setModal}
          />
        )}
      </>
    );
  }

  return (
    <BrowserRouter>
      <Header
        isLoggedIn={!!user}
        user={user}
        onLoginClick={() => setModal("login")}
        onSignupClick={() => setModal("signup")}
        onLogoutClick={handleLogout}
      />

      {/* ✅ 검색 브랜치의 Routes 구조 채택 + MainPage에 클릭 핸들러도 유지 */}
      <Routes>
        <Route
          path="/"
          element={<MainPage onRestaurantClick={setSelectedRestaurant} />}
        />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchMode={setModal}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
