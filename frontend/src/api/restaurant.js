import client from './client'

export async function getMenu() {
  const { data } = await client.get('/restaurant/categories/')
  return data.results ?? data
}

// --- Admin ---

export const createCategory = (payload) =>
  client.post('/restaurant/categories/', payload).then((r) => r.data)

export const updateCategory = (id, payload) =>
  client.patch(`/restaurant/categories/${id}/`, payload).then((r) => r.data)

export const deleteCategory = (id) => client.delete(`/restaurant/categories/${id}/`)

export const createFoodItem = (payload) =>
  client.post('/restaurant/items/', payload).then((r) => r.data)

export const updateFoodItem = (id, payload) =>
  client.patch(`/restaurant/items/${id}/`, payload).then((r) => r.data)

export const deleteFoodItem = (id) => client.delete(`/restaurant/items/${id}/`)
