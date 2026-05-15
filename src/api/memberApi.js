import axios from './axios';

/**
 * 회원가입
 * POST /api/members/join
 */
export async function joinApi(data) {
  const res = await axios.post('/members/join', data);
  return res.data;
}

/**
 * 로그인
 * POST /api/members/login
 */
export async function loginApi(data) {
  const res = await axios.post('/members/login', data);
  return res.data;
}

/**
 * 로그아웃 (클라이언트 정리만)
 */
export async function logoutApi() {
  return Promise.resolve();
}