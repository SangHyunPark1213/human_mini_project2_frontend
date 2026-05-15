import axios from './axios';

/**
 * 전체 식당 목록 조회
 * GET /api/restaurants?category=xxx&keyword=xxx
 */
export async function getRestaurants(category, keyword) {
  const params = {};
  if (category) params.category = category;
  if (keyword) params.keyword = keyword;

  const res = await axios.get('/restaurants', { params });
  return res.data;
}

/**
 * 식당 단건 조회
 * GET /api/restaurants/:id
 */
export async function getRestaurantById(id) {
  const res = await axios.get(`/restaurants/${id}`);
  return res.data;
}