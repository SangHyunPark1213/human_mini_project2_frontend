import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import AuthModal from "./components/common/AuthModal";
import MainPage from "./pages/MainPage";
import RestaurantDetailPage from "./components/restaurant/RestaurantDetailPage";

function App() {
  const [modal, setModal] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
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

  // 상세 페이지가 선택되면 상세 페이지만 렌더링
  if (selectedRestaurant) {
    // 상세 페이지 진입 시 스크롤 맨 위로 초기화
    window.scrollTo(0, 0);
    return (
      <RestaurantDetailPage
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />
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
