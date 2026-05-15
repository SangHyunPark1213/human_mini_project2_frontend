import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Header from "./components/layout/Header";
import AuthModal from "./components/common/AuthModal";
import MainPage from "./pages/MainPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import ReviewWritePage from "./pages/ReviewWritePage";
import SearchPage from "./pages/SearchPage";

// BrowserRouter 내부에서 동작하는 실제 앱 컴포넌트
function AppInner() {
  const [modal, setModal] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [writingReview, setWritingReview] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("loginUser");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    sessionStorage.setItem("loginUser", JSON.stringify(userData));
    setModal(null);
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("loginUser");
    setModal(null);
    setSelectedRestaurant(null);
    setWritingReview(false);
    navigate("/");
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    window.scrollTo(0, 0);
  };

  // 리뷰 작성 페이지
  if (writingReview) {
    window.scrollTo(0, 0);
    return (
      <ReviewWritePage
        restaurant={selectedRestaurant}
        user={user}
        onClose={() => setWritingReview(false)}
        onReviewSubmitted={() => {
          setReviewRefreshKey((k) => k + 1);
          setWritingReview(false);
        }}
      />
    );
  }

  // 식당 상세 페이지
  if (selectedRestaurant) {
    window.scrollTo(0, 0);
    return (
      <>
        <RestaurantDetailPage
          restaurant={selectedRestaurant}
          user={user}
          refreshKey={reviewRefreshKey}
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
              setUser(userData);
              sessionStorage.setItem("loginUser", JSON.stringify(userData));
              setModal(null);
              setWritingReview(true);
            }}
            onSwitchMode={setModal}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Header
        isLoggedIn={!!user}
        user={user}
        onLoginClick={() => setModal("login")}
        onSignupClick={() => setModal("signup")}
        onLogoutClick={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<MainPage onRestaurantClick={handleRestaurantClick} />}
        />
        <Route
          path="/search"
          element={<SearchPage onRestaurantClick={handleRestaurantClick} />}
        />
      </Routes>

      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchMode={setModal}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
