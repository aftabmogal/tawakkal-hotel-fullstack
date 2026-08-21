import client from './client'

function normalizeBooking(b) {
  return {
    id: b.booking_id,
    pk: b.id,
    roomId: b.room,
    roomName: b.room_name,
    guestName: b.guest_name,
    guestEmail: b.guest_email,
    guestPhone: b.guest_phone,
    checkIn: b.check_in,
    checkOut: b.check_out,
    adults: b.adults,
    children: b.children,
    specialRequests: b.special_requests,
    nights: b.nights,
    pricePerNight: Number(b.price_per_night),
    total: Number(b.total_amount),
    bookingStatus: b.booking_status,
    paymentStatus: b.payment_status,
    createdAt: b.created_at,
  }
}

export async function createBooking({
  roomId, guestName, guestEmail, guestPhone,
  checkIn, checkOut, adults, children, specialRequests,
}) {
  const { data } = await client.post('/bookings/', {
    room: roomId,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
    check_in: checkIn,
    check_out: checkOut,
    adults,
    children,
    special_requests: specialRequests,
  })
  return normalizeBooking(data)
}

export async function getMyBookings() {
  const { data } = await client.get('/bookings/')
  const results = data.results ?? data
  return results.map(normalizeBooking)
}

export async function cancelBooking(pk) {
  const { data } = await client.post(`/bookings/${pk}/cancel/`)
  return normalizeBooking(data)
}

// --- Admin ---

export async function getBookings(params = {}) {
  const { data } = await client.get('/bookings/', { params })
  const results = data.results ?? data
  return results.map(normalizeBooking)
}

export async function updateBookingStatus(pk, payload) {
  const backendPayload = {}
  if (payload.bookingStatus) backendPayload.booking_status = payload.bookingStatus
  if (payload.paymentStatus) backendPayload.payment_status = payload.paymentStatus
  const { data } = await client.patch(`/bookings/${pk}/`, backendPayload)
  return normalizeBooking(data)
}
