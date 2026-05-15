import { useState } from "react";
import { createPortal } from "react-dom";
import "./AuthModal.css";
import { loginApi, joinApi } from "../../api/memberAPI";
import {
  Mail,
  Lock,
  User,
  Check,
  Eye,
  EyeOff,
  MessageCircle,
  X,
} from "lucide-react";
import socialComingSoon from "../../assets/social-coming-soon.png";

const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return {
    level: score,
    label: ["", "취약", "보통", "강함", "매우 강함"][score],
  };
};

function SocialComingSoonModal({ onClose }) {
  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          maxWidth: 480,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            background: "rgba(0,0,0,0.4)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
        <img
          src={socialComingSoon}
          alt="간편 로그인 준비 중"
          style={{ width: "100%", display: "block" }}
        />
      </div>
    </div>,
    document.body,
  );
}

export default function AuthModal({
  mode,
  onClose,
  onLoginSuccess,
  onSwitchMode,
}) {
  const isLogin = mode === "login";
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    nickname: "",
    password: "",
    confirm: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(signupForm.password);

  const handleLoginChange = (field) => (e) =>
    setLoginForm((p) => ({
      ...p,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const handleSignupChange = (field) => (e) =>
    setSignupForm((p) => ({
      ...p,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const userData = await loginApi({
        email: loginForm.email,
        password: loginForm.password,
      });
      onLoginSuccess(userData);
      onClose();
    } catch (err) {
      setError(
        err.message.includes("401") || err.message.includes("403")
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : err.message || "로그인 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  const validateSignup = () => {
    if (!signupForm.name.trim()) return "이름을 입력해주세요.";
    if (!signupForm.email.trim()) return "이메일을 입력해주세요.";
    if (!signupForm.nickname.trim() || signupForm.nickname.trim().length < 2)
      return "닉네임은 2자 이상이어야 합니다.";
    if (signupForm.password.length < 6)
      return "비밀번호는 6자 이상이어야 합니다.";
    if (signupForm.password !== signupForm.confirm)
      return "비밀번호가 일치하지 않습니다.";
    if (!signupForm.agreeTerms) return "이용약관에 동의해주세요.";
    if (!signupForm.agreePrivacy) return "개인정보 처리방침에 동의해주세요.";
    return null;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validateSignup();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await joinApi({
        email: signupForm.email.trim(),
        password: signupForm.password,
        nickname: signupForm.nickname.trim(),
      });
      const userData = await loginApi({
        email: signupForm.email.trim(),
        password: signupForm.password,
      });
      onLoginSuccess(userData);
      onClose();
    } catch (err) {
      setError(
        err.message.includes("이미") ||
          err.message.toLowerCase().includes("duplicate")
          ? "이미 사용 중인 이메일입니다."
          : err.message || "회원가입 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSocialModal && (
        <SocialComingSoonModal onClose={() => setShowSocialModal(false)} />
      )}
      <div
        className="auth-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) onClose();
        }}
      >
        <div className="auth-page">
          {/* LEFT */}
          <div
            className="auth-left"
            style={{
              backgroundImage: isLogin
                ? "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1400&auto=format&fit=crop')"
                : "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop')",
            }}
          >
            <div className="auth-left-overlay" />
            <div className="auth-left-content">
              <h1 className="auth-left-title">
                {isLogin ? "천안맛.zip" : "시작하세요"}
              </h1>
              <p className="auth-left-sub">
                {isLogin ? (
                  <>
                    실제 리뷰 기반으로 찾는 <br />
                    우리 동네 진짜 맛집
                  </>
                ) : (
                  <>
                    천안맛.zip와 함께 새로운 맛집 <br />
                    여정을 시작하세요
                  </>
                )}
              </p>
              <div className="auth-feature-list">
                {[
                  {
                    title: "신뢰할 수 있는 리뷰",
                    sub: "실제 방문자들의 진솔한 후기",
                  },
                  { title: "개인화된 추천", sub: "취향에 맞는 맛집 발견" },
                  { title: "커뮤니티 기반", sub: "맛집 정보 공유와 소통" },
                ].map(({ title, sub }) => (
                  <div key={title} className="auth-feature-item">
                    <div className="feature-icon">
                      <Check size={15} />
                    </div>
                    <div>
                      <strong>{title}</strong>
                      <p>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="auth-right">
            <button type="button" className="auth-close-btn" onClick={onClose}>
              ✕
            </button>
            <div className="auth-form-wrap">
              <h2 className="auth-form-title">
                {isLogin ? "로그인" : "회원가입"}
              </h2>
              <p className="auth-form-sub">
                {isLogin
                  ? "천안맛.zip에 오신 것을 환영합니다"
                  : "천안맛.zip 커뮤니티에 참여하세요"}
              </p>
              {error && <p className="auth-error">{error}</p>}

              {isLogin ? (
                <form className="auth-form" onSubmit={handleLoginSubmit}>
                  {/* 이메일 */}
                  <div className="auth-field">
                    <label>이메일</label>
                    <div className="auth-field-column">
                      <div className="auth-input-wrap">
                        <Mail size={18} className="input-icon" />
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={loginForm.email}
                          onChange={handleLoginChange("email")}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                  {/* 비밀번호 */}
                  <div className="auth-field">
                    <label>비밀번호</label>
                    <div className="auth-field-column">
                      <div className="auth-input-wrap">
                        <Lock size={18} className="input-icon" />
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={handleLoginChange("password")}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                        >
                          {showLoginPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="auth-btn-primary"
                    disabled={loading}
                  >
                    {loading ? "로그인 중..." : "로그인"}
                  </button>

                  <div className="auth-divider">
                    <span>또는</span>
                  </div>

                  <div className="social-login-list">
                    <button
                      type="button"
                      className="social-btn kakao"
                      onClick={() => setShowSocialModal(true)}
                    >
                      <MessageCircle size={18} /> 카카오로 시작하기
                    </button>
                    <button
                      type="button"
                      className="social-btn naver"
                      onClick={() => setShowSocialModal(true)}
                    >
                      N 네이버로 시작하기
                    </button>
                    <button
                      type="button"
                      className="social-btn google"
                      onClick={() => setShowSocialModal(true)}
                    >
                      G Google로 시작하기
                    </button>
                  </div>

                  <p className="auth-switch">
                    아직 계정이 없으신가요?
                    <button
                      type="button"
                      onClick={() => onSwitchMode("signup")}
                    >
                      회원가입
                    </button>
                  </p>
                </form>
              ) : (
                <form className="auth-form" onSubmit={handleSignupSubmit}>
                  {/* 이름 */}
                  <div className="auth-field">
                    <label>이름</label>
                    <div className="auth-field-column">
                      <div className="auth-input-wrap">
                        <User size={18} className="input-icon" />
                        <input
                          type="text"
                          placeholder="홍길동"
                          value={signupForm.name}
                          onChange={handleSignupChange("name")}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                  {/* 이메일 */}
                  <div className="auth-field">
                    <label>이메일</label>
                    <div className="auth-field-column">
                      <div className="auth-input-wrap">
                        <Mail size={18} className="input-icon" />
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={signupForm.email}
                          onChange={handleSignupChange("email")}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                  {/* 닉네임 */}
                  <div className="auth-field">
                    <label>닉네임</label>
                    <div className="auth-field-column">
                      <div className="auth-input-wrap">
                        <User size={18} className="input-icon" />
                        <input
                          type="text"
                          placeholder="맛집러버"
                          value={signupForm.nickname}
                          onChange={handleSignupChange("nickname")}
                          disabled={loading}
                        />
                      </div>
                      <p className="auth-field-hint">
                        다른 사용자에게 표시되는 이름입니다
                      </p>
                    </div>
                  </div>
                  {/* 비밀번호 */}
                  <div className="auth-field">
                    <label>비밀번호</label>
                    <div className="auth-field-column">
                      <div className="auth-input-wrap">
                        <Lock size={18} className="input-icon" />
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupForm.password}
                          onChange={handleSignupChange("password")}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                        >
                          {showSignupPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {signupForm.password && (
                        <div className="password-strength">
                          <div className="strength-bars">
                            {[1, 2, 3, 4].map((n) => (
                              <div
                                key={n}
                                className={`strength-bar ${strength.level >= n ? `active level-${strength.level}` : ""}`}
                              />
                            ))}
                          </div>
                          <span
                            className={`strength-label level-${strength.level}`}
                          >
                            {strength.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 비밀번호 확인 */}
                  <div className="auth-field">
                    <label>비밀번호 확인</label>
                    <div className="auth-field-column">
                      <div className="auth-input-wrap">
                        <Lock size={18} className="input-icon" />
                        <input
                          type={showSignupConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupForm.confirm}
                          onChange={handleSignupChange("confirm")}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowSignupConfirm(!showSignupConfirm)
                          }
                        >
                          {showSignupConfirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* 약관 */}
                  <div className="auth-terms">
                    <label className="auth-terms-item">
                      <input
                        type="checkbox"
                        checked={signupForm.agreeTerms}
                        onChange={handleSignupChange("agreeTerms")}
                      />
                      <span>
                        <span className="required">(필수)</span> 이용약관 동의
                      </span>
                    </label>
                    <label className="auth-terms-item">
                      <input
                        type="checkbox"
                        checked={signupForm.agreePrivacy}
                        onChange={handleSignupChange("agreePrivacy")}
                      />
                      <span>
                        <span className="required">(필수)</span> 개인정보
                        처리방침 동의
                      </span>
                    </label>
                    <label className="auth-terms-item">
                      <input
                        type="checkbox"
                        checked={signupForm.agreeMarketing}
                        onChange={handleSignupChange("agreeMarketing")}
                      />
                      <span>(선택) 마케팅 정보 수신 동의</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="auth-btn-primary"
                    disabled={loading}
                  >
                    {loading ? "가입 중..." : "회원가입"}
                  </button>

                  <p className="auth-switch">
                    이미 계정이 있으신가요?
                    <button type="button" onClick={() => onSwitchMode("login")}>
                      로그인
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
