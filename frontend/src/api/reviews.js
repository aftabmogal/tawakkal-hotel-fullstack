import client from './client'

export const getReviews = () => client.get('/reviews/').then((r) => r.data.results ?? r.data)

export const createReview = (payload) => client.post('/reviews/', payload)

// --- Admin ---

export const setReviewApproval = (id, isApproved) =>
  client.patch(`/reviews/${id}/`, { is_approved: isApproved }).then((r) => r.data)
