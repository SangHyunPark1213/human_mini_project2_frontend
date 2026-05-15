import axios from './axios';

/**
 * 식당별 리뷰 목록 조회
 * GET /api/reviews?restaurantId=xxx
 */
export async function getReviewsByRestaurant(restaurantId) {
  const res = await axios.get('/reviews', {
    params: { restaurantId },
  });
  return res.data;
}

/**
 * 리뷰 등록
 * POST /api/reviews
 */
export async function createReview(req) {
  const res = await axios.post('/reviews', req);
  return res.data;
}

/**
 * 리뷰 수정
 * PUT /api/reviews/:reviewId
 */
export async function updateReview(reviewId, req) {
  const res = await axios.put(`/reviews/${reviewId}`, req);
  return res.data;
}

/**
 * 리뷰 삭제
 * DELETE /api/reviews/:reviewId?restaurantId=xxx
 */
export async function deleteReview(reviewId, restaurantId) {
  const res = await axios.delete(`/reviews/${reviewId}`, {
    params: { restaurantId },
  });
  return res.data;
}

/**
 * 도움돼요 토글
 * POST /api/reviews/:reviewId/interaction?type=HELPFUL
 */
export async function toggleHelpful(reviewId) {
  const res = await axios.post(`/reviews/${reviewId}/interaction`, null, {
    params: { type: 'HELPFUL' },
  });
  return res.data;
}