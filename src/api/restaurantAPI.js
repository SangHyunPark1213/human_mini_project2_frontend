const BASE_URL = "/api/restaurants";

/**
 * 전체 식당 목록 조회
 * GET /api/restaurants?category=xxx
 */
export async function getRestaurants(category) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("식당 목록 조회 실패");
  return res.json();
}

/**
 * 식당 단건 조회
 * GET /api/restaurants/:id
 */
export async function getRestaurantById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("식당 조회 실패");
  return res.json();
}
