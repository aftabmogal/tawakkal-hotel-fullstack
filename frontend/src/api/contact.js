import client from './client'

export const sendContactMessage = (payload) => client.post('/contact/', payload)

// --- Admin ---

export const getContactMessages = () =>
  client.get('/contact/').then((r) => r.data.results ?? r.data)

export const markMessageRead = (id, isRead) =>
  client.patch(`/contact/${id}/`, { is_read: isRead }).then((r) => r.data)
