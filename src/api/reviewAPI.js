const BASE_URL = '/api/reviews';

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
