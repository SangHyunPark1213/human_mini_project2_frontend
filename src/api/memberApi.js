const BASE_URL = '/api/members';

/**
 * 회원가입 API
 * POST /api/members/join
 * @param {{ email: string, password: string, nickname: string }} data
 * @returns {Promise<string>} "회원가입 성공" 메시지
 */
export async function joinApi(data) {
  const res = await fetch(`${BASE_URL}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 세션 쿠키 포함
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // 서버에서 에러 메시지를 텍스트로 반환할 수 있음
    const text = await res.text();
    throw new Error(text || `회원가입 실패 (${res.status})`);
  }

  return res.text();
}

/**
 * 로그인 API
 * POST /api/members/login
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ id: number, email: string, nickname: string, role: string }>}
 */
export async function loginApi(data) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // JSESSIONID 쿠키를 받아 저장
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `로그인 실패 (${res.status})`);
  }

  return res.json();
}

/**
 * 로그아웃 (클라이언트 세션 정리)
 * 백엔드 로그아웃 엔드포인트가 없는 경우 클라이언트 측에서만 처리
 */
export async function logoutApi() {
  // 백엔드 /admin/logout은 admin 전용이므로 일반 사용자는 클라이언트 정리만 수행
  // 필요 시 백엔드에 /api/members/logout 추가 후 여기에 fetch 추가
  return Promise.resolve();
}