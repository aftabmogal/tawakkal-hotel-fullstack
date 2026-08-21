import client from './client'

export const getFacilities = (category) =>
  client
    .get('/facilities/', { params: category ? { category } : {} })
    .then((r) => r.data.results ?? r.data)

// --- Admin ---

export const createFacility = (payload) => client.post('/facilities/', payload).then((r) => r.data)

export const updateFacility = (id, payload) =>
  client.patch(`/facilities/${id}/`, payload).then((r) => r.data)

export const deleteFacility = (id) => client.delete(`/facilities/${id}/`)
