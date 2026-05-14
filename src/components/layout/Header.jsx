import "./Header.css";
import logo from "../../assets/logo.png";

const Header = ({
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  isLoggedIn,
  user,
}) => {
  return (
    <header className="header">
      <div className="header-inner">
        {/* 로고 */}
        <div
          className="logo-area"
          role="button"
          tabIndex={0}
          aria-label="홈으로 이동"
        >
          <img src={logo} alt="천안맛ZIP" className="logo-img" />
        </div>

        {/* 네비 */}
        <nav className="header-nav" aria-label="사용자 메뉴">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="#ff6b35"
                  stroke="none"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                {user?.nickname}님
              </span>

              {user?.role === "ADMIN" && (
                <button
                  className="btn-admin"
                  onClick={() =>
                    (window.location.href = "http://localhost:8111/admin")
                  }
                >
                  관리자 페이지
                </button>
              )}

              <button className="btn-logout" onClick={onLogoutClick}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={onLoginClick}>
                로그인
              </button>

              <button className="btn-signup" onClick={onSignupClick}>
                회원가입
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
