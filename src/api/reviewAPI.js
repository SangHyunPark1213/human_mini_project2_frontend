const BASE_URL = '/api/reviews';

/**
 * 식당별 리뷰 목록 조회
 * GET /api/reviews?restaurantId=xxx&sort=xxx
 */
export async function getReviewsByRestaurant(restaurantId, sort = 'latest') {
  const params = new URLSearchParams();
  params.set('restaurantId', restaurantId);
  params.set('sort', sort);
  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('리뷰 목록 조회 실패');
  return res.json();
}

/**
 * 도움돼요 토글
 * POST /api/reviews/:reviewId/interaction?type=HELPFUL
 */
export async function toggleHelpful(reviewId) {
  const res = await fetch(`${BASE_URL}/${reviewId}/interaction?type=HELPFUL`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('도움돼요 처리 실패');
  return res.json();
}

/**
 * 리뷰 등록
 * POST /api/reviews
 * @param {{ restaurantId, memberId, rating, content, revisit, receiptUrl, imageUrls, situations }} req
 */
export async function createReview(req) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `리뷰 등록 실패 (${res.status})`);
  }
  return res.text();
}
