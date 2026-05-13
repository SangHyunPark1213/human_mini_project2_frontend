import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import AuthModal from "./components/common/AuthModal";
import MainPage from "./pages/MainPage";

function App() {
  const [modal, setModal] = useState(null);
  // 새로고침 시 localStorage에서 유저 정보 복원
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

  return (
    <div>
      <Header
        isLoggedIn={!!user}
        user={user}
        onLoginClick={() => setModal("login")}
        onSignupClick={() => setModal("signup")}
        onLogoutClick={handleLogout}
      />

      <MainPage />

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
