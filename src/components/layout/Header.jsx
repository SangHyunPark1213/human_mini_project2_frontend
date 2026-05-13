import "./Header.css";

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
        <div className="logo-area" role="button" tabIndex={0} aria-label="홈으로 이동">
          <span className="logo-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/>
              <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/>
              <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/>
            </svg>
          </span>
          <div className="logo-text-wrap">
            <span className="logo-text">천안맛.zip</span>
          </div>
        </div>

        {/* 네비 */}
        <nav className="header-nav" aria-label="사용자 메뉴">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#ff6b35" stroke="none">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
                {user?.nickname}님
              </span>
              <button className="btn-logout" onClick={onLogoutClick}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={onLoginClick}>로그인</button>
              <button className="btn-signup" onClick={onSignupClick}>회원가입</button>
            </>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;
