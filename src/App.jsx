import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import AuthModal from "./components/common/AuthModal";
import MainPage from "./pages/MainPage";
import RestaurantDetailPage from "./components/restaurant/RestaurantDetailPage";
import ReviewWritePage from "./pages/ReviewWritePage";

function App() {
  const [modal, setModal] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [writingReview, setWritingReview] = useState(false);
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

  // 리뷰 작성 페이지
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

  // 상세 페이지
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
              setWritingReview(true); // 로그인 성공 시 바로 리뷰 작성으로 이동
            }}
            onSwitchMode={setModal}
          />
        )}
      </>
    );
  }

  return (
    <div>
      <Header
        isLoggedIn={!!user}
        user={user}
        onLoginClick={() => setModal("login")}
        onSignupClick={() => setModal("signup")}
        onLogoutClick={handleLogout}
      />

      <MainPage onRestaurantClick={setSelectedRestaurant} />

      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchMode={setModal}
        />
      )}
    </div>
  );
}

export default App;
