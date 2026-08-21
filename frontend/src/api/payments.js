import client from './client'

export const createOrder = (bookingPk) =>
  client.post(`/bookings/${bookingPk}/create-order/`).then((r) => r.data)

export const verifyPayment = (bookingPk, payload) =>
  client.post(`/bookings/${bookingPk}/verify-payment/`, payload).then((r) => r.data)
